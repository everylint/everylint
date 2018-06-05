const htmllint = require('htmllint');

const linter = (content) => htmllint(content);

module.exports = (file) => new Promise((resolve, reject) => {
  linter(file.toString())
    .then(report => {
      // FIXME: htmllint uses unreadable codes for rules.
      report.forEach(({ code, line, column, rule }) => {
        file.message(code, { line, column }, rule);
      });

      resolve(file);
    })
    .catch(reason => reject(reason));
});
