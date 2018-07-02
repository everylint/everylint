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
      [Linter.type]: new Linter(config[Linter.type]),
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

// ----- NEW API -----

export async function resolveConfig() {
  return await cosmiconfig('everylint').search();
}

export async function lintText(contents, options) {
  if (typeof contents !== 'string') {
    throw new TypeError(
      `A string is expected, but recieved ${typeof contents}`,
    );
  }

  // const file = new SourceFile({ contents })
}

export async function lintFiles(files, options) {
  // Wrap file in array and lint
  const { config } = await resolveConfig();
  const linters = loadLinters(config);
  const matchTypes = createTypesMatcher(linters);
  const linter = composeLinters(linters);

  const filenames = await globby([].concat(files), {
    // ignore: additionaly ignored files
    gitignore: true,
    // cwd: <cwd>
  });

  const jobs = filenames
    .map(SourceFile.readFileSync)
    .map(matchTypes)
    .map(linter);

  const report = await Promise.all(jobs);

  return processReport(report);
}

export function processReport(report) {
  console.log(reporter(report));
}
