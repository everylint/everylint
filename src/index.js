const _ = require('lodash');
const cosmiconfig = require('cosmiconfig');
const globby = require('globby');
const reporter = require('vfile-reporter');
const SourceFile = require('./source-file');
const defaultLinters = require('./linters');

/**
 * Attempt to require a linter module or load a default one.
 *
 * @param {string} name
 */
function requireLinter(name) {
  try {
    return require(`everylint-linter-${name}`);
  } catch (err) {
    if (name in defaultLinters) {
      return defaultLinters[name];
    }
    throw new Error(`Cannot require \`everylint-linter-${name}\`!`);
  }
}

/**
 * Merge default and custom linters, load and init them.
 *
 * @param {object} config
 */
function loadLinters(config) {
  const modules = _.union(
    Object.keys(config.linters),
    Object.keys(defaultLinters),
  ).filter(name => config.linters[name] !== null);

  const linters = {};

  for (let name of modules) {
    const Linter = requireLinter(name);
    linters[name] = new Linter(config.linters[name]);
  }

  return linters;
}

/**
 * Creates a type matcher.
 * Type matcher is a function that matches file against linter's
 * condition in matchFile method.
 *
 * @param {object} linters
 */
function createTypesMatcher(linters) {
  return file => {
    for (let [name, linter] of Object.entries(linters)) {
      file.types[name] = linter.matchFile(file);
    }

    return file;
  };
}

/**
 * Takes linters and returns a linting function,
 * which is a composition of linters matched agains the file.
 *
 * @param {object} linters
 */
function composeLinters(linters) {
  return async file => {
    const fileTypes = file.types;
    const filteredTypes = _.pickBy(fileTypes, enabled => enabled);
    const types = _.keys(filteredTypes);

    const linter = await types.reduce(
      async (file, type) => linters[type].lint(await file),
      await file,
    );

    return linter;
  };
}

/**
 * Resolve and load configuration file.
 */
function resolveConfigFile() {
  const explorer = cosmiconfig('everylint');
  return explorer.search();
}

/**
 * Takes options, resolves custom and default configs.
 *
 * @param {object} options
 */
async function processOptions(options) {
  // TODO: Add checks for filename, stdin an so on

  const configFile = await resolveConfigFile();

  const defaultConfig = {
    // Current working directory
    cwd: process.cwd(),
    // Show only errors and no warnings
    quite: false,
    // Linter's configuration
    linters: {
      // Add default linters here
    },
    filename: null,
    // fix: false, // disabled since it's not supported yet.
  };

  return {
    ...defaultConfig,
    ...(configFile ? configFile.config : {}),
    ...options,
  };
}

/**
 * Takes source file and validated config.
 * Returns report.
 *
 * @param {SourceFile} sourceFile
 * @param {object} config
 */
async function lint(sourceFile, config) {
  const sourceFiles = [].concat(sourceFile);

  const linters = loadLinters(config);
  const matchTypes = createTypesMatcher(linters);
  const linter = composeLinters(linters);
  const lintedFiles = sourceFiles.map(file => linter(matchTypes(file)));
  const report = await Promise.all(lintedFiles);

  return mergeReports(report);
}

/**
 * Takes string or buffer and options.
 * Returns result of linting.
 *
 * @param {string} contents
 * @param {object} options
 */
async function lintText(contents, options) {
  const file = new SourceFile({ path: options.filename, contents });
  const config = await processOptions(options);

  return lint(file, config);
}

/**
 * Takes glob/path and options.
 * Returns result of linting.
 *
 * @param {string} files
 * @param {object} options
 */
async function lintFiles(files, options) {
  const config = await processOptions(options);

  const glob = [].concat(files);
  const filenames = await globby(glob, {
    // ignore: additionally ignored files
    gitignore: true,
    // cwd: <cwd>
  });

  const sourceFiles = await Promise.all(filenames.map(SourceFile.readFile));

  return lint(sourceFiles, config);
}

/**
 * Takes array of reports. Returns merged report.
 *
 * @param {array} reports
 */
function mergeReports(reports) {
  let results = [];
  let statistic = {
    errors: 0,
    warnings: 0,
    info: 0,
    total: 0,
  };

  for (let result of reports) {
    results = [...results, result];
    statistic = _.mergeWith(statistic, result.statistic, (a, b) => a + b);
  }

  return {
    results,
    statistic,
  };
}

/**
 * Takes merged report. Prints report to console.
 *
 * @param {object} report
 */
function printReport(report) {
  return reporter(report.results);
}

module.exports = {
  printReport,
  mergeReports,
  lintFiles,
  lintText,
  lint,
  processOptions,
  resolveConfigFile,
  composeLinters,
  loadLinters,
  createTypesMatcher,
};
