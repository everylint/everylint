const CLIEngine = require('eslint').CLIEngine

const SEVERITIES = {
  1: 'warning',
  2: 'error',
}

const formatReport = (report) => ({
  linter: 'eslint',
  files: report.results
    .filter(result => result.errorCount || result.warningCount)
    .map(result => ({
      name: result.filePath,
      messages: result.messages.map(message => ({
        type: SEVERITIES[message.severity],
        line: message.line,
        column: message.column,
        rule: message.ruleId,
        text: message.message,
      })),
    })),
})

module.exports = (cwd) => {
  const cli = new CLIEngine({cwd})

  return new Promise((resolve, reject) => {
    try {
      const report = cli.executeOnFiles(['.'])

      resolve(formatReport(report))
    }
    catch (error) {
      reject(error)
    }
  })
}
