const fs = require('fs')
const path = require('path')
const NodeSsh = require('node-ssh')
const log = require('./log')
const ora = require('ora')

const ssh = new NodeSsh()

// 主函数
module.exports = async function deploy(config) {
	// 建立连接
	try {
		const connectSpinner = ora('连接远程服务器中').start()
		await connect(config, connectSpinner)
		connectSpinner.succeed('连接成功')
		// 上传文件夹
		if (Array.isArray(config.dirctories) && config.dirctories.length > 0) {
			const dirsSpinner = ora('上传文件夹中').start();
			await uploadDirectories(config, dirsSpinner)
			dirsSpinner.succeed('上传文件夹成功')
		}
		// 上传文件
		if (Array.isArray(config.files) && config.files.length > 0) {
			const filesSpinner = ora('上传文件中').start();
			await uploadFiles(config, filesSpinner)
			filesSpinner.succeed('上传文件夹成功')
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
function connect({ host, username, password, privateKey }, spinner) {
	try {
		const sshConnectInfo = {
			host,
			username
		}
		if (password) {
			sshConnectInfo.password = password
		} else {
			sshConnectInfo.privateKey = fs.readFileSync(privateKey, 'utf-8')
		}
		return ssh.connect(sshConnectInfo)
	} catch (err) {
		spinner.fail('连接服务器失败')
		process.exit(1)
	}
}
// 上传文件夹
function uploadDirectories(config, spinner) {
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
		spinner.fail('上传文件夹出错')
		process.exit(1)
	}
}
// 上传文件
function uploadFiles(config, spinner) {
	try {
		const uploadFilesPath = config.files.map(dir => ({
			local: `${config.localDir}/${dir}`,
			remote: `${config.remoteDir}/${dir}`
		}))
		return ssh.putFiles(uploadFilesPath)
	} catch (err) {
		spinner.fail('上传文件出错')
		process.exit(1)
	}
}
