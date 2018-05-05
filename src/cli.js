const everylint = require('./')
const chalk = require('chalk')

const basePath = process.cwd()

const STYLES = {
  error: chalk.red,
  warning: chalk.yellow,
  eslint: chalk.hex('#00f'),
  stylelint: chalk.black,
}
const stylish = (text) => typeof STYLES[text] !== 'undefined' ? STYLES[text](text.padStart(10)) : text.padStart(10)

const showReport = (files) => {
  files.forEach(file => {
    console.log(chalk.bold.underline(file.name.substr(basePath.length + 1)))

    file.messages.forEach(message => {
      const {linter, type, line, column, text} = message

      process.stdout.write(`  ${stylish(linter)} ${stylish(type)} `)
      process.stdout.write(chalk.gray(`${line.toString().padStart(4)}:${column.toString().padEnd(4)} `))
      process.stdout.write(`${text}\n`)
    })
  })
}

everylint({basePath})
  .then(files => showReport(files))
  .catch(error => console.error(error.message))
