import { HTMLHint } from 'htmlhint';

export default class HTMLLinter {
  static type = 'html';

  constructor(/* config */) {
    this.linter = (content) => HTMLHint.verify(content);
  }

  matchType(file) {
    const types = ['.html'];
    return types.includes(file.extname);
  }

  async lint(file) {
    const report = this.linter(file.toString());

    report.forEach(({ message, line, col: column, rule: { id: ruleId }, type }) => {
      if (type === 'error') {
        file.error(message, { line, column }, ruleId);
      } else {
        file.warning(message, { line, column }, ruleId);
      }
    });

    return file;
  }

  async fix(/* file */) {
    // return fixed file
  }
}
