// components/removeMsgList/removeMsgList.js

const app=getApp()
const db=wx.cloud.database()
const _=db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeMsg() {//删除好友添加数据库操作
      db.collection("message").where({
        userId: app.userInfo._id
      }).get().then((res) => {
        let list = res.data[0].list
        list = list.filter((val, i) => {
          return val != this.data.messageId
        })
        wx.cloud.callFunction({
          name: "update",
          data: {
            collection: "message",
            where: {
              userId: app.userInfo._id
            },
            data: {
              list
            }
          }
        }).then((res) => {
          this.triggerEvent('myevent', list)
        })
      })
    },
    handleDelMessage(){//删除好友添加
      wx.showModal({
        title: '删除提示',
        content: '是否删除',
        confirmText: "删除",
        success:(res)=> {
          if (res.confirm) {
            this.removeMsg()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    handleAddFriend(){//添加好友
      wx.showModal({
        title: '好友申请提示',
        content: '是否通过好友申请',
        confirmText: "同意",
        success: (res) => {
          if (res.confirm) {
            // 同意添加
            db.collection("users").doc(app.userInfo._id).update({
              data:{
                friendList:_.unshift(this.data.messageId)
              }
            }).then((res)=>{

            })
            // 给添加的好友加friendList
            wx.cloud.callFunction({
              name:"update",
              data:{
                collection:'users',
                doc: this.data.messageId,
                data: `{friendList:_.unshift('${app.userInfo._id}')}`
              }
            }).then((res)=>{

            })
            this.removeMsg()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      db.collection("users").doc(this.data.messageId).field({
        userImg:true,
        nickName:true
      }).get().then((res)=>{
        this.setData({
          userMessage:res.data
        })
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
