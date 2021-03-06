import remark from 'remark';
import styleGuide from 'remark-preset-lint-markdown-style-guide';

export default class MarkdownLinter {
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
