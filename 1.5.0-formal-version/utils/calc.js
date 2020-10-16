var Stack = function(){}
Stack.prototype={
    Init:function(){
        this.STACKMAX = 100;
        this.stack = new Array(this.STACKMACK);
        this.top = -1;
        return this.stack;
    },
    isEmpty:function(){
        if(this.top==-1){
            return true;
        }
        else{
            return false;
        }
    },
    push:function(elem){
        if(this.top==this.STACKMAX-1){
            return "栈满";
        }
        else{
            this.top++;
            this.stack[this.top] = elem;
        }
    },
    pop:function(){
        if(this.top==-1){
            return "空栈,无法删除栈顶元素！";
        }
        else{
            var x = this.stack[this.top];
            this.top--;
            return x;
        }
    },
    peek:function(){
        if(this.top!=-1){
            return this.stack[this.top];
        }
        else{
            return "空栈，顶元素无返回值！";
        }
    },
    Clear:function(){
        this.top=-1;
    },
    Length:function(){
        return this.top+1;
    }
}

//转后缀表达式
function toRPolish(s){
	var list=new Array();
	var op=new Stack();
	op.Init();
	//var num=str.match(/\d+(\.\d+)?/g);
	var i=0;
	while(i<s.length){
        //按i提取中缀表达式的元素
        var c=s.charAt(i);
        //console.log("---");
        //console.log(c);
        //console.log("---");

		if(c>='0'&&c<='9'){
			var s1=s.substr(i);
			var m=s1.match(/\d+(\.\d+)?/g);
			if (m.length>0){
				s1=m[0];
				list.push(s1);
			}
			i=i+s1.length;
            continue;
        //括号的处理
		}else if(c=='('){
			op.push(c);
		}else if(c==')'){
            
			var p=op.pop();
			while(p!='('){
				list.push(p);
                p=op.pop();
                console.log("peek");
                console.log(op.peek());
            }
            
        //加减乘除乘方，运算优先级
		}else if(c=='+'||c=='-'){
			while(!op.isEmpty()&&(op.peek()=='+'||op.peek()=='-'||op.peek()=='×'||op.peek()=='÷'||op.peek()=='^')){
				list.push(op.pop());
			}
            op.push(c);
            
		}else if(c=='×'||c=='÷'){
			while(!op.isEmpty()&&(op.peek()=='×'||op.peek()=='÷'||op.peek()=='^')){
				list.push(op.pop());
			}
			op.push(c);
        }
        else if(c=='^'){
            while (!op.isEmpty()&&op.peek()=='^') {
                list.push(op.pop());
            }
            op.push(c);
        }

        //判断是否是sin,cos,tan,lg,ln,sqrt这类放在最后的一元运算符
        //直接给出运算结果
        else if(c=='s'||c=='c'||c=='t'||c=='l'||c=='√'){
            while(!op.isEmpty()){
                list.push(op.pop());
            }
            if(c!='√'){
                c=c+s.charAt(i+1);
            }
            
            var result=new Stack();
            result.Init();
            //console.log("list:")
            //console.log(list)
            //console.log("???")
            //console.log("getresult:")
            //console.log(getResult(list, result))
            //console.log("???")

            //num代表之前所有表达式的运算结果
            var num;
            switch(c){
            case 'si':
                num = Math.sin(getResult(list, result));
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            case 'co':
                num = Math.cos(getResult(list, result));
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            case 'ta':
                num = Math.tan(getResult(list, result));
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            case 'co':
                num = Math.cos(getResult(list, result));
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            case 'ln':
                num = Math.log(getResult(list, result));
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            case 'lg':
                num = Math.log10(getResult(list, result));
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            case '√':
                var temp=getResult(list, result);
                if(temp<0){
                    num=null;
                }
                else{
                num=Math.sqrt(temp);
                }
                //console.log("num:")
                //console.log(num)
                //console.log("???")
                break;
            default:
                break;
                  
            }
            //考虑显示问题，如果数字过长，考虑减少有效数字位数，考虑到科学计数法的可能性，只保留8位有效数字。
            var ssss=""+num;
            if(ssss.length>=13){
                num=num.toPrecision(8);
            }
            list=[];
            list.push(""+num);
            break;
        }
        else if(c=='e'||c=='π'){
            //若单独输入e或pi则直接给出他们的值
            if (list.length==1&&list[0]=='0'){
                if(c=='e'){
                list=[];
                list.push(""+2.718281828459)
                }
                else{
                    list.push(""+3.1415926535898)
                }
            }
            //有其他项则视为输入了'x'和e
            else{
                while(!op.isEmpty()&&(op.peek()=='×'||op.peek()=='÷')){
                    list.push(op.pop());
                }
                op.push('×');
                if(c=='e'){
                    list.push(""+2.718281828459)
                    }
                    else{
                        list.push(""+3.1415926535898)
                    }
            }
        }
        else if(c=='!'){
            //当阶乘之前是右括号时，计算完之前的结果后，再作阶乘
            //括号嵌套会有问题！！！
            if (s.charAt(i-1)==')'){
                while(!op.isEmpty()){
                    list.push(op.pop());
                }
                var result=new Stack();
                result.Init();
                num = getResult(list, result);
                var flag=(num%1===0);
                if(flag){
                    var fff=1;
                    while(num>0){
                        fff*=num;
                        num=num-1;
                    }
                   list.push(""+fff)
                }
                else {
                   list.push(null)
                }
            }
            //否则对！前的那个数作阶乘
            else{
            var max=0;
            var u;
            for (u=0;u<list.length;u++){
                if(u>max&&!isNaN(list[u])){
                    max=u;
                }
            }
            console.log("max:");
            console.log(list[1]);
            console.log(list[max]);
            var nnn = Number(list[max]); 
              if(nnn%1===0){
                var fff=1;
                while(nnn>0){
                    fff*=nnn;
                    nnn=nnn-1;
                }
                 list[max]=""+fff;
              }
              else{
                  list[max]=null;
              }
            }
        }
        
        
        /*console.log("list:")
        console.log(list)
        console.log("???")
        console.log("=======")
        console.log(i);
        console.log(list);
        console.log("=======")*/
		i++;
	}
	while(!op.isEmpty()){
		list.push(op.pop());
	}
	return list;
}

//二元运算符计算
function g(a,b,c){
	var v=0;
	a=parseFloat(a);
	b=parseFloat(b);
	switch (c){
        case '+':
            v=floatAdd(a,b);
            break;
        case '-':
            v=floatSub(a,b);;
            break;
        case '×':
            v=floatMul(a,b);;
            break;
        case '÷':
            v=floatDiv(a,b);;
            break;
        case '^':
            v=Math.pow(a,b);;
            break;
    }
    return v;
}

function getResult(list,result){

	for (var i=0;i<list.length;i++){

        if(list[i]=="null"){
            console.log(i);
            console.log(list[i]);
            return null;
        }
		if(!isNaN(list[i])){
			result.push(list[i]);
		}else{
			var b=result.pop();
			var a=result.pop();
			var v=g(a,b,list[i]);

			result.push(v);
		}
    }
    var num=result.pop();
    var ssss=""+num;
    num=parseFloat(num);
            if(ssss.length>=13){
                num=num.toPrecision(8);
            }
	return num;
}

function calculate(input){
    console.log(input);
    var list=toRPolish(input);
    console.log(list);
    var result=new Stack();
    result.Init();
    console.log("list");
    console.log(list)
    return getResult(list, result);

}
 

//浮点数加法运算
function floatAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}

//浮点数减法运算
function floatSub(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    //动态控制精度长度
    n=(r1=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
}

//浮点数乘法运算
function floatMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}


 //浮点数除法运算
function floatDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    r1=Number(arg1.toString().replace(".",""));
    r2=Number(arg2.toString().replace(".",""));
    return (r1/r2)*Math.pow(10,t2-t1);
}
 
module.exports = {
  calculate:calculate
}
