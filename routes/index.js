var express = require('express');
var router = express.Router();

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
 * 4.有一个已注册用户
 * 5.注册成功返回{code:0, data:{_id: 'xxx', username: 'xxx', password: 'xxx'}}
 * 6.注册失败返回 { code：1 , msg: '用户名已存在'}
 */

/**
 * function (req,res,next)回调函数
 * req：处理请求
 * res：返回相应
 * next:
 */
router.post('/register', function(req, res) {
  // 获取请求参数

})

module.exports = router;
