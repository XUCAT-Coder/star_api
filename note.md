### 所需要掌握的知识点

#### 解决跨域问题

```js
//解决跨域问题
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") res.send(200);
  //让options尝试请求快速结束
  else next();
});
//必须放在所有get页面之前
```

#### module.exports 和 exports

```r
exports只能使用语法来向外暴露内部变量：如http://exports.xxx = xxx;
module.exports既可以通过语法，也可以直接赋值一个对象
module.exports === exports
```

#### 理解接口

```r
app.get('/test',(req,res)=>{
        res.send('这里就是发给前端的接口内容')
})
```
