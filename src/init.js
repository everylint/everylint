import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import readPkgUp from 'read-pkg-up';
import writePkg from 'write-pkg';

const DEFAULT_TEST_SCRIPT = 'echo "Error: no test specified" && exit 1';

const CONFIG_FILES = [
  // ESLint
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.json',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  // JSHint
  '.jshintrc',
  '.jscsrc',
  // JSCS
  '.jscs.json',
  '.jscs.yaml',
  // Styleling
  '.stylelintrc',
  '.stylelintrc.js',
  '.stylelintrc.json',
  '.stylelintrc.yaml',
  '.stylelintrc.yml',
  // HTMLHint
  '.htmlhintrc',
  // Remark
  '.remarkrc',
  '.remarkrc.js',
  '.remarkrc.json',
  '.remarkrc.yaml',
  '.remarkrc.yml',
];

function hasYarn(cwd) {
  return fs.existsSync(path.resolve(cwd || process.cwd(), 'yarn.lock'));
}

function fileExists(file) {
  try {
    fs.accessSync(file);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Borrowed from xo project:
 * https://github.com/xojs/xo-init/blob/008e17e734c16d6fa44ab4f5d0eb24440879e7b7/index.js#L33-L44
 *
 * @param {string} test Test script from package.json
 */
function buildTestScript(test) {
  if (test && test !== DEFAULT_TEST_SCRIPT) {
    // Don't add if it's already there
    if (!/^everylint( |$)/.test(test)) {
      return `everylint && ${test}`;
    }

    return test;
  }

  return 'everylint';
}

function runCommand(cmd, args, options = { cwd: process.cwd() }) {
  try {
    execFileSync(cmd, args, options);
  } catch (error) {
    console.error(`Cannot run \`${cmd} ${args.join(' ')}\``);
    console.error(error);
  }
}

function postInstall(cwd = process.cwd()) {
  CONFIG_FILES.filter(file => fileExists(path.join(cwd, file))).forEach(
    file => {
      console.log(`${file} can probably be deleted since you use Everylint.`);
    },
  );
}

export default function(
  { cwd, skipInstall } = {
    cwd: process.cwd(),
    skipInstall: false,
  },
) {
  const { pkg, path: pkgPath } = readPkgUp.sync({
    cwd,
    normalize: false,
  });

  const pkgCwd = path.dirname(pkgPath);

  pkg.scripts.test = buildTestScript(pkg.scripts.test);

  writePkg(pkgPath, pkg);

  if (skipInstall) {
    return;
  }

  if (hasYarn(pkgCwd)) {
    runCommand('yarn', ['add', '--dev', 'everylint'], { cwd: pkgCwd });
    postInstall(pkgCwd);
    return;
  }

  runCommand('npm', ['install', '--save-dev', 'everylint'], { cwd: pkgCwd });
  postInstall(pkgCwd);
  return;
}
