var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models.js')
const filter = {password: 0, __v: 0} //定义一个过滤器

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * 注册路由
 *
 */

// 用户注册
/**
 * 1.path为 /register
 * 2.请求方式为POST
 * 3.接收username和password参数
 * 4.有一个已注册用户 admin
 * 5.注册成功返回{code:0, data:{_id: 'xxx', username: 'xxx', password: 'xxx'}}
 * 6.注册失败返回 { code：1 , msg: '用户名已存在'}
 */

/**
 * function (req,res,next)回调函数
 * req：处理请求
 * res：返回相应
 * next:
 */
// router.post('/register', function(req, res) {
//   // 1.获取请求参数
//   const {username, password} = req.body
//   // 2.处理
//   if(username === 'admin'){
//     // 返回失败的响应数据
//     res.send({
//       code: 1,
//       msg: '此用户名已存在'
//     })
//   }else{
//     // 返回成功的数据
//     res.send({
//       code: 0,
//       data: {
//         id: '1',
//         username,
//         password
//       }
//     })
//   }
// })

// 注册的路由
router.post('/register', function(req, res) {
  // 读取请求参数数据
  const {username, password, type} = req.body
  // 处理
    // 判断用户是否已经存在
  UserModel.findOne({username}, function(error, user){
    // 如果有值，已存在
    if(user){
      // 返回错误信息
      res.send({
        code: 1,
        msg: '此用户名已存在'
      })
    }else{
      // 保存数据
      new UserModel({username, type, password:md5(password)}).save(function(error, user){
        // 生成cookie ,病娇给浏览器保存,设置cookie的有效时间
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
        // 响应数据中不包含密码
        const data = {username, type, _id: user._id}
        res.send({
          code: 0,
          data
        })
      })
    }
  })
  // 返回响应数据

})

// 登录的路由
router.post('/login', function(req, res){
  const {username, password} = req.body
  // 根据username和password查询数据库users
  UserModel.findOne({username,password:md5(password)},filter,function(err, user){
    if(user){
      // 生成cookie ,病娇给浏览器保存,设置cookie的有效时间
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
      // 返回信息
      res.send({
        code: 0,
        data: user
      })
    }else{
      res.send({
        code: 1,
        msg: '用户名或密码错误！'
      })
    }
  })
})

// 更新用户信息的路由
router.post('/update', function(req, res){

  // 从请求的cookie中得到user.id
  const userid = req.cookies.userid
  // 如果不存在，返回提示信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登录！'})
  }
  // 得到提交用户的信息
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser){
    if(!oldUser){
      // 告诉浏览器 删除cookie
      res.clearCookie('userid')
      // 返回一个提示信息
      res.send({code: 1, msg: '请先登录'})

    }else{

      const {_id, username, type} = oldUser
      const data = Object.assign(user, {_id, username, type})

      res.send({code: 0, data})
    }
  })
})

// 获取用户信息的路由
router.get('/users', function(req,res){
  const userid = req.cookies.userid
  // 如果不存在
  if(!userid){
    return res.send({code: 1, msg: '请先登录'})
  }
  UserModel.findOne({_id: userid}, filter, function(error, user){
    res.send({code: 0, data: user})
  })
})

// 获取用户列表（根据用户类型 user/boss）
router.get('/userlist', function(req, res) {
  const {type} = req.query
  UserModel.find({type}, filter, function(err, users) {
    res.send({code: 0, data: users})
  })
})

// 获取当前用户所有相关的聊天信息列表
router.get('/msglist', function(req, res){
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到的所有user文档数组
  UserModel.find(function(err, userDocs) {
    // 用对象储存所有user信息：key为user的_id，val为name和header组成的user对象
    // const users = {} // 对象容器
    // userDocs.forEach(doc => {
    //   user[doc._id] = {
    //     username: doc.username,
    //     header: doc.header
    //   }
    // })

    const user = userDocs.reduce((users, user) => {
      users[user._id] = {
        username: user.username,
        header: user.header
      }
      return users
    }, {})
    // 返回结构
    /**{
     *   _id:{
     *        username: xxx,
     *        header: xxx
     *    },
     *   _id:{
     *        username: xxx,
     *        header: xxx
     *    },
     * }
     *
     */

    /**
     * 查询userid相关的所有聊天信息
     * find ()
     *
     * 参数1：查询条件
     * 参数2：过滤条件
     * 参数3：回调函数
     *
     */
    ChatModel.find({'$or': [
      {from: userid},
      {to: userid}
    ]},filter,function(err, chatMsgs){
      // 返回包含所有用户和当前用户相关的所有聊天信息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })

})

/**
 * 修改制定消息为已读
 */
router.post('/readmsg', function(req, res) {
  const from = req.body.from
  const to = req.cookies.userid
  /**
   * 更新数据库中的chat数据
   * update()
   *
   * 参数1：查询条件
   * 参数2：更新为指定的数据对象
   * 参数3：是否为1次更新多条，默认只更新一条
   * 参数4：更新完的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(err, doc){
    // console.log('/readmsg', doc)
    res.send({
      code: 0,
      data: data.nModified
    })// 更新的数量
  })

})

module.exports = router;
