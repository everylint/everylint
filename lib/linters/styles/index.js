const stylelint = require('stylelint');
const baseConfig = require('./config');

const linter = (content, path) => stylelint.lint({
  config: baseConfig,
  code: content,
  codeFilename: path,
});

module.exports = (file) => new Promise((resolve, reject) => {
  linter(file.toString(), file.path)
    .then(report => {
      const { errored, results: [result] } = report;

      if (errored) {
        result.warnings.forEach(({ text, line, column, rule }) => {
          // FIXME: use message/info/fail for different types of severities
          file.message(text, { line, column }, rule);
        });
      }

      return resolve(file);
    })
    .catch(reason => reject(reason));
});
