const express = require("express");
const router = express.Router();
const session = require("express-session");
const pool = require('../pool.js');
//加入购物车
router.get("/add", (req, res) => {
        var fid = req.query.fid;
        var sql = "SELECT pic,price,title FROM flower where fid=?"
        pool.query(sql, [fid], (err, result) => {
            if (err) throw err;
        })
    })
    // 购物车
router.get("/cart", (req, res) => {
        var uid = req.session.uid;
        // console.log(req.session.uid);
        // if(!uid){
        //   res.send({code:-1,msg:"请登录"});
        //   return;
        // }
        //var uid = req.query.uid;
        var sql = "SELECT cid,img_url,price,count,title,fid FROM flower_cart WHERE uid=?"
        pool.query(sql, [uid], (err, result) => {
            if (err) throw err;
            res.send({ code: 1, data: result })
        })
    })
    // 删除购物车商品
router.get("/delItem", (req, res) => {
        // 参数购物车id
        // var cid=req.session.cid;
        var cid = req.query.cid;
        // console.log(cid);
        var sql = "DELETE FROM flower_cart WHERE cid=?";
        pool.query(sql, [cid], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send({ code: 1, msg: "删除成功" })
            } else {
                res.send({ code: -1, msg: "删除失败" })
            }

        })
    })
    // 删除多个商品
router.get("/delAll", (req, res) => {
        var cids = req.query.cids;
        var sql = `DELETE FROM flower_cart WHERE cid IN (${cids})`;
        pool.query(sql, (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send({ code: 1, msg: "删除成功" })
            }
        })
    })
    //添加购物车
router.get("/adds", (req, res) => {
    //用户登录 console.log(req.session.uid);
    var obj = req.query;
    var fid = req.query.fid;
    var sql = `insert into flower_cart values (?,?,?,?,?,?,?) `;
    var uid = req.session.uid;
    // console.log(req.session.uid);

    pool.query('select count from flower_cart where  fid=? and uid=?', [fid, uid], (err, result) => {
        if (err) throw err;

        if (result.length >= 1) {
            var count = result[0].count;
            count++;
            pool.query('update flower_cart set count=?  where fid=? and uid=?', [count, fid, uid], (err, result) => {
                if (err) throw err;
                if (result.affectedRows >= 1) {
                    res.send({ code: 1 });
                } else {
                    res.send({ code: 0 });
                }
            })
        } else {
            pool.query(sql, [null, uid, obj.fid, obj.title, 1, obj.price, obj.img_url], (err, result) => {
                if (err) throw err;
                if (result.affectedRows >= 1) {
                    res.send({ code: 1 });
                } else {
                    res.send({ code: 0 });
                }
            })
        }
    })
})



// 购物车更新商品
router.get("/upda", (req, res) => {
    var fid = req.query.fid;
    var uid = req.session.uid;
    var count = req.query.count;
    pool.query('update flower_cart set count=?  where fid=? and uid=?', [count, fid, uid], (err, result) => {
            if (err) throw err;

        })
        // for (var i = 0; i < req.query.data.length; i++) {
        //     // var uid = req.query.data[i].uid;
        //     var fid = req.query.data[i].fid;
        //     var count = req.query.data[i].count;
        //     pool.query('update flower_cart set count=?  where fid=? and uid=?', [count, fid, 1], (err, result) => {
        //         if (err) throw err;

    //     })
    // }

})
module.exports = router;