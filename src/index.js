import _ from 'lodash';
import cosmiconfig from 'cosmiconfig';
import globby from 'globby';
import reporter from 'vfile-reporter';
import SourceFile from './source-file';
import defaultLinters from './linters';

function requireLinter(name) {
  try {
    return require(`everylint-linter-${name}`);
  } catch (err) {
    if (name in defaultLinters) {
      return defaultLinters[name];
    }
    // FIXME: throw an error
    // throw new Error(`Cannot require \`everylint-linter-${name}\`!`);
    return console.error(`Cannot require \`everylint-linter-${name}\`!`);
  }
}

export function loadLinters(config) {
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

export function createTypesMatcher(linters) {
  return file => {
    for (let [name, linter] of Object.entries(linters)) {
      file.types[name] = linter.matchFile(file);
    }

    return file;
  };
}

export function composeLinters(linters) {
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

export function resolveConfigFile() {
  const explorer = cosmiconfig('everylint');
  return explorer.search();
}

export async function processOptions(options) {
  const configFile = await resolveConfigFile();

  const defaultConfig = {
    // Current working directory
    cwd: process.cwd(),
    // Show only errors and no warnings
    quite: false,
    // Linter's configuration
    linters: {},
    filename: null,
    // fix: false, // disabled since it's not supported yet.
  };

  return {
    ...defaultConfig,
    ...(configFile ? configFile.config : {}),
    ...options,
  };
}

export async function lint(sourceFile, config) {
  const sourceFiles = [].concat(sourceFile);

  const linters = loadLinters(config);
  const matchTypes = createTypesMatcher(linters);
  const linter = composeLinters(linters);

  const lintedFiles = sourceFiles.map(file => linter(matchTypes(file)));

  const report = await Promise.all(lintedFiles);

  return mergeReports(report);
}

export async function lintText(contents, options) {
  const file = new SourceFile({ path: options.filename, contents });
  const config = await processOptions(options);

  return lint(file, config);
}

export async function lintFiles(files, options) {
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

export function mergeReports(reports) {
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

export function printReport(report) {
  return reporter(report.results);
}
