import stylelint from 'stylelint';
import baseConfig from './config';

const linter = (content, path) => stylelint.lint({
  config: baseConfig,
  code: content,
  codeFilename: path,
});

export default (file) => new Promise((resolve, reject) => {
  linter(file.toString(), file.path)
    .then(report => {
      const { errored, results: [result] } = report;

      if (errored) {
        result.warnings.forEach(({ text, line, column, rule, severity }) => {
          // FIXME: use message/info/fail for different types of severities
          if (severity === 'warning') {
            file.message(text, { line, column }, rule);
          }
          if (severity === 'error') {
            try {
              file.fail(text, { line, column }, rule);
            } catch (e) {
              // ...
            }
          }
        });
      }

      return resolve(file);
    })
    .catch(reason => reject(reason));
});
