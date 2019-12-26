const router = require('koa-router')()
const config=require("../config.js")
const request=require("request-promise")
const fs=require('fs')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/uploadBannerImg', async (ctx, next) => {
  var files=ctx.request.files
  var file=files.file
  try {
    let options={
      url:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appid+'&secret='+config.secret + '', 
      json:true
    }
    let {access_token}=await request(options)
    let fileName=`${Date.now()}.jpg`
    let filePath=`banner/${fileName}`
    options={
      methods: 'POST',
      uri:'https://api.weixin.qq.com/tcb/uploadfile?access_token='+access_token+ '', 
      body:{
        "env":"text-pvszg",
        "path":filePath
      },
      json:true
    }
    let res=await request(options)
    options={
      methods: 'POST',
      url:res.url, 
      formData:{
        "Signature":res.authorization,
        "key":filePath,
        "x-cos-security-token":res.token,
        "x-cos-meta-fileid":res.cos_file_id,
        "file":{
          value:fs.createReadStream(file.path),
          options:{
            filename:fileName,
            contentType:file.type
          }
        }
      }
    }
    await request(options)
    ctx.body=res
  } catch (error) {
    
  }
})

module.exports = router
