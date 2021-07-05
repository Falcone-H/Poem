const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    trips: [],
    start: 0,
    loading: false,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad() {
    this.getCloudDatabase();
  },

  getHotTripList() {
    api.getHotTripList({
      data,
      success: (res) => {
        console.log(res)
        let newList = res.data.data.elements;
        newList.map((trip) => {
          const item = trip;
          item.data[0].date_added = formatTime(new Date(item.data[0].date_added * 1000), 1);
          return item;
        });
        if (needRefresh) {
          wx.stopPullDownRefresh();
        } else {
          newList = self.data.trips.concat(newList);
        }
        self.setData({
          trips: newList,
        });
        const nextStart = res.data.data.next_start;
        self.setData({
          start: nextStart,
          loading: false,
        });
        wx.hideLoading()
      },
    });
  },

  getCloudDatabase() {
    wx.cloud.init()
    setTimeout(() => {
      console.log("loading...")
    }, 1000)
    const db = wx.cloud.database()
    var that = this
    db.collection("travel_data").get({
      success: function (res) {
        console.log(res)
        let newList = res.data[0].data.elements;
        newList.map((trip) => {
          const item = trip;
          item.data[0].date_added = formatTime(new Date(item.data[0].date_added * 1000), 1);
          return item;
        });
        that.setData({
          trips: newList,
        });
        const nextStart = res.data.data.next_start;
        that.setData({
          start: nextStart,
          loading: false,
        });
      }
    })
    wx.hideLoading()
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    console.log(ds.id)
    console.log(ds.name)
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
  handlePost() {
    wx.navigateTo({
      url: '../post/post'
    })
  }
});