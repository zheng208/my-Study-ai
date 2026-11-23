//用栈实现队列
const MyQueue=function(){
    this.stack1=[]
    this.stack2=[]
}
//入队
MyQueue.prototype.push=function(x){
    this.stack1.push(x)
}
//出队
MyQueue.prototype.pop=function(){
    if(this.stack2.length>0){
        return this.stack2.pop()
    }
    while(this.stack1.length>0){
        this.stack2.push(this.stack1.pop())
    }
    return this.stack2.pop()
}
MyQueue.prototype.peek=function(){
    if(this.stack2.length>0){
        let item=this.stack2[this.stack2.length-1]
        return item
    }
    while(this.stack1.length>0){
        this.stack2.push(this.stack1.pop())
    }
    return this.stack2[this.stack2.length-1]
}
MyQueue.prototype.empty=function(){
    return this.stack1.length===0&&this.stack2.length===0
}

const queue=new MyQueue()//得到一个队列
queue.push(1)//入队
queue.push(2)//入队
queue.push(3)//入队
queue.pop()//出队
console.log(queue.pop())
