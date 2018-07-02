import meow from 'meow';
import updateNotifier from 'update-notifier';
import { lintFiles } from '.';

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
    --

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
  },
});

updateNotifier({ pkg: cli.pkg }).notify();

const { input, flags: options } = cli;

lintFiles(input).then(report => console.log(report));

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
