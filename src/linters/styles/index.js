import stylelint from 'stylelint';
import baseConfig from './config';

export default class StyleLinter {
  static type = 'style';

  constructor(/* config */) {
    this.linter = (content, path) => stylelint.lint({
      config: baseConfig,
      code: content,
      codeFilename: path,
    });
  }

  matchType(file) {
    const types = ['.css', '.pcss', '.scss', '.sass', '.sss', '.less', '.html', '.htm', '.markdown', '.md', '.mdown', 'mkdn', 'js', '.jsx'];
    return types.includes(file.extname);
  }

  async lint(file) {
    const { errored, results: [result] } = await this.linter(file.toString(), file.path);

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

  async fix(/* file */) {
    // return fixed file
  }
}
