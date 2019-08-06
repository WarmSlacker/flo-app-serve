const express=require("express");
const router=express.Router();
const pool=require('../pool.js');
// 用户注册
//用户检索
router.post("/check",(req,res)=>{
    var uname=req.body.uname;
    //  console.log(req.body.uname);
    
    var sql="select * from flower_user where uname=?";
    pool.query(sql,[uname],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.length>0){
            res.send({code:1,msg:"用户已注册"});
        }else{
            res.send({code:-1,msg:"用户未注册"});
        }
    });
});


//用户注册
router.post("/reg",(req,res)=>{
    var uname=req.body.uname;
   var upwd=req.body.upwd;
    //  console.log(uname,upwd);
    var sql="insert into flower_user set uname=?,upwd=?";
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.affectedRows>0){
            res.send({code:1,msg:"注册成功"});
        }else{
            res.send({code:-1,msg:"注册失败"});
        }

    });
});
// 用户登录


router.post("/login",(req,res)=>{
    //1:参数
    // console.log(1111111)
    var uname = req.body.uname;
    var upwd = req.body.upwd;
  // console.log(uname,upwd)
    //1.1:正则表达式验证用户名或密码
    //2:sql
  var sql = "SELECT uid FROM ";
  sql +=" flower_user WHERE uname = ?";
  sql +=" AND upwd = md5(?)";
    //3:json
    pool.query(sql,[uname,upwd],(err,result)=>{
      // console.log(result)
        if(err)throw err;
        if(result.length==0){
           res.send({code:-1,msg:"用户名或密码有误"});
        }else{
           //??缺少一步   将当前登录的用户UID保存到session
           //result=[{id:1}]
           req.session.uid=result[0].uid;
           res.send({code:1,msg:"登录成功"});
           console.log(req.session.uid);
        }
    })
  })



module.exports=router;