const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.get('/',(req,res)=>{
  var pno=req.query.pno;
  var ps=req.query.ps;
  // 2.设置默认值
  if(!pno){pno=1};
  if(!ps){ps=8};
	var search1=decodeURI(req.query.name);
	// search1=search1.split("");
	search1 = search1.replace(/\"/g, "");
	search1 = search1.replace(/'/g, "");
// console.log(search1);
	if(!search1){
		res.send('请至少输入一个商品关键字');
		return;  
	}else{
//开始
    var sql0=`select sid,fid,title,price,pic from flower WHERE  material LIKE ? LIMIT ?,? `;
    var offset=(pno-1)*ps;
        ps=parseInt(ps);
    pool.query(sql0,[`%${search1}%`,offset,ps],(err,result)=>{
      if (err) throw err
      // console.log(result)
      if(result.length>0){
      var product={code:1,msg:"查询成功",data:result}
      product.data=result;

      // output.list=result;
      var sql="SELECT count(*) AS c FROM flower WHERE material LIKE ?"
      pool.query(sql,[`%${search1}%`],(err,result)=>{  
        if(err) throw err;
        var pages=result[0].c;
          var pc=Math.ceil(result[0].c/ps);
          product.pages=pages;
          product.pc=pc;
          res.send(product);
          // console.log(result)
    
      })
    }else{
      res.send({code:-1,msg:'查询失败'})
    }
     
  })
} 
})

module.exports = router;
