// const fs = require('fs')
const path = require('path')
const NodeSsh = require('node-ssh')
const log = require('./log')

const ssh = new NodeSsh()

// 主函数
module.exports = async function deploy(config) {
	// 建立连接
	try {
		await connect(config)
		log.info('连接成功')
		// 上传文件夹
		if (Array.isArray(config.dirctories) && config.dirctories.length > 0) {
			await uploadDirectories(config)
			log.info('上传文件夹成功')
		}
		// 上传文件
		if (Array.isArray(config.files) && config.files.length > 0) {
			await uploadFiles(config)
			log.info('上传文件成功')
		}
		// 上传完成后结束进程
		log.success('部署完成')
		process.exit()
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}

// 连接SSH
function connect({ host, username, password }) {
	try {
		return ssh.connect({
			host,
			username,
			password
		})
	} catch (err) {
		log.error('连接服务器失败')
		process.exit(1)
	}
}
// 上传文件夹
function uploadDirectories(config) {
	try {
		const promiseArray = config.dirctories.map(dir => {
			return ssh.putDirectory(
				`${config.localDir}/${dir}`,
				`${config.remoteDir}/${dir}`,
				{
					recursive: true,
					concurrency: 10,
					validate: itemPath => {
						const baseName = path.basename(itemPath)
						return baseName !== 'node_modules'
					}
				}
			)
		})
		return Promise.all(promiseArray)
	} catch (err) {
		log.error('上传文件夹出错')
		process.exit(1)
	}
}
// 上传文件
function uploadFiles(config) {
	try {
		const uploadFilesPath = config.files.map(dir => ({
			local: `${config.localDir}/${dir}`,
			remote: `${config.remoteDir}/${dir}`
		}))
		return ssh.putFiles(uploadFilesPath)
	} catch (err) {
		log.error('上传文件出错')
		process.exit(1)
	}
}
