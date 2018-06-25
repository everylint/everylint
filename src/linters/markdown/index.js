import remark from 'remark';
import styleGuide from 'remark-preset-lint-markdown-style-guide';

export default class MarkdownLinter {
  static type = 'markdown';

  constructor(/* config */) {
    this.linter = remark().use(styleGuide);
  }

  matchType(file) {
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
