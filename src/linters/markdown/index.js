const remark = require('remark');
const styleGuide = require('remark-preset-lint-markdown-style-guide');

class MarkdownLinter {
  constructor(/* config */) {
    this.linter = remark().use(styleGuide);
  }

  matchFile(file) {
    const types = ['.md', '.markdown', '.mdown', '.mkdn'];
    return types.includes(file.extname);
  }

  async lint(file) {
    return this.linter.process(file);
  }

  async fix(/* file */) {
    // return fixed file
  }
}

module.exports = MarkdownLinter;
