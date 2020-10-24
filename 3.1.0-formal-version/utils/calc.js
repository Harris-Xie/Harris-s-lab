//ver 3.0
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
            var count=0;
			while(p!='('){
				list.push(p);
                p=op.pop();
                console.log("peek");
                console.log(op.peek());
                count+=1;
                if(count>=100){
                    //希望能输出错误信息：“未输入右括号”
                    break;
                }
            }
            
        //加减乘除乘方，运算优先级
		}else if(c=='+'||c=='-'){
            while(!op.isEmpty()&&(op.peek()=='+'||op.peek()=='-'||op.peek()=='×'||op.peek()=='÷'||op.peek()=='^'
            ||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!'||op.peek()=='√')){
				list.push(op.pop());
            }
            if(c=='-'&&isNaN(s[i-1])){
                list.push('0');
            }
            op.push(c);
            
		}else if(c=='×'||c=='÷'){
            while(!op.isEmpty()&&(op.peek()=='×'||op.peek()=='÷'||op.peek()=='^'
            ||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!'||op.peek()=='√')){
				list.push(op.pop());
			}
			op.push(c);
        }
        else if(c=='^'){
            while (!op.isEmpty()&&(op.peek()=='^'||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!'||op.peek()=='√')) {
                list.push(op.pop());
            }
            op.push(c);
        }

        //判断是否是sin,cos,tan,lg,ln,sqrt这类放在最后的一元运算符
        //直接给出运算结果

        //根号先不管
        else if(c=='√'){
            while(!op.isEmpty()&&(op.peek()=='^'||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!'||op.peek()=='√')) {
                list.push(op.pop());
            }
            op.push(c);
            
            
           
            //考虑显示问题，如果数字过长，考虑减少有效数字位数，考虑到科学计数法的可能性，只保留8位有效数字。
            
        }
        //sin cos tan lg ln
        else if(c=='s'||c=='c'||c=='t'||c=='l'){
            if (!isNaN(s[i-1])){
                while(!op.isEmpty()&&(op.peek()=='×'||op.peek()=='÷'||op.peek()=='^'
                ||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!'||op.peek()=='√')){
                    list.push(op.pop());
                }
                op.push('×');
            }
            while (!op.isEmpty()&&(op.peek()=='^'||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!')) {
                list.push(op.pop());
            }
            c=c+s.charAt(i+1);
            i=i+1;
            if (c=='ln'||c=='lg'){
                op.push(c);
            }
            else{
            c=c+s.charAt(i+1);
            i=i+1;
            op.push(c);
            }


        }
        else if(c=='e'||c=='π'){
            //若单独输入e或pi则直接给出他们的值
            if (isNaN(s[i-1])&&s[i-1]!='e'&&s[i-1]!='π'){
                if(c=='e'){
                
                list.push(""+Math.E)
                }
                else{
                    list.push(""+Math.PI)
                }
            }
            //有其他数字则视为输入了'x'和e
            else{
                while(!op.isEmpty()&&(op.peek()=='×'||op.peek()=='÷'||op.peek()=='^'
                ||op.peek()=='sin'||op.peek()=='cos'||op.peek()=='tan'||op.peek()=='lg'||op.peek()=='ln'||op.peek()=='!'||op.peek()=='√')){
                    list.push(op.pop());
                }
                op.push('×');
                if(c=='e'){
                    list.push(""+Math.E)
                    }
                    else{
                        list.push(""+Math.PI)
                    }
            }
        }
        else if(c=='!'){
            while (!op.isEmpty()&&(op.peek()=='!')){
                list.push(op.pop());
            }
            op.push(c);
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

//一元运算符计算
function f(a,c){
    var v=0;
    a=parseFloat(a);
    console.log("a:");
    console.log(a);
    switch (c) {
        case 'sin':
            v=Math.sin(a);
            break;
        case 'cos':
            v=Math.cos(a);
            break;
        case 'tan':
            console.log("let's do some tangent!");
            v=floatDiv(Math.sin(a),Math.cos(a));
            console.log(v);
            break;
        case 'ln':
            v=Math.log(a);
            break;
        case 'lg':
            v=Math.log10(a);
            break;
        //阶乘
        case '!':
            if(a%1==0&&a>=0){
                if(a==0){
                    v=1;
                }
                else{
                    v=1;
                    while(a>=1){
                        v=v*a;
                        a=a-1;
                    }
                }
            }
            else{
                v=null;
            }
            break;
        
        case '√':
            v=Math.pow(a,0.5);
            break;
        default:
            break;
    }
    //console.log("what is your tangent?");
    //console.log(Math.tan(Math.PI));

    //console.log("一元运算结果:");
    //console.log(v);
    if(Math.abs(v)<=Math.pow(10,-12)){
        v=0;
    }
    if(Math.abs(v)>=Math.pow(10,12)){
        v="Infinity";
    }
    if(Math.abs(v-1)<=Math.pow(10,-12)){
        v=1;
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
        }else if(list[i]=='+'||list[i]=='-'||list[i]=='×'
        ||list[i]=='÷'||list[i]=='^'){
            var b=result.pop();
            if(list[i]=='-'&&result.isEmpty()){
                var a = 0;
            }
            else{
                var a=result.pop();
            }
			
			var v=g(a,b,list[i]);

			result.push(v);
        }
        else if(list[i]=='sin'||list[i]=='cos'||list[i]=='tan'
        ||list[i]=='lg'||list[i]=='ln'||list[i]=='!'||list[i]=='√'){
            var a=result.pop();
            var v=f(a,list[i]);

            result.push(v);
        }
    }
    var num=result.pop();
    var ssss=""+num;
    num=parseFloat(num);
            /*if(ssss.length>=13){
                num=num.toPrecision(8);
            }*/
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
    n=(r1>r2)?r1:r2;
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
