var dbserver=require('../dao/dbserver')
//引入邮箱发送方法
var emailserver=require('../dao/emailserver')
//注册页面服务
var signup=require('../server/signup')
//登录页面方法
var signin=require('../server/signin')
//搜索页面方法
var search=require('../server/search')
//用户详情方法
var userdetail=require('../server/userdetail')
//好友申请方法
var friend=require('../server/friend')
//首页处理方法
var index=require('../server/index')
module.exports=function(app){
    app.get('/test',(req,res)=>{
        res.send('这里可以访问')
        // dbserver.findUser(res)
    })
    //邮箱测试
    app.post('/mail',(req,res)=>{
        let mail=req.body.mail
        emailserver.emailSignUp(mail,res)
       
    })
    //注册页面
     //注册
     app.post('/signup/add',(req,res)=>{
        signup.signUp(req,res)
 
     })
     //用户或邮箱是否被占用判断
     app.post('/signup/judge',(req,res)=>{
        signup.judgeValue(req,res)
 
     })
     //登录页面
     app.post('/login/match',(req,res)=>{
         signin.signIn(req,res)
     })
     //测试token
     app.post('/login/token',(req,res)=>{
        // signin.testToken(req,res)
        res.send('this is right')
    })
    //搜索页面
    app.post('/search/user',(req,res)=>{
       search.searchUser(req,res)
    })
    //判断是否为好友操作
    app.post('/search/isfriend',(req,res)=>{
        search.isFriend(req,res)
    })
     //用户详情
    app.post('/user/detail',(req,res)=>{
        userdetail.userDetail(req,res)
    })
    //用户信息修改
    app.post('/user/update',(req,res)=>{
        userdetail.userUpdate(req,res)
    })
     //好友相关
     //获取好友昵称
     app.post('/user/getmarkname',(req,res)=>{
        userdetail.getFriendName(req,res)
    })
    //好友昵称修改
    app.post('/user/changemarkname',(req,res)=>{
        userdetail.changeFriendName(req,res)
    })
    //好友申请
    app.post('/friend/friendapply',(req,res)=>{
        friend.applyFriend(req,res)
    })
    //更新好友状态
    app.post('/friend/updatefridendstate',(req,res)=>{
        friend.updateFriendState(req,res)
    })
    //拒绝/删除好友
    app.post('/friend/refuseorrejectfriend',(req,res)=>{
        friend.refuseOrRejectFriend(req,res)
    })
    //首页获取好友列表
    app.post('/index/getfriendlist',(req,res)=>{
        index.getFriendList(req,res)
    })
    //获取最后一条消息
    app.post('/index/getlastmessage',(req,res)=>{
        index.getLastMessage(req,res)
    })
    //获取好友未读消息数
    app.post('/index/getunreadmessagecount',(req,res)=>{
        index.getUnreadNum(req,res)
    })
     //更改好友消息状态为已读
     app.post('/index/updatebiuniquestate',(req,res)=>{
        index.updateBiuniqueState(req,res)
    })
}