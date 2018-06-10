import vfile from 'to-vfile';
import reporter from 'vfile-reporter';

function loadLinters() {
  const paths = [
    './linters/scripts',
    './linters/styles',
    './linters/docs',
    './linters/markup',
  ];

  return paths
    .map(path => require(path))
    .reduce((linters, { default: Linter }) => ({
      ...linters,
      [Linter.type]: new Linter(),
    }), {});
}

export default function run(filenames) {
  const linters = loadLinters();

  // TODO: Create an abstraction, like SourceFile extending VFile
  const tasks = filenames
    // Read files, convert them to VFile
    .map(file => vfile.readSync(file))
    // Custom types
    .map(file => {
      const meta = Object.entries(linters)
        .reduce((metas, [name, linter]) => ({
          ...metas,
          [name]: linter.matchType(file),
        }), {});

      file.data = { ...file.data, ...meta };

      return file;
    })
    .map((file) => {
      const jobs = Object.entries(file.data)
        .filter(([type, enabled]) => enabled)
        .map(([type]) => type)
        .reduce(
          (promise, type) => promise.then(file => linters[type].lint(file))
          , Promise.resolve(file));

      return Promise.resolve(jobs);
    });

  Promise.all(tasks)
    .then(report => console.log(reporter(report)))
    .catch(error => console.error(error));
}
