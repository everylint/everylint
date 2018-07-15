import meow from 'meow';
import updateNotifier from 'update-notifier';
import * as everylint from '.';

function handleUnexpectedError(err) {
  console.error('\nOops! Something went wrong! :(');
  console.error(err);
  process.exit(2);
}

process.once('uncaughtException', handleUnexpectedError);
process.once('unhandledRejection', handleUnexpectedError);

// Array of possible errors
// const errors = [];

// TODO: Add more options to program
const help = `
  Usage:
    $ everylint [<file|glob> ...]

  Options:
    --config or --find-config-path
    --ignore-path
    --no-config
    --stdin-filepath

  Examples:
    $ everylint
    $ everylint *.{js,css,md}
    $ everylint *.js !cli.js
`;

const cli = meow({
  help,
  booleanDefault: undefined,
  flags: {
    fix: {
      type: 'boolean',
    },
    stdin: {
      type: 'boolean',
    },
    stdinFilename: {
      type: 'string',
      alias: 'filename',
    },
  },
});

updateNotifier({ pkg: cli.pkg }).notify();

const { input, flags: options } = cli;

everylint.lintFiles(input, options).then(report => console.log(report));

// everylint.lintText(`
//   asdfasdf {
//     asdfasdfas:asdfasdf;
//   }
// `, {
//   filename: 'foo.css',
//   linters: {
//     javascript: true,
//   },
// })
//   .then(report => console.log(report));

// // Collect errors for files that does not exist
// filenames.forEach(filename => {
//   if (!fs.existsSync(filename)) {
//     errors.push(filename + ' does not exist!');
//   }
// });

// // If there's nothing to lint, create an error
// if (filenames.length === 0) {
//   errors.push('No files to lint!');
// }

// // If there are some errors, exit the process
// if (errors.length) {
//   console.error(errors.join('\n'));
//   process.exit(2);
// }
