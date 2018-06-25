import { CLIEngine } from 'eslint';
import defaultConfig from './config';

const fatalities = {
  2: 'error',
  1: 'warning',
  0: 'info'
};

export default class JavaScriptLinter {
  static type = 'javascript';

  constructor(config) {
    this.linter = new CLIEngine({ ...defaultConfig, ...config });
  }

  matchType(file) {
    const types = ['.js', '.markdown', '.md', '.mdown', '.mkdn', '.html', '.htm'];
    return types.includes(file.extname);
  }

  async lint(file) {
    const [report] = this.linter.executeOnText(file.toString(), file.path).results;

    report.messages.forEach(({ message, line, column, ruleId, severity }) => {
      const level = fatalities[severity];
      file[level](message, { line, column }, ruleId);
    });

    return file;
  }

  async fix(/* file */) {
    // return fixes file
  }
}
