import { CLIEngine } from 'eslint';
import defaultConfig from './config';

const fatalities = {
  2: 'error',
  1: 'warning',
  0: 'info',
};

export default class JavaScriptLinter {
  static type = 'javascript';

  constructor(config) {
    this.linter = new CLIEngine({ ...defaultConfig, ...config });
  }

  matchFile(file) {
    const types = [
      '.js',
      '.markdown',
      '.md',
      '.mdown',
      '.mkdn',
      '.html',
      '.htm',
    ];
    return types.includes(file.extname);
  }

  async lint(file) {
    const [report] = this.linter.executeOnText(
      file.toString(),
      file.path,
    ).results;

    report.messages.forEach(problem => {
      const { message, line, column, ruleId, severity } = problem;
      //  column - the column on which the error occurred.
      //  fatal - usually omitted, but will be set to true if there’s a parsing error (not related to a rule).
      //  line - the line on which the error occurred.
      //  message - the message that should be output.
      //  nodeType - the node or token type that was reported with the problem.
      //  ruleId - the ID of the rule that triggered the messages (or null if fatal is true).
      //  severity - either 1 or 2, depending on your configuration.
      //  endColumn - the end column of the range on which the error occurred (this property is omitted if it’s not range).
      //  endLine - the end line of the range on which the error occurred (this property is omitted if it’s not range).
      //  fix - an object describing the fix for the problem (this property is omitted if no fix is available).

      const level = fatalities[severity];
      file[level](message, { line, column }, ruleId);
    });

    return file;
  }

  async fix(/* file */) {
    // return fixed file
  }
}
