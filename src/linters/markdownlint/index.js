const markdownlint = require('markdownlint')
const globby = require('globby')
const baseConfig = require('./config')

const formatReport = (report) => {
  let files = []

  Object.keys(report).forEach(fileName => {
    if (report[fileName].length) {
      files.push({
        name: fileName,
        messages: report[fileName]
          .map(message => ({
            linter: 'markdownlint',
            type: 'error',
            line: message.lineNumber,
            column: message.errorRange ? message.errorRange[0] : 1,
            rule: message.ruleNames.join(': '),
            text:
            (message.errorDetail ? message.errorDetail : message.ruleDescription) +
            ` (${message.ruleNames.join(': ')})`,
          })),
      })
    }
  })

  return files
}

module.exports = () => new Promise((resolve, reject) => {
  globby(['**/*.md', '**/*.markdown', '**/*.mdown', '**/*.mkdn', '!node_modules'])
    .then(files =>{
      if (files.length === 0) {
        resolve([])
      }
      else {
        markdownlint({
          files,
          config: baseConfig,
        }, (error, result) => {
          if (error) {
            reject(error)
          }
          else {
            resolve(formatReport(result))
          }
        })
      }
    })
    .catch(error => reject(error))
})
