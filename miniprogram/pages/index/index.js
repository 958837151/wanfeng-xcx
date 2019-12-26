// miniprogram/pages/index/index.js

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagesUrl: ['../../images/swiperImg/a.jpg', '../../images/swiperImg/b.jpg'],
    listData:[],
    indicatorDots: true,
    autoplay: true,
    current:"recommend"
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
    this.getlistData()
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
  handleLinks(e){//点赞
    let id=e.target.dataset.id
    // 使用云函数
    wx.cloud.callFunction({
      name:"update",
      data:{
        collection:"users",//要操作的数据库
        doc: id,//传过去的id
        data: "{links:_.inc(1)}"
      }
    }).then((res)=>{
      let updated=res.result.stats.updated
      if (updated){
        let clonelistData = [...this.data.listData]
        for (let i = 0; i < clonelistData.length;i++){
          if (clonelistData[i]._id==id){
            clonelistData[i].links++
          }
        }
        this.setData({
          listData: clonelistData
        })
      }
    })
  },
  handleCurrent(e){//切换tab
    let current = e.target.dataset.current
    if (current != this.data.current){
      this.setData({
        current
      },()=>{
        this.getlistData()
      })
    }
  },
  getlistData(){//获取列表数据
    // field返回对应字段 orderBy排序
    db.collection("users").field({
      userImg: true,
      nickName: true,
      links: true
    }).orderBy(this.data.current, "desc").get().then((res) => {
      this.setData({
        listData: res.data
      })
    })
  },
  handleDetail(e){//跳转详情
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + id,
    })
  }
})