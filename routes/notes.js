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
router.get('/',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');




    var queryString = "select * from Note natural join Schedule natural join Location";
    console.log(queryString);
    var jsonstr="[]";
    var jsonarray = eval('('+jsonstr+')');
    connection.query(queryString, function (err, rows) {
        if (err) res.json({code:-1});
        else {
            for (var i = 0; i < rows.length;i++){


                var arr = {nid:rows[i].nid,WhoCanSee:rows[i].WhoCanSee,nid :rows[i].nid,text:rows[i].text,radius:rows[i].radius,lat:rows[i].lat,lng:rows[i].lng,starttime:rows[i].starttime,endtime:rows[i].endtime,startdate:rows[i].startdate,enddate:rows[i].enddate,sfrom:rows[i].sfrom,sto:rows[i].sto,repeatid:rows[i].repeatid};
                jsonarray.push(arr);
            }
            res.json(jsonarray);
        }


    });
});
module.exports = router;