module.exports = {
  projectName: "my-project", // 项目名称
  prod: {
    host: "1.1.1.1", // 主机名 必填
    username: "root", // ssh用户名 必填
    remoteDir: "/www/wwwroot/xxx", // 要上传到的远程目录 必填
    password: "123456", // ssh密码  可选  和私钥路径二选一
    privateKey: '/Users/lone/.ssh/id_rsa', // rsa私钥路径  可选  和ssh密码二选一
    dirctories: ["/dist"], // 要上传的文件夹目录 数组 可选
    files: [], // 要上传的文件路径 数组 可选
    commandsBeforeUpload: [], // 连接服务器后，在上传之前需要执行的命令行 可选
    commandsAfterUpload: [] // 连接服务器后，在上传之后需要执行的命令行 可选
  }
};
