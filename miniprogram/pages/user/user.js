// miniprogram/pages/user/user.js

const app=getApp()//拿到app的this对象
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userImg:"/images/user/user.jpg",
    nickName: "晚风",
    isLogin: false,
    disabled: true,
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
    wx.cloud.callFunction({
      name:"login",
      data:{}
    }).then((res)=>{
      console.log(res)
      db.collection("users").where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0])
          this.setData({
            userImg: app.userInfo.userImg,
            nickName: app.userInfo.nickName,
            isLogin: true,
            id: app.userInfo._id
          })
          this.getmessage()
        } else {
          this.setData({
            disabled: false
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userImg: app.userInfo.userImg,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo(e){//获取用户信息
    let userInfo = e.detail.userInfo
    // 判断有用户信息并且登录情况下
    if (userInfo && !this.data.isLogin){
       db.collection("users").add({
         data:{
           userImg: userInfo.avatarUrl,
           nickName: userInfo.nickName,
           signnature:"",
           phoneNumber: "",
           weixinNumber: "",
           links: 0,
           time:new Date(),
           isPosition:true,
           friendList:[],
           longitude: this.longitude,
           latitude: this.latitude,
           location: db.Geo.Point(this.longitude, this.latitude)
         }
       }).then((res)=>{
          db.collection("users").doc(res._id).get().then((res)=>{
            // console.log(res)
            app.userInfo = Object.assign(app.userInfo,res.data)
            this.setData({
              userImg: app.userInfo.userImg,
              nickName: app.userInfo.nickName,
              isLogin: true,
              id: app.userInfo._id
            })
          })
       })
    }
  },
  getmessage(){//监听消息列表
    db.collection("message").where({
      userId:app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
        console.log(snapshot)
        if (snapshot.docChanges.length){
          let list = snapshot.docChanges[0].doc.list
          if(list.length){
            wx.showTabBarRedDot({
              index: 2,
            })
            app.userMessage=list
          }else{
            wx.hideTabBarRedDot({
              index: 2,
            })
            app.userMessage = []
          }
        }
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  getLocation() {//获取位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude
      }
    })
  }
})