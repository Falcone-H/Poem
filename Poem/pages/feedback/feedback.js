Page({
  data: {
    isPostageFree: false,
    postage: null,
    ableSelfTake: false,
    ableMeet: false,
    ableExpress: false,
    cateId: 0,
    cateName: '',
    imgList: [],
    tmpImgList: [],
  },
  onLoad: function (options) {

  },
  onClose() {
    wx.navigateBack({
      delta: 1
    });
  },
  onPost() {
    wx.showToast({
      title: '已提交审核',
      icon: 'success'
    })
  },
  addImage() {
    let that = this;
    let remain = 10 - this.data.imgList.length;
    console.log('上传图片')
    wx.chooseImage({
      count: remain,
      success(res) {
        let length = res.tempFiles.length

        // tempFilePath可以作为img标签的src属性显示图片        
        let tempFilePaths = res.tempFilePaths
        let tempFiles = res.tempFiles
        that.setData({
          tmpImgList: that.data.tmpImgList.concat(tempFilePaths)
        })
        for (var i = 0; i < length; i++) {
          that.data.imgList.push('false');
          var index = that.data.imgList.length - 1
          that.setData({
            imgList: that.data.imgList
          })

          if (tempFiles[i].size > 4500000) {
            console.log("图片太大")
            that.compressImg(tempFilePaths[i], index)
          } else {
            console.log("上传到图床")
            that.uploadFile(tempFilePaths[i], index)
          }

          // console.log(tempFilePaths[i]);

        }
        console.log(that.data.imgList);

      },
      fail(res) {
        console.log(res);
      },
    })
  },
  uploadFile(url, i) {
    let that = this;
    wx.uploadFile({
      url: 'https://sm.ms/api/upload',
      filePath: url,
      name: 'smfile',
      success(res) {
        const data = JSON.parse(res.data);

        console.log(data)
        if (data.code == 'success') {
          console.log("图片上传成功, " + data.data.url)
          that.data.imgList[i] = data.data.url
          that.setData({
            imgList: that.data.imgList
          })
          // that.onLoad();

        } else if (data.code == 'error' && data.msg == 'File is too large.') {
          console.log("上传失败,图片太大")
          that.compressImg(url, i)
        }
      }
    })

  },
  compressImg(url, i) {
    let that = this
    wx.compressImage({
      src: url, // 图片路径
      quality: 50, // 压缩质量
      success() {
        console.log("压缩后重新上传")
        that.uploadFile(url, i)
      },
      fail(res) {
        console.log(res)
        console.log("压缩失败 ")
      }
    })
  },
  removeImg(event) {
    console.log("删除元素")
    let index = event.currentTarget.dataset.index
    let that = this
    that.data.imgList.splice(index, 1)
    that.data.tmpImgList.splice(index, 1)
    this.setData({
      imgList: that.data.imgList,
      tmpImgList: that.data.tmpImgList,
    })

  },
  preview(event) {
    let url = event.currentTarget.dataset.url
    let urls = [];
    let imgList = this.data.imgList
    for (var index in imgList) {
      if (imgList[index] != 'false') {
        urls.push(imgList[index])
      }
    }
    wx.previewImage({
      current: url,
      urls: urls // 需要预览的图片http链接列表
    })
  },

  handleSubmit() {
    wx.showToast({
      title: '感谢您的反馈',
      icon: 'success'
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {

  }
})