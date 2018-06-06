import { CLIEngine } from 'eslint';
import baseConfig from './config';

// TODO: Pass custom configuration to CLIEngine
const eslint = new CLIEngine({ baseConfig });

const linter = (content, path) => {
  const [report] = eslint.executeOnText(content, path).results;
  return report;
};

export default (file) => new Promise((resolve, reject) => {
  try {
    const report = linter(file.toString(), file.path);

    report.messages.forEach(({ message, line, column, ruleId, severity }) => {
      // FIXME: Better resolution for severity
      if (severity === 2) {
        try {
          file.fail(message, { line, column }, ruleId);
        } catch (e) {
          // ...
        }
      } else {
        file.message(message, { line, column }, ruleId);
      }
    });

    return resolve(file);
  } catch (error) {
    return reject(error);
  }
});
