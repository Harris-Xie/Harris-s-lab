//index.js
var app = getApp()
var util = require('../../utils/util.js'); 
var calc = require('../../utils/calc.js'); 
var core = require('../../utils/core.js'); 
Page({
  data: {
    layout:[
    [{
	    opt:"bindViewTapOpt",
    	type:"warn",
	    id:"of",
      value:"开/关",
      ii:1,
    },
    {
	    opt:"bindViewTapOpt",
	    type:"warn",
	    id:"s",
      value:"高级",
      ii:1,
    },
    {
	    opt:"bindViewTapOpt",
	    type:"warn",
	    id:"c",
      value:"C",
      ii:1,
    },
    {
	    opt:"bindViewTapOpt",
	    type:"warn",
	    id:"ac",
      value:"AC",
      ii:1,
    }],
    [{
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"7",
    	value:"7",
    },
    {
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"8",
    	value:"8",
    },
    {
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"9",
    	value:"9",
    },
    {
    	opt:"bindViewTapOpt",
    	type:"primary",
    	id:"÷",
      value:"÷",
      ii:1,
    }],
    [{
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"4",
	    value:"4",
    },
    {
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"5",
	    value:"5",
    },
    {
	    opt:"bindViewTapInput",
    	type:"default",
    	id:"6",
    	value:"6",
    },
    {
    	opt:"bindViewTapOpt",
    	type:"primary",
    	id:"×",
      value:"×",
      ii:1,
    }],
    [{
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"1",
    	value:"1",
    },
    {
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"2",
    	value:"2",
    },
    {
    	opt:"bindViewTapInput",
    	type:"default",
    	id:"3",
    	value:"3",
    },
    {
    	opt:"bindViewTapOpt",
    	type:"primary",
    	id:"-",
      value:"-",
      ii:1,
    }],
    [{
	    opt:"bindViewTapInput",
	    type:"default",
	    id:"0",
	    value:"0",
    },
    {
	    opt:"bindViewTapInput",
	    type:"default",
	    id:".",
      value:".",
      ii:1,
    },
    {
	    opt:"bindViewTapOpt",
	    type:"warn",
	    id:"=",
      value:"=",
      ii:2,
    },
    {
	    opt:"bindViewTapOpt",
	    type:"primary",
	    id:"+",    
      value:"+",
      ii:1,
    }]],
    lines: [
      "",
      "",
      "",
      "",
      ""
    ],
    power:1,
    line:"------------------------------------------------",
    infix:""
  },
  onLoad: function () {
    //core.showToast();
    //core.showModal();
    //core.showActionSheet();
    this.clear();
    wx.setNavigationBarTitle({
      title: '通用计算器'
    })
  },
  onReady: function() {
    wx.showNavigationBarLoading();
    wx.hideNavigationBarLoading();
    
  },
  onShow: function() {
    // Do something when page ready.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  clear:function(){
    this.output([""]);
  },
  clearAll:function(){
    this.output(["","","","",""],true);
    this.setData({
      infix: "",
    });
  },
  calculator:function(){
    var infix = this.data.infix; 
    var res = calc.calculate(infix);
    this.makeInfix("",true);
    return res;
  },
  bindViewTapInput:function (e){
    var content = e.currentTarget.id;
    this.getNumber(content);
  },
  bindViewTapOpt:function (e){
    var content = e.currentTarget.id;
    //console.log(content);
    switch(content){
      case 'c':
          this.clear();
          break;
      case 's':
          wx.navigateTo({
             url: '/pages/super/index?id=1'
          })
          break;
      case 'of':
          this.setData({
            power:0-this.data.power
          });
          this.clearAll();
          break;
      case 'ac':
          this.clearAll();
          break;
      case '=':
          this.makeInfix();
          var res = this.calculator();
          this.output([this.data.line,res],true);
          break;
      default:
          this.makeInfix(content);
          this.output([this.data.lines[(this.data.lines.length-1)]+content],false);
          break;
    }
  },
  makeInfix:function(content,flash){
    //生成中缀表达式
    console.log("makeInfix");
    content = content ? content : ""; 
    //var oldInfix = this.data.infix.toString();
    var oldInfix = "";
    var lastNum = this.data.lines[(this.data.lines.length-1)].toString();
    if(oldInfix == "0"){
      oldInfix = "";
    }
    if(!flash){
        content = oldInfix+lastNum+content;
    }
    console.log(content);
    this.setData({
      infix:content
    }); 
  },
  getNumber:function(content){
    var lines = this.data.lines;
    var move = false;
    var old =  lines[(lines.length-1)].toString(); 
    var newNum;
    if((content=="." && old.indexOf(".")!=-1&&!isNaN(old.slice(old.indexOf(".")+1)))||old[old.length-1]=="."&&content=="."){
    //当原字符串有小数点时再输入小数点无反应
        return false;
    }
    if(content=="0" && old=="0"){
    //当原字符串等于0再输入0无反应
        return false;
    }
    if(isNaN(old) && old != "0."){
    //当原字符串是非数字即操作符(+-×÷)时新字符串另起一行为新数字
    //需要排除 0.  这个不是字符,但是需要继续拼接
      if(content=="."&&isNaN(old[old.length-1])){
        content = "0.";
      }
      newNum = content;
      newNum = old+newNum;
      //另起一行的标志
      move = false;
    }else{
      if(old == "0" && content != "."){
        //当原字符串是0的时候又不是小数,需要把0去掉
        old = "";
      }
      newNum = old+content;
    }
    this.output([newNum],false);
  },
  output:function(content,move){
    console.log("content of output");
    console.log(content);
    var lines = this.data.lines;
    if(move){
      for(var index in content){
        lines.shift();
        lines.push(content[index]);
      }
    }else{
      lines[(lines.length-1)] =  content[0];
    }
    
    if(this.data.power <= 0){
        lines = ["","","","",""];
    }
    this.setData({
        lines:lines
    });
    console.log(this.data);
  }
})
