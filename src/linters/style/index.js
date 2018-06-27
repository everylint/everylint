import stylelint from 'stylelint';
import baseConfig from './config';

export default class StyleLinter {
  static type = 'style';

  constructor(/* config */) {
    this.linter = (content, path) =>
      stylelint.lint({
        config: baseConfig,
        code: content,
        codeFilename: path,
      });
  }

  matchType(file) {
    const types = [
      '.css',
      '.pcss',
      '.scss',
      '.sass',
      '.sss',
      '.less',
      '.html',
      '.htm',
      '.markdown',
      '.md',
      '.mdown',
      'mkdn',
      'js',
      '.jsx',
    ];
    return types.includes(file.extname);
  }

  async lint(file) {
    const {
      errored,
      results: [result],
    } = await this.linter(file.toString(), file.path);

    if (errored) {
      // result.warnings.forEach(({ text, line, column, rule, severity }) => {
      result.warnings.forEach(problem => {
        const { text, line, column, rule, severity } = problem;
        // { line: 2,
        //   column: 3,
        //   rule: 'property-no-unknown',
        //   severity: 'error',
        //   text: 'Unexpected unknown property "asdfasdfas" (property-no-unknown)' }
        file[severity](text, { line, column }, rule);
      });
    }

    return file;
  }

  async fix(/* file */) {
    // return fixed file
  }
}
