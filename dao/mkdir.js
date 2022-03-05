//动态新建目录
const fs=require('fs')
const path=require('path')
exports.mkdirs=function(pathname,callback){
    pathname=path.isAbsolute(pathname)?pathname:path.join(__dirname,pathname)
    //获取相对路径
    pathname=path.relative(__dirname,pathname)
    let floders=pathname.split(path.sep)
    let pre=""
    floders.forEach(floder => {
        try {
            //文件已创建
            let _stat=fs.statSync(path.join(__dirname,pre,floder))
            let hasMkdir=_stat&&_stat.isDirectory()
            if (hasMkdir) {
                callback
            }
        } catch (error) {
            //文件不存在，创建文件
            try {
                //同步创建文件
                fs.mkdirSync(path.join(__dirname,pre,floder))
                callback&&callback(null)
            } catch (error) {
                callback&&callback(error)
            }
        }
        //路径合并
        pre=path.join(pre,floder)
    });
}