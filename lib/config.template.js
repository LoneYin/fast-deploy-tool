module.exports = {
  projectName: "fast-deploy-tool", // 项目名称
  prod: {
    host: "118.31.19.191", // 主机名 必填
    username: "root", // ssh用户名 必填
    remoteDir: "/www/wwwroot/story.tongxianlife.com", // 要上传到的远程目录 必填
    password: "DFnshngdgwmsx1", // ssh密码  可选  和私钥路径二选一
    privateKey: '/Users/lone/.ssh/id_rsa', // rsa私钥路径  可选  和ssh密码二选一
    dirctories: ["/dist"], // 要上传的文件夹目录 数组 可选
    files: ["/dist.zip"] // 要上传的文件 数组 可选
  }
};
