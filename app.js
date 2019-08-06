//1:引入第三方模块
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser=require('body-parser');
//首页路由器
const indexRouter=require('./routes/index');
//用户路由器
const userRouter=require('./routes/user');
//商品路由器cartRouter
const productRouter=require('./routes/product');
//购物车
const cartRouter=require('./routes/cart');  
const find=require('./routes/find');
 //2.2:跨域
 var server = express();
 server.use(cors({
   origin:["http://127.0.0.1:8080",
   "http://localhost:8080"],
   credentials:true
 }))

 //2.3:session
 server.use(session({
   secret:"128位字符串",
   resave:true,
   saveUninitialized:true
 }))
// 指定静态目录
server.use(express.static("public"))
// server.use(express.static("routes"))

server.use( bodyParser.urlencoded({
  extended:false
}) );

 server.listen(3002);
// 路由器挂载
server.use('/index',indexRouter);
server.use('/user',userRouter);
server.use('/product',productRouter);
server.use('/cart',cartRouter);
server.use('/find',find);