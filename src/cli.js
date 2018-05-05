const everylint = require('./')

const showReport = (files) => {
  files.forEach(file => {
    console.log(file.name)

    file.messages.forEach(message => {
      const {linter, type, line, column, text} = message

      console.log(`  ${linter} ${type} - ${line}:${column} ${text}`)
    })
  })
}

const cwd = process.cwd()

everylint({basePath: cwd})
  .then(files => showReport(files))
  .catch(error => console.error(error.message))
