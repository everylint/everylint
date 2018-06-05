const CLIEngine = require('eslint').CLIEngine;
const baseConfig = require('./config');

// TODO: Pass custom configuration to CLIEngine
const eslint = new CLIEngine({ baseConfig });

const linter = (content, path) => {
  const [report] = eslint.executeOnText(content, path).results;
  return report;
};

module.exports = (file) => new Promise((resolve, reject) => {
  try {
    const report = linter(file.toString(), file.path);

    report.messages.forEach(({ message, line, column, ruleId }) => {
      // FIXME: use message/info/fail for different types of severities
      file.message(message, { line, column }, ruleId);
    });

    return resolve(file);
  } catch (error) {
    return reject(error);
  }
});
