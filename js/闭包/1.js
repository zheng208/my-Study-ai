var arr=[]
for(var i=1;i<=5;i++){
    arr.push(function(){
        console.log(i);
    })
}
//执行
for(var j=0;j<arr.length;j++){
    arr[j]()
}
