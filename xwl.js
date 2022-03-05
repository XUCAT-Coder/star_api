//引入body-parser
//var bodyParser=require('body-parser') 已被弃用
//引入token
var jwt=require('./dao/jwt')
const express = require('express')
const app = express()
const port = 3000


//解决跨域问题
// 设置跨域和相应数据格式
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
	res.setHeader('Content-Type', 'application/json;charset=utf-8')
	res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	res.header('X-Powered-By', ' 3.2.1')
	if (req.method == 'OPTIONS') {
 		/*让options请求快速返回*/
     res.sendStatus(200)
	} else {
		next()
	}
})

  //解析前端数据
  app.use(express.json())
  app.use(express.urlencoded({ extended:true,limit:'50mb'}))
  //各个页面路径
  // app.get('/', (req, res) => {
  //   res.send('Hello World!')
  // })
  //静态文件目录
  app.use(express.static(__dirname+'/data'))
  app.use(function(req,res,next){
    if (typeof(req.body.token)!='undefined') {
        //处理token匹配
          let token=req.body.token
          let flag=jwt.verifyToken(token)
          console.log(flag)
          if (flag==1) {
            next()
            //token验证通过
          }else{
            res.send({status:300})
            //token验证未通过
          }
    }else{
      next()
    }
  })
  //路由
  require('./router/index')(app)
  //文件处理
  require('./router/handleFile')(app)
//404 page
app.use(function(req,res,next){
    let err=new Error('Not Found')
    err.status=404
    next(err)
})
//出现错误处理
app.use(function(err,req,res,next){
    res.status(err.status||500)
    res.send(err.message)
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})