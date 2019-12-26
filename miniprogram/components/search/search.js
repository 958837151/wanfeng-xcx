// components/search/search.js

const app = getApp()//拿到app的this对象
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: "apply-shared"
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus:false,
    historylist:[],
    searchList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(){//搜索组件显示
      this.setData({
        isFocus: true
      })
      wx.getStorage({
        key: 'searchHistory',
        success:(res)=> {
          this.setData({
            historylist: res.data
          })
        }
      })
    },
    handlecancel() {//搜索组件隐藏
      this.setData({
        isFocus: false
      })
    },
    handleConfirm(e){//添加搜索记录
      let cloneHistorylist = [...this.data.historylist]
      cloneHistorylist.unshift(e.detail.value)
      wx.setStorage({
        key: "searchHistory",
        data: [...new Set(cloneHistorylist)]
      })
      this.changesearchList(e.detail.value)
    },
    handleDelHistorylist(){//清空历史记录
      wx.removeStorage({
        key: 'searchHistory',
        success:(res)=> {
          this.setData({
            historylist: []
          })
        }
      })
    },
    handleHistorylistItem(e){//点击历史记录
      let val=e.target.dataset.text
      this.changesearchList(val)
    },
    changesearchList(val){//搜索查找用户
      db.collection("users").where({
        nickName: db.RegExp({
          regexp: val,
          options: 'i',
        })
      }).field({
        userImg:true,
        nickName: true
      }).get().then((res)=>{
        this.setData({
          searchList: res.data
        })
      })
    }
  }
})
