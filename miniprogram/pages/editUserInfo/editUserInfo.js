// miniprogram/pages/editUserInfo/editUserInfo.js

const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signnature: "",
    phoneNumber: "",
    weixinNumber: "",
    isPosition: true,
    nickName: "",
    userImg: ""
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
    this.setData({
      signnature: app.userInfo.signnature,
      phoneNumber: app.userInfo.phoneNumber,
      weixinNumber: app.userInfo.weixinNumber,
      isPosition: app.userInfo.isPosition,
      nickName: app.userInfo.nickName,
      userImg: app.userInfo.userImg
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  handleText(e) {//个性签名
    let value = e.detail.value
    this.setData({
      signnature: value
    })
  },
  handleNumber(e) {//手机号
    let value = e.detail.value
    this.setData({
      phoneNumber: value
    })
  },
  handleweixinNumber(e) {//微信号
    let value = e.detail.value
    this.setData({
      weixinNumber: value
    })
  },
  switchChange(e) {//位置开关
    let value = e.detail.value
    this.setData({
      isPosition: value
    })
  },
  handlenickName(e) {//昵称
    let value = e.detail.value
    this.setData({
      nickName: value
    })
  },
  handleUserImg(e) {//头像
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        this.setData({
          userImg: tempFilePaths
        })
      }
    })
  },
  handleUserImgFnc() {//保存头像上传
    wx.showLoading({
      title: '头像更新中',
    })
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".jpg"
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: this.data.userImg, // 小程序临时文件路径
    }).then((res)=>{
      let fileID=res.fileID
      if(fileID){
        db.collection("users").doc(app.userInfo._id).update({
          data:{
            userImg: fileID
          }
        }).then((res)=>{
          wx.hideLoading()
          wx.showToast({
            title: '头像上传成功',
          })
          app.userInfo.userImg = fileID
        })
      }
    })
  },
  handleBtn() {
    this.updataSignnature()
  },
  updataSignnature() {//保存设置
    wx.showLoading({
      title: '设置更新中',
    })
    console.log(app.userInfo._id, 666)
    db.collection("users").doc(app.userInfo._id).update({
      data: {
        signnature: this.data.signnature,
        phoneNumber: this.data.phoneNumber,
        weixinNumber: this.data.weixinNumber,
        isPosition: this.data.isPosition,
        nickName: this.data.nickName
      }
    }).then((res) => {
      wx.hideLoading()
      wx.showToast({
        title: '设置保存成功',
      })
      app.userInfo.signnature = this.data.signnature
      app.userInfo.phoneNumber = this.data.phoneNumber
      app.userInfo.weixinNumber = this.data.weixinNumber
      app.userInfo.isPosition = this.data.isPosition
      app.userInfo.nickName = this.data.nickName
    })
  },
  bindGetUserInfoNickName(e) {//使用微信昵称
    let userInfo = e.detail.userInfo
    if (userInfo) {
      this.setData({
        nickName: userInfo.nickName
      }, () => {
        this.updataSignnature()
      })
    }
  },
  bindGetUserInfoUserImg(e) {//使用微信头像
    let userInfo = e.detail.userInfo
    if (userInfo) {
      this.setData({
        userImg: userInfo.avatarUrl
      }, () => {
        db.collection("users").doc(app.userInfo._id).update({
          data: {
            userImg: userInfo.avatarUrl
          }
        }).then((res) => {
          wx.showLoading({
            title: '微信头像更新中',
          })
          wx.hideLoading()
          wx.showToast({
            title: '微信头像上传成功',
          })
          app.userInfo.userImg = userInfo.avatarUrl
        })
      })
    }
  }
})