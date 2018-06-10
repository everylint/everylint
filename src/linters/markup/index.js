import { HTMLHint } from 'htmlhint';

const linter = (content) => HTMLHint.verify(content);

export default async function (file) {
  const report = linter(file.toString());

  report.forEach(({ message, line, col: column, rule: { id: ruleId }, type }) => {
    if (type === 'error') {
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
