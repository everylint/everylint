const remark = require('remark');
const styleGuide = require('remark-preset-lint-markdown-style-guide');

module.exports = (file) => new Promise((resolve, reject) => {
  try {
    const report = remark().use(styleGuide).process(file);
    return resolve(report);
  } catch (error) {
    return reject(error);
  }
});
