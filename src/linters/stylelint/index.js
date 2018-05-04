const path = require('path')
const stylelint = require('stylelint')

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
    configFile: path.join(__dirname, 'config.js'),
    files: '**/*.css',
  })
    .then(report => resolve(formatReport(report)))
    .catch(error => reject(error))
})
