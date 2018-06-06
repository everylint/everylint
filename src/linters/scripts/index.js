import { CLIEngine } from 'eslint';
import baseConfig from './config';

// TODO: Pass custom configuration to CLIEngine
const eslint = new CLIEngine({ baseConfig });

const linter = (content, path) => {
  const [report] = eslint.executeOnText(content, path).results;
  return report;
};

export default async function (file) {
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

  return file;
}


// export class JavaScriptLinter {
//   static type = 'javascript';

//   constructor() {
//     this.eslint = new CLIEngine({ baseConfig });
//   }

//   checkType() {
//     // check if file matches linter type
//   }

//   async lint(file) {
//     const [report] = eslint.executeOnText(file.toString(), file.path).results;

//     report.messages.forEach(({ message, line, column, ruleId }) => {
//       // FIXME: use message/info/fail for different types of severities
//       file.message(message, { line, column }, ruleId);
//     });

//     return file;
//   }

//   async fix(file) {
//     // return fixes file
//   }
// }
