const DEFAULT_PAGE = 0;

Page({
  startPageX: 0,
  currentView: DEFAULT_PAGE,
  data: {
    poemData: [],
    nowclientX: "",
    index: 21,
    isShow: true,
    toView: `card_${DEFAULT_PAGE}`,
  },

  onLoad: function () {
    wx.cloud.init()
    setTimeout(()=> {
      console.log("loading...")
    }, 1000)
    this.getCloudDatabase()
  },

  getCloudDatabase() {
    const db = wx.cloud.database()
    var that = this
    db.collection("movie_list").get({
      success: function (res) {
        that.setData({
          poemData: res.data[0].list,
        })
      }
    })
  },

  touchStart(e) {
    this.startPageX = e.changedTouches[0].pageX;
  },

  touchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    const maxPage = this.data.poemData.length - 1;
    if (Math.abs(moveX) >= 50){
      if (moveX > 0) {
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
      } else {
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
      }
    }
    this.setData({
      toView: `card_${this.currentView}`
    });
  },
  clickLike(e) {
    var isShow = !this.data.isShow;
    this.setData({
      isShow: isShow
    })
  },
  handleShow() {
    console.log("show")
    var isShow = !this.data.isShow;
    this.setData({
      isShow: isShow
    })
  }
})