const eslint = require('./linters/eslint')
const stylelint = require('./linters/stylelint')

const everylint = ({basePath}) => new Promise((resolve, reject) => {
  Promise.all([eslint(basePath), stylelint()])
    .then(reports => {
      const files = reports
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])

      resolve(files)
    })
    .catch(error => reject(error))
})

module.exports = everylint
