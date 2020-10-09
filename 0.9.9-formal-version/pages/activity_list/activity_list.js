// pages/search/search.js

const { floatDiv, floatAdd, floatSub } = require('../../utils/util')

const requestUrl = require('../../config').requestUrl

var getTagData = function (that) {
  wx.request({
    url: requestUrl + 'wxTagListGet.ashx',
    success: function (res) {
      that.setData({
        tagList: res.data.ChinaValue
      })
    }
  })
}

var search = function (that) {
  if (that.data.key.length > 0) {
    wx.navigateTo({
      url: '../result/result?KeyWord=' + that.data.key
    })
  }
  else {
    wx.showToast({
      title: '输入关键字',
      image: "../../images/icon-no.png",
      mask: true,
      duration: 1000
    })
  }
}

  

Page({
  data: {
    key: '',
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    money:'',
    city:'',
    project:'',
    cityArray: [
      { "ID": 1, "Name": "五险一金" }
    ],
    cityIndex: 0,
    saveMoney:'',
    totalMoney:'',
    rate:'',
    years:'',

    times:'',
    apr:'',
    eff:''


  },

  //事件处理函数
  formSearch: function () {
    search(this)
  },

  //点击标签
  bindTagTap: function (e) {
    wx.navigateTo({
      url: '../result/result?KeyWord=' + e.currentTarget.dataset.id
    })
  },

  //长按封面图 重新加载
  bindRefresh: function () {
    getTagData(this)
  },

  bindKeyInput: function (e) {
    this.setData({
      key: e.detail.value
    })
  },

  bindInputSearch: function () {
    search(this)
  },

  onLoad: function () {
    var that = this

    //调用应用实例的方法获取全局数据
    var app = getApp()
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    var that = this;
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  onShow: function () {
    var that = this
    that.setData({
      key: ''
    })
    getTagData(that)
  },


  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  salaryInput:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  //缴纳项目选择
  bindCityChange: function (e) {
    this.setData({
      cityIndex: e.detail.value
    })
  },
  cityInput:function(e){
    this.setData({
      city: e.detail.value
    })
  },
  //存款金额
  saveMoneyInput: function (e) {
    this.setData({
      saveMoney: e.detail.value
    })
  },
  //年利率
  rateInput: function (e) {
    this.setData({
      rate: e.detail.value
    })
  },
  //期限年数
  yearsInput: function (e) {
    this.setData({
      years: e.detail.value
    })
  },
  //本息和
  totalMoneyInput: function (e) {
    this.setData({
      totalMoney: e.detail.value
    })
  },
  aprInput: function (e) {
    this.setData({
      apr: e.detail.value
    })
  },
  timesInput: function (e) {
    this.setData({
      times: e.detail.value
    })
  },
  effInput: function (e) {
    this.setData({
      eff: e.detail.value
    })
  },
  //计算
  calculateBtn:function(e){
    if (this.data.currentTab==0){
      var StartNum = 3500;
      if (this.data.money == "") {
        wx.showToast({
          title: '工资不能为空',
          image: "../../images/icon-no.png",
          mask: true,
          duration: 1000
        })
        return false
      }
      if (this.data.city == "") {
        wx.showToast({
          title: '城市不能为空',
          image: "../../images/icon-no.png",
          mask: true,
          duration: 1000
        })
        return false
      }
      var Salary = this.data.money;
      var Salary = Salary - (Salary * 0.08 + Salary * 0.02 + 10 + Salary * 0.01 + Salary * 0.08);
      var cha = (Salary - StartNum);
      var output;
      if (cha > 100000) {
        output = cha * 0.45 - 15375;
      } else if (cha > 80000) {
        output = cha * 0.4 - 10375;
      } else if (cha > 60000) {
        output = cha * 0.35 - 6375;
      } else if (cha > 40000) {
        output = cha * 0.30 - 3375;
      } else if (cha > 20000) {
        output = cha * 0.25 - 1375;
      } else if (cha > 5000) {
        output = cha * 0.2 - 375;
      } else if (cha > 2000) {
        output = cha * 0.15 - 125;
      } else if (cha > 500) {
        output = cha * 0.1 - 25;
      } else if (cha > 0) {
        output = cha * 0.05;
      } else {
        output = 0;
      }
      var result = Salary - output;
      if (output > 0) {
        // wx.showToast({
        //   title: '税后' + result + '元',
        //   icon: 'success',
        //   mask: true,
        //   duration: 2000
        // })
        wx.showModal({
          title: '结余',
          content: '税后是' + result + '元',
          success: function (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
            }
          }
        })
      } else {
        wx.showToast({
          title: '您不用交税',
          icon: 'success',
          mask: true,
          duration: 1000
        })
      }  
    } if (this.data.currentTab == 1){//current tab=1指切换到理财模块
      
      var saveMoney = this.data.saveMoney;
      var rate = this.data.rate;
      var years = this.data.years;
      var totalMoney = this.data.totalMoney;
      saveMoney = parseFloat(saveMoney);
      rate = parseFloat(rate);
      years = parseFloat(years);
      totalMoney = parseFloat(totalMoney);

      var countt = 0;//非空输入的个数，即输入了多少个参数
      countt+=(!isNaN(saveMoney)+!isNaN(rate)+!isNaN(years)+!isNaN(totalMoney));
      console.log("-----");
      console.log(countt);
      console.log("-----");
      switch (countt) {
        
      
      case 4:
      wx.showModal({
        title: '计算结果',
        content: '输入参数的数目过多',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      })

      break;

      case 3:
        var situation = 0;
        if(isNaN(saveMoney)){
          situation = 1 ;
        }
        else if(isNaN(rate)){
          situation = 2 ;
        }
        else if(isNaN(years)){
          situation = 3 ;
        }
        else if(isNaN(totalMoney)){
          situation = 4 ;
        }
        switch (situation) {
          //case1,2,3,4分别指已知另外三个，求savemoney/rate/year/totalmoney的情况
          //计算逻辑没改，有问题。
          case 1:
            
          
            var all=(totalMoney/Math.pow(1+(rate/100),years)).toFixed(2);
            // wx.showToast({
            //   title: '本息共'+all+'元',
            //   icon: 'success',
            //   mask: true,
            //   duration: 2000
            // })
            wx.showModal({
              title: '计算结果',
              content: '需要的现值'+all+'元',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                }
              }
          })
            
            break;
        
          case 2://缺年利率的计算方式
          var all=( (Math.pow (floatDiv(totalMoney,saveMoney),floatDiv(1,years)) -1) *100 ).toFixed(2);
          // wx.showToast({
          //   title: '本息共'+all+'元',
          //   icon: 'success',
          //   mask: true,
          //   duration: 2000
          // })
          wx.showModal({
            title: '计算结果',
            content: '需要的年利率为：'+all+'%',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
        })
            break;
          case 3://缺年数的计算方式
          var all=( floatDiv( Math.log( floatDiv(totalMoney,saveMoney) ) , Math.log( 1+rate/100 ) ) ).toFixed(2);
          //考虑是否要取整
          all=Math.ceil(all);

          // wx.showToast({
          //   title: '本息共'+all+'元',
          //   icon: 'success',
          //   mask: true,
          //   duration: 2000
          // })
          wx.showModal({
            title: '计算结果',
            content: '需要的存款的周期为：'+all+'年',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
        }) 
            break;
          case 4:
            var all=(saveMoney*Math.pow(1+(rate/100),years)).toFixed(2);
            // wx.showToast({
            //   title: '本息共'+all+'元',
            //   icon: 'success',
            //   mask: true,
            //   duration: 2000
            // })
            wx.showModal({
              title: '计算结果',
              content: '终值为：'+all+'元',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                }
              }
          })
            
            break;
          default:
            break;
        }

        break;
      
      
        default:
          wx.showModal({
            title: '计算结果',
            content: '输入参数的数目不足',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })

          break;
      }
      

    }
    if (this.data.currentTab==2){
      var apr = this.data.apr;
      var times = this.data.times;
      var eff = this.data.eff;
      
      apr = parseFloat(apr);
      times = parseFloat(times);
      eff = parseFloat(eff);

      var countt = 0;//非空输入的个数，即输入了多少个参数
      countt+=(!isNaN(apr)+!isNaN(times)+!isNaN(eff));

      switch (countt) {
        case 3:
          wx.showModal({
            title: '计算结果',
            content: '输入的参数过多',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
        })
          
          break;

        case 2:
          var situation = 0;//1，2，3：缺apr,times,eff.
          if(isNaN(apr)){
            situation=1;
          }else if(isNaN(times)){
            situation=2;
          }else if(isNaN(eff)){
            situation=3;
          }

          switch (situation) {
            case 1:
              var rrr = 0;
              rrr = ((Math.pow( eff/100 + 1,1/times )-1)*times *100).toFixed(4);

              wx.showModal({
                title: '计算结果',
                content: '年百分比表示的利率为'+rrr+'%',
                success: function (res) {
                  if (res.confirm) {
                    // console.log('用户点击确定')
                  }
                }
            })
            break;
            case 2:
              //不好算
              //暂定无法计算？
              

              wx.showModal({
                title: '计算结果',
                content: '暂不支持此计算',
                success: function (res) {
                  if (res.confirm) {
                    // console.log('用户点击确定')
                  }
                }
            })
            break;
            case 3:
              var rrr = 0;
              rrr = (( Math.pow((1+apr/100/times), times )-1 )*100).toFixed(4)  ;

              wx.showModal({
                title: '计算结果',
                content: '有效年利率为'+rrr+'%',
                success: function (res) {
                  if (res.confirm) {
                    // console.log('用户点击确定')
                  }
                }
            })
              
              break;
          
            default:
              break;
          }

          
          
          break;

        default:
          wx.showModal({
            title: '计算结果',
            content: '输入的参数不足',
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
        })
          break;
      }

    }
  }
})