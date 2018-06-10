import { HTMLHint } from 'htmlhint';

export default class MarkupLinter {
  static type = 'markup';

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
        try {
          file.fail(message, { line, column }, ruleId);
        } catch (e) {
          // ...
        }
      } else {
        file.message(message, { line, column }, ruleId);
      }
    });

    return file;
  }

  async fix(/* file */) {
    // return fixed file
  }
}
