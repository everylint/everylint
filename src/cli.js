const everylint = require('./')
const chalk = require('chalk')
const pluralize = require('pluralize')

const basePath = process.cwd()

const STYLES = {
  error: chalk.red,
  warning: chalk.yellow,
  eslint: chalk.hex('#00f'),
  stylelint: chalk.black,
}
const stylish = (text) => typeof STYLES[text] !== 'undefined' ? STYLES[text](text.padStart(12)) : text.padStart(12)

const showReport = (files) => {
  if (files.length === 0) {
    console.log(chalk.green('Everything is ok! You are amazing!'))

    return
  }

  let errorsCount = 0
  let warningsCount = 0

  files.forEach(file => {
    console.log(chalk.bold.underline(file.name))

    file.messages.forEach(message => {
      const {linter, type, line, column, text} = message

      if (type === 'error') {
        errorsCount += 1
      }
      if (type === 'warning') {
        warningsCount += 1
      }

      process.stdout.write(`  ${stylish(linter)} ${stylish(type)} `)
      process.stdout.write(chalk.gray(`${line.toString().padStart(4)}:${column.toString().padEnd(4)} `))
      process.stdout.write(`${text}\n`)
    })
  })

  if (errorsCount) {
    process.exitCode = 2
  }

  process.stdout.write(`\nFounded ${chalk.red(pluralize('error', errorsCount, true))}`)
  process.stdout.write(` and ${chalk.yellow(pluralize('warning', warningsCount, true))}`)
  process.stdout.write(` in ${pluralize('file', files.length, true)}\n\n`)
}

everylint({basePath})
  .then(files => showReport(files))
  .catch(error => {
    console.error(error.stack + '\n')
    process.exitCode = 2
  })
