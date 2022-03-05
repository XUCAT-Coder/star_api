//处理文件
//引入附件上传插件
const multer  = require('multer')
var mkdir=require('../dao/mkdir')
 //磁盘存储引擎
    //控制文件的存储
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          //由前端提供路径
          let url=req.body.url
          mkdir.mkdirs('../data/'+url,err=>{
            console.log(err)
          })
          cb(null, './data/'+url)
        },
        filename: function (req, file, cb) {
          let name=req.body.name
          let type=file.originalname.replace(/.+\./,".")
          let fullname=name+type
          console.log(fullname)
          if (fullname.search('file-')!=-1) {
            fullname=fullname.split('file')[0]+'.png'
          }
          // if (fullname.slice(-1)!='.') {
          //   fullname=fullname+'.png'
          // }

          cb(null,fullname)
        }
      })
      
      const upload = multer({ storage: storage })
module.exports=function(app){
    //文件上传
    app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
        // req.files 是 `photos` 文件数组的信息
        // req.body 将具有文本域数据，如果存在的话
        let url=req.body.url+'/'
        //获取文件名
        let data=req.files[0].filename
        let imgurl='/'+url+data
        res.send(imgurl)

    })

}