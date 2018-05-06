const markdownlint = require('markdownlint')
const globby = require('globby')
const cosmiconfig = require('cosmiconfig')
const configExplorer = cosmiconfig('markdownlint')
const path = require('path')
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

module.exports = (basePath) => new Promise((resolve, reject) => {
  globby(['**/*.md', '**/*.markdown', '**/*.mdown', '**/*.mkdn', '!node_modules'])
    .then(files =>{
      if (files.length === 0) {
        resolve([])
      }
      else {
        const filesByFolders = files
          .reduce((folders, file) => {
            const folderName = path.dirname(file)
            const fullFolderName = basePath + path.sep + (folderName === '.' ? '' : folderName + path.sep)
            const folderIndex = folders.findIndex(folder => folder.name === fullFolderName)

            if (folderIndex === -1) {
              folders.push({
                name: fullFolderName,
                files: [file],
              })
            }
            else {
              folders[folderIndex].files = [
                ...folders[folderIndex].files,
                file,
              ]
            }

            return folders
          }, [])
        const filesByFoldersWithConfigs = filesByFolders
          .map(folder => {
            const folderConfig = configExplorer.searchSync(folder.name)

            return Object.assign({}, folder, {config: folderConfig ? folderConfig.config : {}})
          })

        Promise.all(filesByFoldersWithConfigs
          .map(folder => new Promise((resolve, reject) => {
            markdownlint({
              files: folder.files,
              config: Object.assign({}, baseConfig, folder.config),
            }, (error, result) => {
              if (error) {
                reject(error)
              }
              else {
                resolve(result)
              }
            })
          })))
          .then(results => {
            const report = results
              .reduce((report, result) => Object.assign({}, report, result), {})

            resolve(formatReport(report))
          })
          .catch(error => reject(error))
      }
    })
    .catch(error => reject(error))
})
