var mongoose=require('mongoose')
var db=require('../config/db')
var Schema = mongoose.Schema
//用户表
var UserSchema=new Schema({
    name:{type: String},
    psw:{type: String},
    email:{type: String},
    sex:{type: String,default:'asexual'},
    birth:{type: Date},
    phone:{type: Number},
    intro:{type: String,default:'这个人很懒，什么都没有留下~'},
    imgurl:{type: String,default:'user.png'},
    time:{type: Date},//注册时间
})
//好友表
var FriendSchema=new Schema({
    userID:{type: Schema.Types.ObjectId,ref:'User'},
    friendID:{type: Schema.Types.ObjectId,ref:'User'},
    state:{type: String},//0为好友，1为申请中，2为发送申请者
    markname:{type: String},
    time:{type: Date},//生成时间
    lasttime:{type: Date}//最后联系时间
})
//一对一消息表
var MessageSchema=new Schema({
    userID:{type: Schema.Types.ObjectId,ref:'User'},
    friendID:{type: Schema.Types.ObjectId,ref:'User'},
    message:{type: String},
    Types:{type: String},//0为文字，1为图片，2为音频，3为定位地址
    time:{type: Date},//发送时间
    state:{type: Number},//0已读，1未读
})
module.exports=db.model('User',UserSchema)
module.exports=db.model('Friend',FriendSchema)
module.exports=db.model('Message',MessageSchema)