// 云函数入口文件
const cloud = require('wx-server-sdk')

// env: cloud.DYNAMIC_CURRENT_ENV
cloud.init({
  env: "text-pvszg"
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {

    if(typeof event.data == "string"){
      event.data = eval("(" + event.data + ")")
    }
    if(event.doc){
      return await db.collection(event.collection).doc(event.doc).update({
        // data 传入需要局部更新的数据
        data: {
          ...event.data
        }
      })
    }else{
      return await db.collection(event.collection).where({
        ...event.where
      }).update({
        // data 传入需要局部更新的数据
        data: {
          ...event.data
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}