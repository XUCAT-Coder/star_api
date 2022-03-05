//数据库链接
//引入
var mongoose=require('mongoose')
//创建链接最后为数据库名称
// mongoose.set('useFindAndModify',false)
var db=mongoose.createConnection('mongodb://localhost:27017/star',{useNewUrlParser:true,useUnifiedTopology:true})
// mongoose.connect('mongodb://localhost/test');
//验证链接成功与否
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.info('数据库链接成功')
});
module.exports=db