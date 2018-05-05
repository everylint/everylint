const CLIEngine = require('eslint').CLIEngine
const baseConfig = require('./config')

const SEVERITIES = {
  1: 'warning',
  2: 'error',
}

const formatReport = (report, basePath) =>
  report.results
    .filter(result => result.errorCount || result.warningCount)
    .map(result => ({
      name: result.filePath.substr(basePath.length + 1),
      messages: result.messages.map(message => ({
        linter: 'eslint',
        type: SEVERITIES[message.severity],
        line: message.line,
        column: message.column,
        rule: message.ruleId,
        text: message.message + ` (${message.ruleId})`,
      })),
    }))

module.exports = (basePath) => {
  const cli = new CLIEngine({
    baseConfig,
    cwd: basePath,
    extensions: ['.js', '.markdown', '.md', '.mdown', '.mkdn', '.html', '.htm'],
  })

  return new Promise((resolve, reject) => {
    try {
      const report = cli.executeOnFiles(['.'])

      resolve(formatReport(report, basePath))
    }
    catch (error) {
      reject(error)
    }
  })
}
