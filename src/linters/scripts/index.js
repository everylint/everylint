import { CLIEngine } from 'eslint';
import baseConfig from './config';

export default class JavaScriptLinter {
  static type = 'javascript';

  constructor(/* config */) {
    this.linter = new CLIEngine({ baseConfig });
  }

  matchType(file) {
    const types = ['.js', '.markdown', '.md', '.mdown', '.mkdn', '.html', '.htm'];
    return types.includes(file.extname);
  }

  async lint(file) {
    const [report] = this.linter.executeOnText(file.toString(), file.path).results;

    report.messages.forEach(({ message, line, column, ruleId, severity }) => {
      // FIXME: use message/info/fail for different types of severities
      if (severity === 2) {
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
    // return fixes file
  }
}
