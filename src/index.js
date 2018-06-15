import cosmiconfig from 'cosmiconfig';
import SourceFile from './source-file';
import reporter from 'vfile-reporter';
import defaultLinters from './linters';

function loadLinters(config) {
  return defaultLinters
    .reduce((linters, Linter) => ({
      ...linters,
      [Linter.type]: new Linter(config[Linter.type]),
    }), {});
}

function readFile(path) {
  return SourceFile.readFileSync(path);
}

function createTypesMatcher(linters) {
  return (file) => {
    const meta = Object.entries(linters)
      .reduce((metas, [name, linter]) => ({
        ...metas,
        [name]: linter.matchType(file),
      }), {});

    file.data = { ...file.data, ...meta };

    return file;
  };
}

function createFilesLinter(linters) {
  return (file) => {
    const jobs = Object.entries(file.data)
      .filter(([type, enabled]) => enabled)
      .map(([type]) => type)
      .reduce(async (promise, type) => {
        const file = await promise;
        return linters[type].lint(file);
      } , Promise.resolve(file));

    return Promise.resolve(jobs);
  };
}

async function resolveConfig() {
  return await cosmiconfig('everylint').search();
}

export default async function run(filenames) {
  const { config } = await resolveConfig();
  const linters = loadLinters(config);
  const matchTypes = createTypesMatcher(linters);
  const lintFiles = createFilesLinter(linters);

  // TODO: Create an abstraction, like SourceFile extending VFile
  const tasks = filenames
    // Read files, convert them to VFile
    .map(file => readFile(file))
    // Custom types
    .map(file => matchTypes(file))
    .map(file => lintFiles(file));

  try {
    const report = await Promise.all(tasks);
    console.log(reporter(report));
  } catch (error) {
    console.error(error);
  }
}
