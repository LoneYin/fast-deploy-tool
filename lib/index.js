const program = require('commander')
const pkgJson = require('../package.json')

const init = require('./init')
const validate = require('./validate')
const deploy = require('./deploy')


program
	.version(pkgJson.version)
	.option('init --init', 'init fast-deploy-cli and create default config file')
	.option('dev --dev', 'deploy by dev config', 'dev')
	.option('prod --prod', 'deploy by prod config', 'prod')
	.option('env --env [name]', 'select an enviroment config')

// 解析命令行参数
program.parse(process.argv)

if (program.init) {
	init()
}

if (program.dev) {
	const config = validate(program.dev)
	deploy(config)
}

if (program.prod) {
	const config = validate(program.prod)
	deploy(config)
}

if (program.env) {
	const config = validate(program.env)
	deploy(config)
}
