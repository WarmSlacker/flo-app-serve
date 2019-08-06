const express=require("express");
const router=express.Router();
const pool=require('../pool.js');


router.get('/appindex',(req,res)=>{
    var sql="SELECT * FROM flower";
    pool.query(sql,(err,result)=>{
      if (err) throw err;
      res.send(result);
    })
  
  })
module.exports=router;