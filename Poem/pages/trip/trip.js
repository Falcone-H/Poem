const api = require('../../utils/api.js');

const app = getApp();
Page({
  data: {
    trip: {},
    options: null,
    windowWidth: 0,
  },
  onReady() {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.options.name,
    });
  },
  onLoad(options) {
    wx.cloud.init()
    setTimeout(() => {
      console.log("get trip data...")
    }, 1000)
    const self = this;
    const id = options.id;
    self.setData({
      options,
      windowWidth: app.systemInfo.windowWidth,
    });
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
    });
    // api.getTripInfoByID({
    //   query: {
    //     tripId: id,
    //   },
    //   success: (res) => {
    //     console.log(res.data)
    //     const trip = res.data;
    //     self.setData({
    //       trip,
    //     });
    //     wx.hideToast();
    //   },
    // });
    this.getTripData(id);
  },
  getTripData(id) {
    var that = this;
    let tripId = id;
    tripId = parseInt(tripId)
    console.log(tripId)
    const db = wx.cloud.database()
    db.collection('trip').where({
      id: tripId
    }).get({
      success: function (res) {
        console.log(res.data[0])
        const trip = res.data[0]
        that.setData({
          trip,
        })
        wx.hideToast();
      }
    })
  },
  viewWaypoint(e) {
    const self = this;
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../waypoint/waypoint?waypointId=${ds.waypoint}&tripId=${self.data.trip.id}`,
    });
  },
  gotoUser(e) {
    const userId = e.target.dataset.id;
    wx.navigateTo({
      url: `../user/user?id=${userId}`,
    });
  },
});