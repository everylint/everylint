const stylelint = require('stylelint')
const baseConfig = require('./config')

const formatReport = (report) =>
  report.results
    .filter(result => result.errored)
    .map(result => ({
      name: result.source,
      messages: result.warnings.map(message => ({
        linter: 'stylelint',
        type: message.severity,
        line: message.line,
        column: message.column,
        rule: message.rule,
        text: message.text,
      })),
    }))

module.exports = () => new Promise((resolve, reject) => {
  stylelint.lint({
    configOverrides: baseConfig,
    files: '**/*.(css|pcss|scss|sass|sss|less|html|htm|markdown|md|js|jsx)',
  })
    .then(report => resolve(formatReport(report)))
    .catch(error => reject(error))
})
