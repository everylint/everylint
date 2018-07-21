import meow from 'meow';
import updateNotifier from 'update-notifier';
import * as everylint from '.';
import init from './init';

function handleUnexpectedError(err) {
  console.error('\nOops! Something went wrong! :(');
  console.error(err);
  process.exit(2);
}

process.once('uncaughtException', handleUnexpectedError);
process.once('unhandledRejection', handleUnexpectedError);

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
      // TODO: Fix sources with --fix
      type: 'boolean',
    },
    init: {
      type: 'boolean',
    },
    open: {
      // TODO: Open files in text editors
      type: 'boolean',
    },
    stdin: {
      // TODO: Read input from stdin with --stdin
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

if (options.init) {
  init();
}

// `everylint -` -> `everylint --stdin`
if (input[0] === '-') {
  opts.stdin = true;
  input.shift();
}

if (options.stdin) {
  if (!options.filename) {
    console.log('Filename is required for stdin');
    process.exit(1);
  }

  // FIXME: Get stdin;
  const stdin = '';

  everylint.lintText(stdin, options).then(report => {
    const exitCode = report.statistic.errors === 0 ? 0 : 1;
    process.stdout.write(everylint.printReport(report));
    process.exit(exitCode);
  });
} else {
  everylint.lintFiles(input, options).then(report => {
    const exitCode = report.statistic.errors === 0 ? 0 : 1;
    process.stdout.write(everylint.printReport(report));
    process.exit(exitCode);
  });
}
