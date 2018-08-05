const meow = require('meow');
const fs = require('fs');
const updateNotifier = require('update-notifier');
const init = require('./init.js');
const everylint = require('./index.js');

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
    quiet: {
      type: 'boolean',
    },
    cwd: {
      type: 'string',
    },
    configPath: {
      type: 'string',
    },
    noConfig: {
      type: 'boolean',
    },
    ignorePath: {
      type: 'string',
    },
    fix: {
      type: 'boolean',
    },
    init: {
      type: 'boolean',
    },
    open: {
      type: 'boolean',
    },
    stdin: {
      type: 'boolean',
    },
    filename: {
      type: 'string',
      alias: 'stdinFilename',
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
  options.stdin = true;
  input.shift();
}

function exitWithReport(report) {
  const exitCode = report.statistic.errors === 0 ? 0 : 1;
  process.stdout.write(everylint.printReport(report));
  process.exit(exitCode);
}

if (options.stdin) {
  if (!options.filename) {
    console.log('Filename is required for stdin');
    process.exit(1);
  }

  // FIXME: Get stdin;
  const stdin = '';

  everylint.lintText(stdin, options).then(exitWithReport);
} else {
  fs.readdir(process.cwd(), (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    everylint.lintFiles(files, options).then(exitWithReport);
  });
}
