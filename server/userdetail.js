
var dbserver=require('../dao/dbserver')
//用户详情
exports.userDetail=function(req,res){
    let id=req.body.id
    dbserver.userDetail(id,res)
}
//用户信息修改
exports.userUpdate=function(req,res){
    let data=req.body
    dbserver.userUpdate(data,res)
}
//获取好友昵称
exports.getFriendName=function(req,res){
    let data=req.body
    dbserver.getFriendName(data,res)
}
//修改好友昵称
exports.changeFriendName=function(req,res){
    let data=req.body
    dbserver.changeFriendName(data,res)
}