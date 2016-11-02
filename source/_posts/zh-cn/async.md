---
title: async
excerpt: async
categories: 
- FE
---



# 事件发布/订阅
```
//  订阅
 emitter.on("event1",  function  (message) {
   console.log(message);  
 });
 //  发布
 emitter.emit('event1',  "I  am  message!");
```
使用哨兵
```
var  after =  function  (times,  callback) {
   var  count =  0,  results =  {};
   return  function  (key,  value) {
     results[key] =  value;
     count++;
     if  (count  ===  times) {
       callback(results);
    }
   };
 };
　
 var  done =  after(times,  render);
```

# Promise/Deferred
Promise状态转换，通过then来进行顺序管理
```
var  Promise =  function  () {
   EventEmitter.call(this);
 };
 util.inherits(Promise,  EventEmitter);
Promise.prototype.then =  function  (fulfilledHandler,  errorHandler,  progressHandler) {
   if  (typeof  fulfilledHandler  ===  'function') {
     //  利用once()方法，保证成功回调只执行一次
     this.once('success',  fulfilledHandler);
  }
   if  (typeof  errorHandler  ===  'function') {
     //  利用once()方法，保证异常回调只执行一次
     this.once('error',  errorHandler);
  }
   if  (typeof  progressHandler  ===  'function') {
     this.on('progress',  progressHandler);
  }
   return  this;
 };
```
不变的部分是Deffred
```
var  promise1 =  readFile("foo.txt",  "utf-8");
 var  promise2 =  readFile("bar.txt",  "utf-8");
 var  deferred =  new  Deferred();
 deferred.all([promise1,  promise2]).then(function  (results) {
   //  TODO
 },  function  (err) {
   //  TODO
 });
```

# 流程控制库


## async
* 串行执行
```
async.series([
   function  (callback) {
     fs.readFile('file1.txt',  'utf-8',  callback);
   },
   function  (callback) {
     fs.readFile('file2.txt',  'utf-8',  callback);
  }
 ],  function  (err,  results) {
   //  results  =>  [file1.txt,  file2.txt]
 });
```
* 并行执行
```
async.parallel([
   function  (callback) {
     fs.readFile('file1.txt',  'utf-8',  callback);
   },
   function  (callback) {
     fs.readFile('file2.txt',  'utf-8',  callback);
  }
 ],  function  (err,  results) {
   //  results  =>  [file1.txt,  file2.txt]
 });
```
* 依赖处理
```
async.waterfall([
   function  (callback) {
     fs.readFile('file1.txt',  'utf-8',  function  (err,  content) {
       callback(err,  content);
     });
   },
   function  (arg1,  callback) {
     //  arg1  =>  file2.txt
    fs.readFile(arg1,  'utf-8',  function  (err,  content) {
       callback(err,  content);
     });
   },
   function(arg1,  callback){
     //  arg1  =>  file3.txt
     fs.readFile(arg1,  'utf-8',  function  (err,  content) {
       callback(err,  content);
     });
  }
 ],  function  (err,  result) {
    //  result  =>  file4.txt
 });
```
