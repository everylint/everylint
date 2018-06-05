import remark from 'remark';
import styleGuide from 'remark-preset-lint-markdown-style-guide';

export default (file) => new Promise((resolve, reject) => {
  try {
    const report = remark().use(styleGuide).process(file);
    return resolve(report);
  } catch (error) {
    return reject(error);
  }
});
