import htmllint from 'htmllint';

const linter = (content) => htmllint(content);

export default async function (file) {
  const report = linter(file.toString());

  // FIXME: htmllint uses unreadable codes for rules.
  report.forEach(({ code, line, column, rule }) => {
    file.message(code, { line, column }, rule);
  });

  return file;
}
