import _ from 'lodash';
import cosmiconfig from 'cosmiconfig';
import globby from 'globby';
import SourceFile from './source-file';
import reporter from 'vfile-reporter';
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
    file.data.types = _.reduce(
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
    const fileTypes = file.data.types;
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
 * {
 *   filename: '', // filename for stdin
 *   noConfig: false, // should resolveConfig internaly
 *   configPath: '',
 *   ignorePath: '', // TODO: Add ability to ignore files
 *   linters: {}, // defaultLinters
 * }
 */
function processOptions(options) {
  console.log(options);
  return options;
}

// ----- NEW API -----

export async function resolveConfig() {
  return await cosmiconfig('everylint').search();
}

export async function lint(sourceFile, config) {
  const sourceFiles = [].concat(sourceFile);

  const linters = loadLinters(config);
  const matchTypes = createTypesMatcher(linters);
  const linter = composeLinters(linters);

  const lintedFiles = sourceFiles.map(file => linter(matchTypes(file)));

  const report = await Promise.all(lintedFiles);

  return processReport(report);
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

  const sourceFiles = filenames.map(SourceFile.readFileSync);

  return lint(sourceFiles, config);
}

export function processReport(report) {
  console.log(report);
  console.log(reporter(report));
}
