module.exports = {
  projectName: "", // 项目名称
  prod: {
    host: "118.31.19.191", // 主机名 必填
    username: "root", // ssh用户名 必填
    password: "DFnshngdgwmsx1", // ssh密码 必填
    remoteDir: "/www/wwwroot/story.tongxianlife.com", // 要上传到的远程目录 必填
    dirctories: ["/dist"], // 要上传的文件夹 可选
    files: [] // 要上传的文件 可选
  }
};
