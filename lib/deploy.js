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
		log.start('deployment started!')
		// 连接远程服务器
		const connectSpinner = ora('connecting server...').start()
		await connect(config, connectSpinner)
		connectSpinner.succeed('connect successfully!')
		// 执行上传前脚本
		if (isValidAarry(config.commandsBeforeUpload)) {
			const cmdSpinner = ora('excute commands before upload').start()
			await execCommands(config.commandsBeforeUpload, config.remoteDir, cmdSpinner)
			connectSpinner.succeed('execute completely')
		}
		// 上传文件夹
		if (isValidAarry(config.dirctories)) {
			const dirsSpinner = ora('dirctories uploading').start()
			await uploadDirectories(config, dirsSpinner)
			dirsSpinner.succeed('upload completely')
		}
		// 上传文件
		if (isValidAarry(config.files)) {
			const filesSpinner = ora('files uploading').start()
			await uploadFiles(config, filesSpinner)
			filesSpinner.succeed('upload completely')
		}
		// 执行上传后脚本
		if (isValidAarry(config.commandsAfterUpload)) {
			const cmdSpinner = ora('excute commands after upload').start()
			await execCommands(config.commandsAfterUpload, config.remoteDir, cmdSpinner)
			connectSpinner.succeed('execute completely')
		}
		// 上传完成后结束进程
		log.success('deployment finished!')
		process.exit()
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
}
// 连接SSH
function connect(config, spinner) {
	try {
		const { host, username, password, privateKey } = config
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
		spinner.fail('connection failed')
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
		spinner.fail('upload failed')
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
		spinner.fail('upload failed')
		process.exit(1)
	}
}
// 执行命令行
async function execCommands(cmds, remoteDir, spinner) {
	try {
		await ssh.execCommand(`cd ${remoteDir}`)
		for (let i = 0; i < cmds.length; i++) {
			spinner.text(`execute ${cmds[i]}`)
			await ssh.execCommand(cmds[i])
		}
	} catch (err) {
		spinner.fail('execution failed')
		process.exit(1)
	}
}
