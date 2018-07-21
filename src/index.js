import _ from 'lodash';
import cosmiconfig from 'cosmiconfig';
import globby from 'globby';
import reporter from 'vfile-reporter';
import SourceFile from './source-file';
import defaultLinters from './linters';

export function loadLinters(config) {
  return defaultLinters.reduce(
    (linters, Linter) => ({
      ...linters,
      [Linter.type]: new Linter(config.linters[Linter.type]),
    }),
    {},
  );
}

export function createTypesMatcher(linters) {
  return file => {
    file.types = _.reduce(
      linters,
      (metas, linter, name) => ({
        ...metas,
        [name]: linter.matchFile(file),
      }),
      {},
    );

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

export async function resolveConfig() {
  return await cosmiconfig('everylint').search();
}

// TODO: process config
function processOptions(options) {
  console.log('processOptions', options);
  return options;
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
  const { config } = await resolveConfig();

  return lint(file, config);
}

export async function lintFiles(files, options) {
  const { config } = await resolveConfig();

  const glob = [].concat(files);
  const filenames = await globby(glob, {
    // ignore: additionaly ignored files
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
