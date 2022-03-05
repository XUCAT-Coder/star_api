//主页消息列表
var dbserver=require('../dao/dbserver')
//获取好友列表
exports.getFriendList=function(req,res){
    let uid=req.body.uid
    let state=req.body.state
    dbserver.getUsers(uid,state,res)
}
//获取最后消息
exports.getLastMessage=function(req,res){
    let uid=req.body.uid
    let fid=req.body.fid
    dbserver.getBiunique(uid,fid,res)
}
//获取好友未读消息数
exports.getUnreadNum=function(req,res){
    let uid=req.body.uid
    let fid=req.body.fid
    dbserver.unreadNum(uid,fid,res)
}
//更改好友消息是否已读状态
exports.updateBiuniqueState=function(req,res){
    let uid=req.body.uid
    let fid=req.body.fid
    dbserver.updateBiuniqueState(uid,fid,res)
}