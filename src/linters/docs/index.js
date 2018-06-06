import remark from 'remark';
import styleGuide from 'remark-preset-lint-markdown-style-guide';

export default async function (file) {
  return remark().use(styleGuide).process(file);
}
