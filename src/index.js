const eslint = require('./linters/eslint')
const stylelint = require('./linters/stylelint')
const markdownlint = require('./linters/markdownlint')

const everylint = ({basePath}) => new Promise((resolve, reject) => {
  Promise.all([
    eslint(basePath),
    stylelint(basePath),
    markdownlint(),
  ])
    .then(reports => {
      let files = reports
        .reduce((newFiles, report) => newFiles.concat(report), [])
        .reduce((newFiles, currentFile) => {
          const {name, messages} = currentFile
          const fileWithSameNameIndex = newFiles.findIndex(file => file.name === name)

          if (fileWithSameNameIndex === -1) {
            newFiles.push({
              name,
              messages,
            })
          }
          else {
            newFiles[fileWithSameNameIndex].messages = [
              ...newFiles[fileWithSameNameIndex].messages,
              ...messages,
            ]
          }

          return newFiles
        }, [])

      resolve(files)
    })
    .catch(error => reject(error))
})

module.exports = everylint
