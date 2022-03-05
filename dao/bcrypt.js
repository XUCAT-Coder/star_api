var bcrypt=require('bcryptjs')
//生成hash密码
exports.encryption=function(e){
    //加盐算法
    //生成随机数
    let salt=bcrypt.genSaltSync(10)
    //生成hash密码
    //要加密的文件和盐
    var hash = bcrypt.hashSync(e, salt);
    return hash
}
exports.deciphering=function(e,hash){
    let flag=bcrypt.compareSync(e, hash); // true
    return flag
}