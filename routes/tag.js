var mysql = require('mysql');
var express = require('express');
var app = express();

var router = express.Router();


var connection = mysql.createConnection(
    {
        host     : 'localhost',
        user     : 'root',
        password : 'jiba123xie',
        database : 'oningo',
    }
);
router.get('/',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;

    if (!isLogined)
        res.redirect('/');
    var jsonstr="[]";
    var jsonarray = eval('('+jsonstr+')');

    var queryString = "Select * from Tag";
    connection.query(queryString, function (err, rows) {
        if (err) res.json({code:-1});

        for (var i = 0; i < rows.length;i++){
            var arr ={
                "val" :rows[i].tid,
                "text":rows[i].tagname
            }

            jsonarray.push(arr);

        }
        res.json(jsonarray);

    });




});
router.post('/',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;

    if (!isLogined)
        res.redirect('/');
    var nid =req.body.nid;

    var queryString = "Select tagname from Tag natural join HasTag where nid = ?";
    connection.query(queryString,[nid], function (err, rows) {
        if (err) res.json({code:-1});
        var data= {};
        var result = "";
        for (var i = 0; i < rows.length;i++){
            result+= "#"+rows[i].tagname;

        }
        data.tags = result;
        res.json(data);

    });




});


module.exports = router;
