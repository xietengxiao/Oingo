var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
var router = express.Router();


var connection = mysql.createConnection(
    {
        host     : 'localhost',
        user     : 'root',
        password : 'jiba123xie',
        database : 'oningo',
    }
);
router.post('/',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');
    var username = req.body.username;

    var queryString = "Select * from User where username = ? ";
    console.log(queryString);
    connection.query(queryString,[username], function (err, rows) {
        if (err) throw err;

        if (rows.length > 0) {
            var toid = rows[0].uid;
            var queryString2 = "Insert Into Friends(fid,fromid,toid) VALUES (0,"+loginUser+","
        +toid+")";
            connection.query(queryString2,function (err2,res2) {
                if (err2) res.json({code:-1});
                else{
                    res.json({code:200,message:"Add Successfully"});
                }

            });
        }

        else{
            var data = {code :-1,
                        msg  :"username not found or he already is your friend before"};
            res.json(data);

        }


    });




});
router.get('/',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');




    var queryString = "select distinct username from Friends join User U on Friends.toid = U.uid where fromid ="+ loginUser;
    console.log(queryString);
    var jsonstr="[]";
    var jsonarray = eval('('+jsonstr+')');
    connection.query(queryString, function (err, rows) {
        if (err) res.json({code:-1});
        else {
            for (var i = 0; i < rows.length;i++){
                var arr = {username :rows[i].username};
                jsonarray.push(arr);
            }
            res.json(jsonarray);
        }


    });
});

module.exports = router;