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
		field: 'password',
		type: 'string'
	},
	{
		field: 'remoteDir',
		type: 'string'
	},
	{
		field: 'dirctories',
		type: 'array'
	},
	{
		field: 'files',
		type: 'array'
	}
]

const path = require('path')
const fs = require('fs')
const log = require('./log')
const localDir = process.cwd()
const deployConfigPath = path.join(localDir, 'deploy.config.js')

module.exports = function validateDeployConfig(env) {
  if (!fs.existsSync(deployConfigPath)) {
		log.error('未检测到 deploy.config.js, 请先执行init')
    process.exit(1)
  } 
  const configs = require(deployConfigPath)
  const config = configs[env]
	if (config && Object.prototype.toString.call(config) === '[object Object]') {
		const valid = validateRules.every(rule => {
			const configValue = config[rule.field]
			if (!configValue) {
				return false
			}
			if (rule.type === 'string') {
				return typeof configValue === 'string'
			}
			if (rule.type === 'array') {
				return Array.isArray(configValue)
			}
		})
		if (!valid) {
      log.error('请检查您的 deploy.confing.js 配置文件是否配置正确')
      process.exit(1)
    } else {
      config.localDir = localDir
      return config
    }
	} else {
    log.error(`未检测到${env}环境下的部署设置，请检查您的 deploy.config.js 文件`)
    process.exit(1)
  }
}
