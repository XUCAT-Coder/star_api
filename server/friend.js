var dbserver=require('../dao/dbserver')
//好友申请
exports.applyFriend=function(req,res){
    let data=req.body
    dbserver.friendApply(data,res)
}
//好友状态更新
exports.updateFriendState=function(req,res){
    let data=req.body
    dbserver.updateFriendState(data,res)
}
//拒绝/删除好友
exports.refuseOrRejectFriend=function(req,res){
    let data=req.body
    dbserver.refuseOrRejectFriend(data,res)
}