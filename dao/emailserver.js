//邮箱发送方法
var nodemailer=require('nodemailer')
//引入证书文件
var credentials=require('../config/credentials')
//创建传输方式
var transporter=nodemailer.createTransport({
        service:'qq',
        auth:{
            user:credentials.qq.user,
            pass:credentials.qq.pass
        }
})
//注册发送邮件给用户
exports.emailSignUp=function(email,res){
        //发送信息
        let options={
            from:'1654176206@qq.com',
            to:email,
            subject:'感谢您注册星辰~',
            html:'<span>星辰欢迎您的加入~</span><a href="http://localhost:8080/">进入首页</a>'
        }
        //发送邮件
        transporter.sendMail(options,function(err,msg){
            if(err){
                res.send(err)
            }else{
                res.send({status:200,toast:'邮箱发送成功'})
                
            }
        })
}