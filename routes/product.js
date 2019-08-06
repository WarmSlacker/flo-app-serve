const express=require("express");
const router=express.Router();
const pool=require('../pool.js');

// 商品的分页显示
router.get('/product',(req,res)=>{
  //1. 参数
  var pno=req.query.pno;
  var ps=req.query.ps;
  // 2.设置默认值
  if(!pno){pno=1};
  if(!ps){ps=16};
  var sname=req.query.sname
  if(!sname){
  // 3.创建两条SQL语句执行
  var sql="SELECT sid,fid,title,price,pic FROM flower LIMIT ?,?";
  var offset=(pno-1)*ps;
  ps=parseInt(ps);
  // 4.返回值{code:1,msg:"查询成功",data:[],pageCount:}
  pool.query(sql,[offset,ps],(err,result)=>{
    if(err) throw err;
    var product={code:1,msg:"查询成功",data:result}
    product.data=result;

    var sql="SELECT count(*) AS c FROM flower"
    pool.query(sql,(err,result)=>{
      if(err) throw err;
      var pages=result[0].c;
        var pc=Math.ceil(result[0].c/ps);
        product.pages=pages;
        product.pc=pc;
        res.send(product);
    })
  })
}else{
  var sql='select sid from flower_sort sname like "%?%"';
  pool.query(sql,[sname],(err,result)=>{
    if(err) throw err
    var sid=result.sid
    var sql="select fid,title,price,pic FROM flower where sid=? LIMIT ?,?"
    var offset=(pno-1)*ps;
    ps=parseInt(ps);
    // 4.返回值{code:1,msg:"查询成功",data:[],pageCount:}
    pool.query(sql,[offset,ps,sid],(err,result)=>{
      if(err) throw err;
      var product={code:1,msg:"查询成功",data:result}
      product.data=result;
  // console.log(result)
      var sql="SELECT count(*) AS c FROM flower"
      pool.query(sql,(err,result)=>{
        if(err) throw err;
        var pages=result[0].c;
          var pc=Math.ceil(result[0].c/ps);
          product.pages=pages;
          product.pc=pc;
          res.send(product);
      })
    })
  })
}
})

//
router.get('/flist',(req,res)=>{
  var sid=req.query.sid;
  var pno=req.query.pno;
  var ps=req.query.ps;
  // 2.设置默认值
  if(!pno){pno=1};
  if(!ps){ps=16};
  var sql="SELECT fid,title,price,pic FROM flower WHERE sid=? LIMIT ?,?"
  var offset=(pno-1)*ps;
  ps=parseInt(ps);
  pool.query(sql,[sid,offset,ps],(err,result)=>{
    if(err) throw err;
    var product={code:1,msg:"查询成功",data:result}
    product.data=result;
    var sql="SELECT count(*) AS c FROM flower WHERE sid=? "
    pool.query(sql,[sid],(err,result)=>{
      if(err) throw err;
      var pages=result[0].c;
        var pc=Math.ceil(result[0].c/ps); 
        // console.log(pc);
        product.pages=pages;
        product.pc=pc;
        // console.log(pc);
        res.send(product);
      })  
  })
})

//详情页
router.get('/details',(req,res)=>{
  var fid=req.query.fid;
  var output={
    product:{},
    pics:[]
  }
  if(fid!==undefined){
  var sql="SELECT numeration,price,title,material,pack,flower_language,details FROM flower WHERE fid=?" 
  pool.query(sql,[fid],(err,result)=>{
    if(err) throw err;
    // console.log(result);
    output.product=result
    var sql="SELECT img,lg FROM flower_pic WHERE fid=?"
    pool.query(sql,[fid],(err,result)=>{
      if(err) throw err;
      // console.log(result)
      output.pics=result;
      res.send(output);
    })
  })
}
})


module.exports=router;