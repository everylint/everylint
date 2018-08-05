const { HTMLHint } = require('htmlhint');

class HTMLLinter {
  constructor(/* config */) {
    this.linter = content => HTMLHint.verify(content);
  }

  matchFile(file) {
    const types = ['.html'];
    return types.includes(file.extname);
  }

  async lint(file) {
    const report = this.linter(file.toString());

    report.forEach(problem => {
      const {
        message,
        line,
        col: column,
        rule: { id: ruleId },
        type,
      } = problem;
      // { type: 'error',
      //   message: 'Doctype must be declared first.',
      //   raw: 'asdf\n',
      //   evidence: 'asdf',
      //   line: 1,
      //   col: 1,
      //   rule:
      //    { id: 'doctype-first',
      //      description: 'Doctype must be declared first.',
      //      link: 'https://github.com/yaniswang/HTMLHint/wiki/doctype-first' } }

      const origin = `html:${ruleId}`;

      if (type === 'error') {
        file.error(message, { line, column }, origin);
      } else {
        file.warning(message, { line, column }, origin);
      }
    });

    return file;
  }

  async fix(/* file */) {
    // return fixed file
  }
}

module.exports = HTMLLinter;
