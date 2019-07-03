/**
 * 操作数据库集合数据的Mdel模块
 */
/* 1.连接数据库 */
// 1.1 引入mongoose
const mongoose = require('mongoose')
// 1.2连接指定数据库
mongoose.connect('mongodb://localhost:27017/lvmaoxia')
// 1.3 获取连接对象
const conn = mongoose.connection
// 1.4 绑定连接完成的监听函数（用来提示连接成功）
conn.on('connected', function(){
  // 连接成功
  console.log('数据库连接成功')
})

// 2.得到特定集合的Model
// 2.1字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
  // 指定文档的结构：属性名、属性值得类型，是否是必须的，默认值
  username: {type: String, require: true}, // 用户名
  password: {type: String, require: true}, // 密码
  type: {type: String, require: true}, // 用户类型
  header: {type: String}, // 头像
  post: {type: String}, // 职位
  info: {type: String}, // 个人或职位简介
  company: {type: String}, // 公司名称
  salary: {type: String} // 工资
})
// 2.2 定义Model(与集合对应，可以操作集合数据)
    // 集合的名字为users
const UserModel = mongoose.model('user', userSchema)
// 2.3 向外暴露 Model
    // 分开暴露
    exports.UserModel = UserModel


//定义聊天的集合
const chatSchema = mongoose.Schema({
  from: {type: String, require: true},// 发送用户的id
  to: {type: String, require: true},// 接收用户的id
  chat_id: {type: String, require: true}, //from 和 to 组成的字符串
  read: {type: Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
// 定义能操作chats 集合的数据Model
const ChatModel = mongoose.model('chat', chatSchema)
// 向外暴露Model
exports.ChatModel = ChatModel
