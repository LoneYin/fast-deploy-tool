const semver = require('semver')
const pkgJson = require('../package.json')

if (!semver.satisfies(process.version, pkgJson.engines.node)) {
  error(
    `You are using Node ${process.version}, but fast-deploy-tool ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const program = require('commander')

const init = require('./init')
const validate = require('./validate')
const deploy = require('./deploy')

program.version(pkgJson.version).usage('<command> [options]')

program
	.command('init')
	.description('init deploy.config.js file')
	.alias('i')
	.action(() => {
		init()
	})

program
	.command('prod')
	.description('deploy by prod config')
	.alias('p')
	.action(() => {
		envDeploy('prod')
	})

program
	.command('dev')
	.description('deploy by dev config')
	.alias('d')
	.action(() => {
		envDeploy('dev')
	})

program
	.command('env <name>')
	.description('deploy by custom config')
	.action(name => {
		envDeploy(name)
	})

// 解析命令行参数
program.parse(process.argv)

if (!process.argv.slice(2).length) {
	program.outputHelp()
}

function envDeploy(env) {
	const config = validate(env)
	deploy(config)
}
