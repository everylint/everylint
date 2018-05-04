const stylelint = require('stylelint')

const formatReport = (report) => ({
  linter: 'stylelint',
  files: report.results
    .filter(result => result.errored)
    .map(result => ({
      name: result.source,
      messages: result.warnings.map(message => ({
        type: message.severity,
        line: message.line,
        column: message.column,
        rule: message.rule,
        text: message.text,
      })),
    })),
})

module.exports = () => new Promise((resolve, reject) => {
  stylelint.lint({files: '**/*.css'})
    .then(report => resolve(formatReport(report)))
    .catch(error => reject(error))
})
