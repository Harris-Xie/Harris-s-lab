const { floatDiv, floatAdd, floatSub } = require('../../utils/util')

const requestUrl = require('../../config').requestUrl
var json1
var app=getApp()



Page({
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/component/pages/form/form'
    }
  },
  onLoad: function () {
    app.getUserInfo(userInfo => this.setData({ userInfo }))
  },

  data: {
    pickerHidden: false,//是否显示第一次定投
    name: '',//存储基金名称
    peak:false,//无用参数
    jz:0, //储存净值
    inputValue: 0 ,//存储用户输入的定投金额
    advice_value: 0,//建议定投金额
    code:"",//基金代码
    more: false,//是否展示更多基金信息
    jz_last:0,
    userInfo: {}
  },

  pickerConfirm(e) {
    this.setData({
      pickerHidden: true
    })
    this.setData({
      name: e.detail.value
    })
  },

  pickerCancel() {
    this.setData({
      pickerHidden: true
    })
  },

  pickerShow() {
    this.setData({
      pickerHidden: false
    })
  },
  
 


  formSubmit(e) {
    var _this = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.request({
      url: 'http://fundgz.1234567.com.cn/js/'+e.detail.value.input_c+'.js', //仅为示例，并非真实的接口地址
      data: {
    
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        var msg = res.data;
        var msg1 = msg.match(/jsonpgz\((.*)/)[1];
        msg1 = msg1.replace(")", "");
        msg1 = msg1.replace(";", "");
        console.log(msg1);
        json1 = JSON.parse(msg1);
        console.log(json1.name);
        _this.setData({
          inputValue: parseInt(e.detail.value.input),
          jz : parseFloat(json1.dwjz),
          name : json1.name ,
          code: e.detail.value.input_c,
          jz_last: wx.getStorageSync('jz_'+e.detail.value.input_c)
        })
        let flag=wx.getStorageSync('jz_'+e.detail.value.input_c)
        if(!flag){
            wx.setStorageSync('jz_'+e.detail.value.input_c,_this.data.jz)//若库里没有储存之前净值，则储存现在净值信息
            pickerHidden:true;
            _this.setData({
              pickerHidden:true
            })
        }
        _this.setData({
          advice_value: parseInt(_this.data.inputValue*(flag/ _this.data.jz)**(e.detail.value.slider*2))
        })
        //_this.data.jz
       }
       
    })
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    wx.setStorageSync('jz_'+this.data.code,his.data.jz)
    this.setData({
      pickerHidden:false,
      more:false
    })
  },
  nmsl(){
    console.log(json1.name);
    this.setData({
      
    })
  },
  switch1Change(e){
    this.setData({
      more: e.detail.value
    })
  }
  
})