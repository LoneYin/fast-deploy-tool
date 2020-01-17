const path = require('path')
const fs = require('fs')
const log = require('./log')

const { isValidArray } = require('./utils')

const localDir = process.cwd()
const deployConfigPath = path.join(localDir, 'deploy.config.js')

const validateRules = [
	{
		field: 'host',
		type: 'string'
	},
	{
		field: 'username',
		type: 'string'
	},
	{
		field: 'remoteDir',
		type: 'string'
	}
]

module.exports = function validateDeployConfig(env) {
	// 检测 deploy.config.js 文件是否存在
	if (!fs.existsSync(deployConfigPath)) {
		log.error('can not found deploy.config.js file, please execute init command first!')
		process.exit(1)
	}
	// 检测configs[env]
	const configs = require(deployConfigPath)
	const config = configs[env]
	if (config && Object.prototype.toString.call(config) === '[object Object]') {
		// 判断必填项
		let valid = validateRules.every(rule => {
			const configValue = config[rule.field]
			if (!configValue) {
				log.error(`${rule.field} required`)
				return false
			}
		})
		// 判断密码和私钥是否至少有一个
		if (!config.password && !config.privateKey) {
			log.error('there must be a password or privateKey')
			valid = false
		}
		// 判断dirctories或files中的目录或文件是否存在
		if (isValidArray(config.dirctories)) {
			valid = config.dirctories.every(dir => {
				return fs.existsSync(dir)
			})
		}
		if (isValidArray(config.files)) {
			valid = config.files.every(path => {
				return fs.existsSync(path)
			})
		}

		if (!valid) {
			process.exit(1)
		} else {
			config.localDir = localDir
			return config
		}
	} else {
		log.error(
			`can't found your settings of ${env}, please check the deploy.config.js file`
		)
		process.exit(1)
	}
}
