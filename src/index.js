import vfile from 'to-vfile';
import scriptsLinter from './linters/scripts';
import stylesLinter from './linters/styles';
import docsLinter from './linters/docs';
import markupLinter from './linters/markup';
import reporter from 'vfile-reporter';

// FIXME: In future we need to add ability to define custom types
// FIXME: and assign them to files
const types = {
  scripts: ['.js', '.markdown', '.md', '.mdown', '.mkdn', '.html', '.htm'],
  styles: ['.css', '.pcss', '.scss', '.sass', '.sss', '.less', '.html', '.htm', '.markdown', '.md', '.mdown', 'mkdn', 'js', '.jsx'],
  docs: ['.md', '.markdown', '.mdown', '.mkdn'],
  markup: ['.html'],
};

// FIXME: Add better file type resolution.
// FIXME: Resolution by extname might be wrong sometimes.
const isScript = extension => types.scripts.includes(extension);
const isStyle = extension => types.styles.includes(extension);
const isDoc = extension => types.docs.includes(extension);
const isMarkup = extension => types.markup.includes(extension);

function addTypeOf(vfile) {
  const ext = vfile.extname;

  vfile.data = Object.assign(vfile.data, {
    isScript: isScript(ext),
    isStyle: isStyle(ext),
    isDoc: isDoc(ext),
    isMarkup: isMarkup(ext),
  });

  return vfile;
}

function lint(file) {
  // Pipe the file through all of the linters
  return Promise.resolve(file)
    .then(file => file.data.isScript ? scriptsLinter(file) : file)
    .then(file => file.data.isStyle ? stylesLinter(file) : file)
    .then(file => file.data.isDoc ? docsLinter(file) : file)
    .then(file => file.data.isMarkup ? markupLinter(file) : file)
    .catch(reason => console.error(reason));
}

export default function run(filenames) {
  // TODO: Create an abstraction, like SourceFile extending VFile
  const tasks = filenames
    // Read files, convert them to VFile
    .map(file => vfile.readSync(file))
    // Understand the type of a file
    .map(file => addTypeOf(file))
    // Lint every file
    .map(file => lint(file));

  // Process all tasks
  Promise.all(tasks)
    .then(report => console.log(reporter(report)))
    .catch(reason => console.error(reason));
}
