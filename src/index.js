const eslint = require('./linters/eslint')
const stylelint = require('./linters/stylelint')

const cwd = process.cwd()

Promise.all([eslint(cwd), stylelint()])
  .then(reports => console.log(JSON.stringify(reports)))
