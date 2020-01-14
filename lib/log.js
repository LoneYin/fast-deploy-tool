const chalk = require('chalk')

module.exports = {
	start: content => {
		console.log(chalk.magenta(content))
	},
	info: content => {
		console.log(chalk.blue(content))
  },
  success: content => {
    console.log(chalk.green(content));
  },
  error: content => {
    console.log(chalk.red(content));
  }
}
