var dbmodel=require('../model/dbmodel')
//引入token
var jwt=require('../dao/jwt')
//引入加密
var bcrypt=require('../dao/bcrypt')
const { pass } = require('../config/db')
//拿到用户表
var User=dbmodel.model('User')
//拿到好友表
var Friend=dbmodel.model('Friend')
//拿到一对一消息表
var Message=dbmodel.model('Message')
exports.findUser=function(res){
    //查找条件，输出条件，查找结果
    
    User.find(function(err,val){
         if(err){
             console.log('用户数据查找失败'+err)
         }else{
             
             res.send(val)
            
         }
    })
}
//新建用户
exports.buildUser=function(name,mail,psw,res){
    //密码加密
    let password=bcrypt.encryption(psw)
    //传入数据
    let data={
        name:name,
        email:mail,
        psw:password,
        time:new Date()
    }
    //用户
    let user=new User(data)
    user.save(function(error,result){
        if (error) {
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}
//匹配用户表元素个数
exports.countUserValue=function(data,type,res){
    let wherestr={}
    wherestr[type]=data
    User.countDocuments(wherestr,function(err,result){
        if (err) {
            res.send({status:500})
            // res.sendStatus(500)
        }else{
           
            res.send({status:200,result})
        }
    })
}
//用户验证
exports.checkUser=function(data,psw,res){
    let wherestr={$or:[{'name':data},{'email':data}]}
    let out={'name':1,'imgurl':1,'psw':1}
    User.find(wherestr,out,function(err,result){
        if (err) {
            res.send({status:500})
        }else{
            if (result=='') {
                res.send({status:400})
            }
            result.map(function(e){
                const pswMatch=bcrypt.deciphering(psw,e.psw)
                if (pswMatch) {
                    let token=jwt.generateToken(e._id)
                    let back={
                        id:e._id,
                        name:e.name,
                        imgurl:e.imgurl,
                        token:token
                    }
                    res.send({status:200,back})
                }else{
                    res.send({status:400})
                }
            })
            
        }
    })
}
//搜索用户
exports.searchUser=function(data,res){
    let wherestr
    if (data=='星辰') {
        wherestr={}
    }else{
        wherestr={$or:[{'name':{$regex:data}},{'email':{$regex:data}}]}
    }
    let out={'name':1,'email':1,'imgurl':1}
    User.find(wherestr,out,function(err,result){
        if (err) {
            res.sendStatus(500)
        }else{
           if (result.length==0) {
            //无查询结果
            res.send({status:400})
           }else if(result.length>0){
            res.send({status:200,result})
           }
        }
    })
}
//判断是否为好友
exports.isFriend=function(uid,fid,res){
    let wherestr={'userID':uid,'friendID':fid,'state':0}
    Friend.findOne(wherestr,function(err,result){
        if (err) {
            res.send({status:500})
            // res.sendStatus(500)
        }else{
            if (result) {
                //是好友
                res.send({status:200})
            }else{
                //不是好友
                res.send({status:400})
            }
           
        }
    })
}
//用户详情
exports.userDetail=function(id,res){
        let wherestr={'_id':id}
        let out={'psw':0}
        // res.send('到这儿没问题')
        User.findOne(wherestr,out,function(err,result){
            if (err) {
                res.send({status:500})
                // res.sendStatus(500)
            }else{
                res.send({status:200,result})
            }
        })
}
function update(data,updatestr,res){
    User.findByIdAndUpdate(data.id,updatestr,function(err2,result2){
        if (err2) {
            //修改失败
            res.send({status:500})
        }else{
            //修改成功
            res.send({status:200})
           
        }
    })
}
//用户信息修改
exports.userUpdate=function(data,res){
    let updatestr={}
    let out={}
    //判断是否有密码
    if (typeof(data.psw)!='undefined') {
        //有密码进行匹配
        wherestr={'_id':data.id}
        out={'psw':1}
        User.find(wherestr,out,function(err1,result1){
            if (err1) {
                res.send({status:500})
            }else{
                if (result1=='') {
                    res.send({status:400})
                }
                result1.map(function(e){
                    const pswMatch=bcrypt.deciphering(data.psw,e.psw)
                    if (!pswMatch) {
                        res.send({status:302})//新老密码不匹配
                    }
                    if (pswMatch) {
                        //密码验证成功
                        //如果修改密码,就先加密
                            if (data.type=='psw') {
                                if (data.psw!=data.data) {
                                    //密码加密
                                    let password=bcrypt.encryption(data.data)
                                
                                    updatestr[data.type]=password
                                    update(data,updatestr,res)
                                }else{
                                    res.send({status:303})
                                }
                                
                            }else{
                                //邮箱匹配
                                updatestr[data.type]=data.data
                                User.countDocuments(updatestr,function(err,result){
                                    if (err) {
                                        res.send({status:500})
                                        // res.sendStatus(500)
                                    }else{
                                        
                                        if (result==0) {
                                            //没有匹配项可以进行修改操作
                                            update(data,updatestr,res)
                                        }else{
                                            //已经存在
                                            res.send({status:301})
                                        }
                                    }
                                })
                            }
                        
                           
                    }else if (data.type=='name') {
                        //用户名匹配机制
                        updatestr[data.type]=data.data
                        User.countDocuments(updatestr,function(err,result){
                            if (err) {
                                res.send({status:500})
                                // res.sendStatus(500)
                            }else{
                                
                                if (result==0) {
                                    //没有匹配项可以进行修改操作
                                    update(data,updatestr,res)
                                }else{
                                    //已经存在
                                    res.send({status:301})
                                }
                            }
                        })
                    }
                    else{
                        //密码匹配失败
                        res.send({status:400})
                    }
                })
                
            }
        })
    }else{
        updatestr[data.type]=data.data
        update(data,updatestr,res)
    }
    
}
//获取好友昵称
exports.getFriendName=function(data,res){
    let wherestr={'userID':data.uid,'friendID':data.fid}
    let out={'markname':1}
    Friend.findOne(wherestr,out,function(err,result){
        if (err) {
            //获取失败
            res.send({status:500})
        }else{
            //获取成功
            res.send({status:200,result})
           
        }
    })
}
//修改好友昵称
exports.changeFriendName=function(data,res){
    let wherestr={'userID':data.uid,'friendID':data.fid}
    let updatestr={'markname':data.name}
    Friend.updateOne(wherestr,updatestr,function(err,result){
        if (err) {
            //修改失败
            res.send({status:500})
        }else{
            //修改成功
            res.send({status:200})
           
        }
    })
}
//添加好友表
exports.buildFriend=function(uid,fid,state,res){
    let data={
        userID:uid,
        friendID:fid,
        state:state,
        time:new Date(),
        lasttime:new Date()
    }
    //好友
    let friend=new Friend(data)
    friend.save(function(error,result){
        if (error) {
           console.log('申请好友表error')
        }else{
            res.send({status:200})
        }
    })
}
//与好友最后联系时间
exports.updateLastTime=function(uid,fid){

        let wherestr= {$or:[{'userID':uid,'friendID':fid},{'userID':fid,'friendID':uid}]}
        let updatestr={'lasttime':new Date()}
        Friend.update(wherestr,updatestr,function(err,result){
            if (err) {
                console.log('更新与好友最后联系时间error')
            }else{
               
            }
        })
}
//添加一对一消息
exports.biunique=function(uid,fid,mes,type,res){
    let data={
        userID:uid,
        friendID:fid,
        message:mes,
        Types:type,//0为文字，1为图片，2为音频，3为定位地址
        time:new Date(),//发送时间
        state:1,//0已读，1未读
    }
    //好友
    let message=new Message(data)
    message.save(function(error,result){
        if (error) {
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}
//好友申请
exports.friendApply=function(data,res){
        //判断是否已经申请过
        let wherestr={'userID':data.uid,'friendID':data.fid}
        Friend.countDocuments(wherestr,(err,result)=>{
            if (err) {
                res.send({status:500})
            }else{
                
                if (result==0) {
                    //初次申请
                    //0为好友，1为申请中，2为发送申请者
                    this.buildFriend(data.uid,data.fid,2)
                    this.buildFriend(data.fid,data.uid,1)
                }else{
                    //已经申请过好友
                    this.updateLastTime(data.uid,data.fid)
                    // this.updateLastTime(data.fid,data.uid)
                }
                this.biunique(data.uid,data.fid,data.mes,0,res)
            }
        })
}
//更新好友状态
exports.updateFriendState=function(data,res){
    let wherestr= {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}
    let updatestr={'state':0}
    Friend.updateMany(wherestr,updatestr,function(err,result){
        if (err) {
           res.send({status:500})
        }else{
           res.send({status:200})
        }
    })
}
//拒绝/删除好友
exports.refuseOrRejectFriend=function(data,res){
    let wherestr= {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}
    Friend.deleteMany(wherestr,function(err,result){
        if (err) {
           res.send({status:500})
        }else{
           res.send({status:200})
        }
    })
}
//获取用户列表
exports.getUsers=function(uid,state,res){
    let query=Friend.find({})
    //查询条件
    query.where({'userID':uid,'state':state})
    //查找friendID关联的user对象
    query.populate('friendID')
    //根据最后时间排序
    query.sort({'lasttime':-1})
    //结果
    query.exec().then(function(e){
        let result=e.map((item)=>{
            return {
                id:item.friendID._id,
                name:item.friendID.name,
                markname:item.markname,
                imgurl:item.friendID.imgurl,
                lasttime:item.lasttime
            }
        })
        res.send({status:200,result})
    }).catch(function(err){
        res.send({status:500})
    })
}
//获取一对一消息
exports.getBiunique=function(uid,fid,res){
    let query=Message.findOne({})
    //查询条件
    query.where({$or:[{'userID':uid,'friendID':fid},{'userID':fid,'friendID':uid}]})
    //根据最后时间排序
    query.sort({'time':-1})
    //结果
    query.exec().then(function(e){
        let result={
                message:e.message,
                time:e.time,
                Types:e.Types
        }
        res.send({status:200,result})
    }).catch(function(err){
        res.send({status:500})
    })
}
//汇总一对一消息未读数
exports.unreadNum=function(uid,fid,res){
    let wherestr={'userID':uid,'friendID':fid,'state':1}
    Message.countDocuments(wherestr,(err,result)=>{
        if (err) {
            res.sendStatus(500)
        }else{
            res.send({status:200,result})
        }
    })
}
//一对一消息状态修改
exports.updateBiuniqueState=function(uid,fid,res){
    let wherestr={'userID':uid,'friendID':fid,'state':1}
    let updatestr={'state':0}
    Message.updateMany(wherestr,updatestr,function(err,result){
        if (err) {
            res.sendStatus(500)
        }else{
            res.send({status:200})
        }
    })
}