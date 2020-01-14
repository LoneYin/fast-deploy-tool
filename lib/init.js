const fs = require('fs')
const path = require('path')
const log = require('./log')
const localDir = process.cwd()

const deployConfigPath = path.join(localDir, 'deploy.config.js')

function readFile(filePath, encoding = '') {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, encoding, (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

function writeFile(filePath, data, options={}) {
  return new Promise((resolve,reject) => {
    fs.writeFile(filePath, data, options, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function createConfigFile() {
	try {
    const configFileData = await readFile(path.join(__dirname, './config.template.js'), 'utf-8')
    await writeFile(deployConfigPath, configFileData)
    log.success('deploy.config.js 配置文件已生成！')
	} catch (err) {
		console.log(err)
	}
}

module.exports = function init() {
  log.start('开始生成默认部署配置文件 deploy.config.js')
	if (fs.existsSync(deployConfigPath)) {
		log.info('deploy.config.js 配置文件已经存在')
		process.exit(1)
	} else {
		createConfigFile()
	}
}
