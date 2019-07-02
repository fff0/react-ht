/**
 * 测试文件
 */
// md5加密
const md5 = require('blueimp-md5')

// 1. 链接数据库
// 1.1引入mongoose
const mongoose = require('mongoose')
// 1.2 连接指定的数据库
mongoose.connect('mongodb://localhost:27017/test')
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
  username: {type: String, require: true},
  password: {type: String, require: true},
  type: {type: String, require: true},
  header: {type: String}
})
// 2.2 定义Model(与集合对应，可以操作集合数据)
    // 集合的名字为users
const UserModel = mongoose.model('user', userSchema)

// 3.通过Model或其实例对集合数据进行CURD操作
// 3.1 通过Model实例的save（）添加数据
function testSave() {
  // 创建userMaodel的实例
  const userModel = new UserModel({
    username: '222',
    password: md5('123'),
    type: 'user'
  })
  // 调用save()保存
  userModel.save(function(error, user) {
    console.log('save()', error, user)
  })
}
// testSave()

// 3.2 通过Model的find()/findOne()查询多个或一个数据
function testFind() {
  UserModel.find(function (error, users){
    console.log('find()', error, users)
  })
  // 查询一个
  UserModel.findOne({_id:'5d1957ce688f880c78700978'},function(error, user){
    console.log('findone()', error, user)
  })
}
// testFind()
// ps find 和 findone 的区别
// find得到的是一个数组，findone得到的是一个对象
// find没找到匹配的是一个空数组，findone没找到返回的是null

// 3.3 通过Model的findByIdAndUpdate() 更新数据
function testUpdata() {
  UserModel.findByIdAndUpdate({_id:'5d1957ce688f880c78700978'}, {username:'bbb'},function(error, oldUser){
    console.log('修改',error, oldUser)
  })
}
// testUpdata()

// 3.4 通过 remove 方法删除数据
function testDelete() {
  UserModel.remove({
    _id:'5d1957ce688f880c78700978'
  },function(error, doc){
    console.log(error, doc)
  })
}
testDelete()
// { n: 1, ok: 1, deletedCount: 1 }
// n:1/0, deletedCount: 删除的条数
