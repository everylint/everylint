const eslint = require('./linters/eslint')
const stylelint = require('./linters/stylelint')

const cwd = process.cwd()

const showReport = (files) => {
  files.forEach(file => {
    console.log(file.name)

    file.messages.forEach(message => {
      const {linter, type, line, column, text} = message

      console.log(`  ${linter} ${type} - ${line}:${column} ${text}`)
    })
  })
}

Promise.all([eslint(cwd), stylelint()])
  .then(reports => {
    const files = reports
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])

    showReport(files)
  })
  .catch(error => console.error(error.message))
