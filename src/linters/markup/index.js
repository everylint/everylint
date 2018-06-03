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

// class MarkdownLinter {
//   static type = 'docs';

//   constructor() {
//     // linter setup
//   }

//   checkType() {
//     // check if file matches linter type
//   }

//   async lint(file) {
//     // return file with messages
//   }

//   async fix(file) {
//     // return fixes file
//   }
// }
