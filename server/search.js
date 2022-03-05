var dbserver=require('../dao/dbserver')
//搜索用户
exports.searchUser=function(req,res){
    let data=req.body.data
    dbserver.searchUser(data,res)
}
//判断是否为好友
exports.isFriend=function(req,res){
    let uid=req.body.uid
    let fid=req.body.fid
    dbserver.isFriend(uid,fid,res)
}