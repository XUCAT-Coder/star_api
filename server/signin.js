var dbserver=require('../dao/dbserver')
//引入token
var jwt=require('../dao/jwt')
//从前端获取数据
//登录
exports.signIn=function(req,res){
    let user=req.body.user
    let psw=req.body.psw
    dbserver.checkUser(user,psw,res)
}
//测试token
exports.testToken=function(req,res){
    let token=req.body.token
    let result=jwt.verifyToken(token)
    res.send(result)
}