import stylelint from 'stylelint';
import baseConfig from './config';

const linter = (content, path) => stylelint.lint({
  config: baseConfig,
  code: content,
  codeFilename: path,
});

export default async function (file) {
  const { errored, results: [result] } = await linter(file.toString(), file.path);

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

  return file;
}
