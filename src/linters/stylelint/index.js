const stylelint = require('stylelint')
const baseConfig = require('./config')

const formatReport = (report, basePath) =>
  report.results
    .filter(result => result.errored)
    .map(result => ({
      name: result.source.substr(basePath.length + 1),
      messages: result.warnings.map(message => ({
        linter: 'stylelint',
        type: message.severity,
        line: message.line,
        column: message.column,
        rule: message.rule,
        text: message.text,
      })),
    }))

module.exports = (basePath) => new Promise((resolve, reject) => {
  stylelint.lint({
    config: baseConfig,
    files: '**/*.(css|pcss|scss|sass|sss|less|html|htm|markdown|md|mdown|mkdn|js|jsx)',
  })
    .then(report => resolve(formatReport(report, basePath)))
    .catch(error => reject(error))
})
