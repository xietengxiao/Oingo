var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());
var router = express.Router();
var session = require('express-session');
var FileStore = require('session-file-store')(session);











var connection = mysql.createConnection(
    {
        host     : 'localhost',
        user     : 'root',
        password : 'jiba123xie',
        database : 'oningo',
    }
);


router.post('/reg',function (req, res, next) {
    // 从连接池获取连接


        // 获取前台页面传过来的参数

        var username = req.body.username;
        var password = req.body.password;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var checkquery = "select * from User where username = ? or email =?";
        connection.query(checkquery,[username,email],function (err,rows) {
            if (err) res.json({code:-2});
            else if (rows.length == 0)
                query();
            else
                res.json({code:-2});
        });
        function query() {


        var queryString = "INSERT INTO User(uid,firstname,lastname,username,state,email,password) VALUES(0,?,?,?,'null',?,?)";

        console.log(queryString);

        var data = {};
        var _res = res;
        connection.query(queryString, [firstname, lastname, username, email, password], function (err, res) {

            if (res) {
                data.result = {
                    code: 200,
                    msg: '注册成功'
                };
            } else {
                data.result = {
                    code: -1,
                    msg: '注册失败'
                };
            }
            _res.json(data);

        });
    }



});

router.post('/login',function (req, res, next) {
    // 从连接池获取连接

    var sess = req.session;
    // 获取前台页面传过来的参数

    var email = req.body.email;
    var password = req.body.password;

    var queryString = "select * from User where email = ? and password = ?";
    console.log(queryString);
    var data = {};
    connection.query(queryString,[email,password], function (err, rows) {
        if (err) {
            data.result = {
                code: -1,
                msg: '登陆失败'
            };
            res.json(data);
        }
        if(rows.length > 0) {
            data.result = {
                code: 200,
                msg: '登陆成功'
            };
            req.session.regenerate(function(err) {
                if(err){
                    data.result = {
                        code: -1,
                        msg: '登陆失败'
                    };
                }

                req.session.user = rows[0].uid;


                res.json(data);

            });



        } else {
            data.result = {
                code: -1,
                msg: '登陆失败'
            };
            res.json(data);
        }


    });




});

router.get('/logout', function(req, res, next){
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug

    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登录失败'});
            return;
        }

        // req.session.loginUser = null;
        res.clearCookie("12345");
        res.json({code :200});


    });


});
router.get('/get',function (req,res,next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');
    var queryString = "select * from User where uid = "+loginUser;
    console.log(queryString);
    connection.query(queryString, function (err, rows) {
        if (err) res.json({code:-1});
        if (rows.length > 0){
            var data ={};
            data.username = rows[0].username;
            data.state = rows[0].state;
            data.code = 200;
            res.json(data);
        }
        else
            res.json({code :-1});



    });
});
router.post('/change',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');
    var state = req.body.state;

    var queryString = "Update User set state = ? where uid = ?";
    console.log(queryString);
    connection.query(queryString,[state,loginUser], function (err, rows) {
        if (err) res.json({code:-1});
        else
        res.json({code : 200});



    });






});

router.post('/action',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');
    var longi = req.body.longi;
    var lati = req.body.lati;
    var datetime = req.body.datetime;


    var queryString = "INSERT INTO Action(aid,longi,lati,datetime,uid) VALUES(0, ?,?,?,?)";
    console.log(queryString);
    connection.query(queryString,[longi,lati,datetime,loginUser], function (err, rows) {

            res.json({code: 200});


    });
});
router.post('/getComment',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');
    var nid= req.body.nid;



    var queryString = "select username,text from Comment natural join User where nid= ?";
    console.log(queryString);
    var jsonstr="[]";
    var jsonarray = eval('('+jsonstr+')');
    connection.query(queryString,[nid], function (err, rows) {
        if (err) res.json({code:-1});
        else {
            for (var i = 0; i < rows.length;i++){
                var arr={text:rows[i].text,username: rows[i].username};
                jsonarray.push(arr);
            }
            res.json(jsonarray);
        }


    });
});
router.post('/addComment',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');
    var nid= req.body.nid;
    var text = req.body.text;



    var queryString = "Insert Into Comment(cid,text,nid,uid) VALUES (0,?,?,?)";
    console.log(queryString);

    connection.query(queryString,[text,nid,loginUser], function (err, rows) {
        if (err) res.json({code:-1});
        else {
            res.json({code:200});
        }


    });
});
router.get('/getNote',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');




    var queryString = "select * from Note natural join Location natural join Schedule where uid="+ loginUser;
    console.log(queryString);
    var jsonstr="[]";
    var jsonarray = eval('('+jsonstr+')');
    connection.query(queryString, function (err, rows) {
        if (err) res.json({code:-1});
        else {
            for (var i = 0; i < rows.length;i++){
                var arr={text:rows[i].text,radius: rows[i].radius,WhoCanSee:rows[i].WhoCanSee,place_name:rows[i].place_name,address:rows[i].address,lat:rows[i].lat,lng:rows[i].lng,starttime:rows[i].starttime,endtime:rows[i].endtime,startdate:rows[i].startdate,enddate:rows[i].enddate,sfrom:rows[i].sfrom,sto:rows[i].sto,repeatid:rows[i].repeatid};
                jsonarray.push(arr);
            }
            res.json(jsonarray);
        }


    });
});
router.get('/getFilter',function (req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (!isLogined)
        res.redirect('/');




   var queryString = " select state,fromWho,radius,Location.place_id,address,place_name,lng,lat,Schedule.sid,startdate,starttime,enddate,endtime,repeatid,sfrom,sto,tagname from Filter left join Schedule  on Filter.sid = Schedule.sid left join Location  on Filter.place_id = Location.place_id left join Tag  on Filter.tid = Tag.tid where uid = ?";
    console.log(queryString);
    var jsonstr="[]";
    var jsonarray = eval('('+jsonstr+')');
    connection.query(queryString,[loginUser], function (err, rows) {
        if (err) res.json({code:-1});
        else {
            for (var i = 0; i < rows.length;i++){
                var arr={tagname: rows[i].tagname, state: rows[i].state,radius: rows[i].radius,fromWho:rows[i].fromWho,place_name:rows[i].place_name,address:rows[i].address,lat:rows[i].lat,lng:rows[i].lng,starttime:rows[i].starttime,endtime:rows[i].endtime,startdate:rows[i].startdate,enddate:rows[i].enddate,sfrom:rows[i].sfrom,sto:rows[i].sto,repeatid:rows[i].repeatid};
                jsonarray.push(arr);
            }
            res.json(jsonarray);
        }


    });
});
router.post('/addNote',function (req, res, next) {

    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;

    if (!isLogined)
        res.redirect('/');

    var longi = req.body.longi;
    var lati = req.body.lati;


    var tag = req.body.tag;
    var radius = req.body.radius;
    var begindate = req.body.begindate;
    var begintime = req.body.begintime;
    var enddate = req.body.enddate;
    var endtime = req.body.endtime;

    var text = req.body.text;


    var repeat = req.body.repeat;
    var from = req.body.from;
    var to = req.body.to;
    var whocansee = req.body.whocansee;

    var placeid = req.body.placeid;
    var place_name;
    var address;
    var GoogleLocations = require('google-locations');
    var sid;
    var lid = placeid;

    var locations = new GoogleLocations('AIzaSyD_bpvQK96VM7dyPnpwcsJZ62Q-d2UNC74');
    locations.details({placeid: placeid}, function(err, response) {
        if (err) res.json({code:-1});
        place_name = response.result.name;
        address = response.result.formatted_address;

        query();

    });
    function query() {
        var queryString = " INSERT INTO `oningo`.`Schedule` (`sid`, `starttime`, `endtime`, `startdate`, `enddate`, `sfrom`, `sto`, repeatid) VALUES (0, ?,?,?,?,?,?,?)";

        console.log(queryString);

        connection.query(queryString,[begintime,endtime,begindate,enddate,from,to,repeat], function (err, rows) {
            if (err) throw err;
            else {
                 sid = rows.insertId;

                console.log(sid);
                var queryString2 = "select place_id from Location where place_id = ?";
                connection.query(queryString2,[placeid], function (err, rows) {
                    if (err) {
                        throw err;
                        res.json({code:-1})
                    }
                    else {

                        if (rows.length > 0) {

                            query2();
                        }
                        else {
                            var queryString3 = "INSERT INTO Location(place_id,place_name,address,lat,lng) VALUES (?,?,?,?,?)";
                            console.log(queryString3);
                            connection.query(queryString3,[lid,place_name,address,lati,longi], function (err, rows) {
                                if (err) throw err;
                                else
                                query2();
                            });
                        }
                    }
                });
            }
        });
    }
    function query2()
    {
                            var queryString4 = "INSERT INTO Note(nid,text,radius,sid,uid,place_id,WhoCanSee) VALUES (0,?,?,?,?,?,?)";
                            console.log(queryString4);
                            connection.query(queryString4,[text,radius*1000,sid,loginUser,lid,whocansee], function (err, rows) {
                                if (err) res.json({code:-1});
                                else {
                                    var nid = rows.insertId;
                                    var tags = tag.split(',');
                                    for (var i = 0; i < tags.length; i++) {
                                        var queryString5 = "INSERT INTO HasTag(nid,tid) VALUES (" + nid + "," + "? )";
                                        console.log(queryString5);
                                        connection.query(queryString5,[tags[i]], function (err, rows) {
                                            if (err) res.json({code:-1});
                                        });
                                    }

                                   findUserCanbeSent();
                                }
                            });
                        }
    function findUserCanbeSent(){
        var sd = require('silly-datetime');
        var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');


        var queryString = "select distinct temp.uid from(select uid,max(datetime) as lasttime,(select"+
        " longi from Action b where b.uid = a.uid order by datetime desc limit 1)"+
        "as longi ,(select lati from Action b where b.uid = a.uid order by "+
        " datetime desc limit 1) as lati from Action a group by uid) as  temp, Friends where (("+ whocansee+" = 1 and uid = ?)or ("+whocansee+" = 2 and Friends.fromid = temp.uid and Friends.toid = ?) or uid = ? or "+whocansee+" = 3) and ( 6371*acos(cos( radians(temp.lati) ) * cos( radians(" +lati+") ) * cos( radians(temp.longi ) - radians("+longi+") ) + sin( radians("+lati+") ) * sin( radians( temp.lati ) )))  <= (?/1000) and CurrentTimeMatchNote(?,?,?,?,?,?,?,?,?) = 1  and temp.uid not in (select distinct uid from Filter)";
        console.log(queryString);
        connection.query(queryString,[loginUser,loginUser,loginUser,radius*1000,time.substr(11,5),time.substr(0,10),begindate,begintime,enddate,endtime,repeat,from,to],function (err,rows) {
            if (err) throw err;
            else{
                var data= "";

                for (var i = 0;i< rows.length;i++)
                    data+= rows[i].uid+",";
                var queryString2 =  "select distinct temp2.uid from (select distinct temp.uid,tid,state,fromWho,Filter.radius,Location.lng,Location.lat,starttime,startdate,endtime,enddate,repeatid,sfrom,sto from(select uid,max(datetime) as lasttime,(select"+
                    " longi from Action b where b.uid = a.uid order by datetime desc limit 1)"+
                    "as longi ,(select lati from Action b where b.uid = a.uid order by "+
                    " datetime desc limit 1) as lati from Action a group by uid) as  temp natural join Filter left join Schedule  on Filter.sid = Schedule.sid left join Location on Location.place_id = Filter.place_id , Friends  where (("+ whocansee+" = 1 and uid = ?)or ("+whocansee+" = 2 and Friends.fromid = temp.uid and Friends.toid = ?) or uid = ? or "+whocansee+" = 3) and ( 6371*acos(cos( radians(temp.lati) ) * cos( radians(" +lati+") ) * cos( radians(temp.longi ) - radians("+longi+") ) + sin( radians("+lati+") ) * sin( radians( temp.lati ) )))  <= (?/1000) and CurrentTimeMatchNote(?,?,?,?,?,?,?,?,?) = 1) as temp2 ,Friends,HasTag,User  where((temp2.fromWho = 1 and temp2.uid = ? ) or( temp2.fromWho = 2 and Friends.fromid = temp2.uid and Friends.toid = ?  ) or temp2.fromWho = 3 or temp2.uid = ?) and  (temp2.lng is null or (6371 * acos(cos( radians(temp2.lat) ) * cos( radians(? ) ) * cos( radians(temp2.lng ) - radians(?) ) + sin( radians(temp2.lat) ) * sin( radians( ? ) ))) <=  (temp2.radius/1000)) and (temp2.tid is null or (HasTag.tid = temp2.tid and HasTag.nid = ?)) and (temp2.state is null or (temp2.state = User.state and  User.uid = temp2.uid)) and (temp2.starttime is null or ScheduleMatch(temp2.startdate,temp2.starttime,temp2.enddate,temp2.endtime,temp2.repeatid,temp2.sfrom,temp2.sto,?,?,?,?,?,?,?))";


                console.log(queryString2);
                connection.query(queryString2,[loginUser,loginUser,loginUser,radius*1000,time.substr(11,5),time.substr(0,10),begindate,begintime,enddate,endtime,repeat,from,to,loginUser,loginUser,loginUser,lati,longi,lati,loginUser,begindate,begintime,enddate,endtime,repeat,from,to],function (err,rows) {
                    if (err) throw err;
                    else {
                        for (var i = 0; i < rows.length; i++)
                            data += rows[i].uid + ",";
                        var j = {};
                        j.data = data;
                        j.code = 200;
                        res.json(j);
                    }
                });

            }

        });
    }






        });


router.post('/addFilter',function (req, res, next) {

    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;

    if (!isLogined)
        res.redirect('/');

    var longi = req.body.longi;
    var lati = req.body.lati;


    var tag = req.body.tag;
    var radius = req.body.radius;
    var begindate = req.body.begindate;
    var begintime = req.body.begintime;
    var enddate = req.body.enddate;
    var endtime = req.body.endtime;




    var repeat = req.body.repeat;
    var from = req.body.from;
    var to = req.body.to;
    var fromwho = req.body.fromwho;
    var state = req.body.state;


    var placeid = req.body.placeid;
    var place_name;
    var address;
    var sid = "null";

    if (placeid!="null") {
        var GoogleLocations = require('google-locations');

        var locations = new GoogleLocations('AIzaSyD_bpvQK96VM7dyPnpwcsJZ62Q-d2UNC74');
        locations.details({placeid: placeid}, function (err, response) {
            if (err) throw err;
            place_name = response.result.name;
            address = response.result.formatted_address;
            console.log(place_name);

            query();

        });
    }
    else
        query();
    function query() {


        var lid = placeid;
        if (begindate != "null") {
            var queryString = " INSERT INTO `oningo`.`Schedule` (`sid`, `starttime`, `endtime`, `startdate`, `enddate`, `sfrom`, `sto`, repeatid) VALUES (0, ?,?,?,?,?,?,?)";

            console.log(queryString);

            connection.query(queryString, [begintime, endtime, begindate, enddate, from, to, repeat], function (err, rows) {
                if (err) throw err;
                else {
                    sid = rows.insertId;
                    query2();
                }
            });
        }
        else
            query2();
    }
        function query2() {

            if (longi != "null") {
                var queryString2 = "select place_id from Location where place_id = ?";
                connection.query(queryString2,[placeid], function (err, rows) {
                    if (err) throw err;
                    else {

                        if (rows.length > 0)
                            query3();
                        else {
                            var queryString3 = "INSERT INTO Location(place_id,place_name,address,lat,lng) VALUES (?,?,?,?,?)";
                            console.log(queryString3);
                            connection.query(queryString3,[placeid,place_name,address,lati,longi], function (err, rows) {
                                if (err) throw err;
                                else
                                query3();
                            });
                        }


                    }
                });
            }
            else
                query3();
        }
        function query3(){
        if (sid == "null")
            sid= null;
        if (state == "")
            state = null;
        if (tag == 0 || tag == "null")
            tag = null;
        if (placeid == null|| placeid== "null"){
            longi = lati = placeid = radius = null;
        }
        var queryString4 = "INSERT INTO Filter(fid,state,fromWho,radius,place_id,sid,uid,tid) VALUES (0,?,?,?,?,?,?,?)";
                        console.log(queryString4);
                        connection.query(queryString4,[state,fromwho,radius*1000,placeid,sid,loginUser,tag],function (err,rows) {
                            if (err) throw err;
                            else{
                                res.json({code:200});
                                }


                        });
                    }


});
router.post('/searchNotes',function (req, res, next) {

    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;

    if (!isLogined)
        res.redirect('/');

    var longi = req.body.longi;
    var lati = req.body.lati;
    var time = req.body.time;
    var words = req.body.words;
    var date = req.body.date;
    var state;

   connection.query("select state from User where uid = "+loginUser,function (err,rows) {
       if (err) res.json({code:-1});
       else {
           state = rows[0].state;
           connection.query("select fid from Filter where uid = "+loginUser,function (err,rows) {
               if (err) res.json({code:-1});
               else
               {
                   if (rows.length > 0)
                       queryWithFilter();
                   else
                       queryWithoutFilter();

               }
           });

       }
   });
    function queryWithoutFilter(){
        var queryString = "select distinct nid,username,uid,lng,lat,sfrom,sto,starttime,endtime,startdate,enddate,WhoCanSee,repeatid,text,place_name,address from Note natural Join Location natural join Schedule natural join User, Friends  where ((WhoCanSee = 2 and Friends.toid = uid and Friends.fromid = " + loginUser+ " ) or (WhoCanSee = 3) or uid = ? or (WhoCanSee= 1 and  uid = " + loginUser + "))\n" +
        " and ( 6371*acos(cos( radians(lat) ) * cos( radians( ?) ) * cos( radians(lng ) - radians(?) ) + sin( radians(?) ) * sin( radians( lat ) ))) <= (radius/1000) and CurrentTimeMatchNote(?,? ,startdate,starttime,enddate,endtime,repeatid,sfrom,sto) = 1";
        console.log(queryString);
        connection.query(queryString,[loginUser,lati,longi,lati,time,date], function (err, rows) {
            if (err) res.json(-1);
            else {
                var jsonstr="[]";
                var wordsarray = words.split(",");
                var jsonarray = eval('('+jsonstr+')');
                for (var i = 0; i < rows.length;i++) {

                    console.log(rows[i]);
                    console.log(wordsarray);
                    if (wordsarray.length > 0) {
                        var flag = 1;
                        for (var j = 0; j < wordsarray.length; j++) {
                            if (rows[i].text.indexOf(wordsarray[j]) == -1) {
                                flag = 0;
                                break;
                            }
                        }
                        if (flag == 0)
                            continue;
                    }
                    var arr={nid:rows[i].nid, text: rows[i].text, name: rows[i].place_name, address: rows[i].address,username:rows[i].username};
                    jsonarray.push(arr);


                }
                res.json(jsonarray);

            }

        });
     }

   function queryWithFilter() {
       var queryString = "select distinct temp3.nid,temp3.text,temp3.place_name,temp3.address,temp3.username from (select distinct nid,username,uid,lng,lat,sfrom,sto,starttime,endtime,startdate,enddate,WhoCanSee,repeatid,text,place_name,address from Note natural Join Location natural join Schedule natural join User, Friends  where ((WhoCanSee = 2 and Friends.toid = uid and Friends.fromid = " + loginUser+ " ) or (WhoCanSee = 3) or uid = ? or (WhoCanSee= 1 and  uid = " + loginUser + "))\n" +
           " and ( 6371*acos(cos( radians(lat) ) * cos( radians( ?) ) * cos( radians(lng ) - radians(?) ) + sin( radians(?) ) * sin( radians( lat ) ))) <= (radius/1000) and CurrentTimeMatchNote(?,? ,startdate,starttime,enddate,endtime,repeatid,sfrom,sto) = 1) as temp3,(select state,fromWho,radius,Location.place_id,address,place_name,lng,lat,Schedule.sid,startdate,starttime,enddate,endtime,repeatid,sfrom,sto,Tag.tid from Filter left join Schedule  on Filter.sid = Schedule.sid left join Location  on Filter.place_id = Location.place_id left join Tag  on Filter.tid = Tag.tid where uid = ?) as temp2," +
           "(select toid from Friends where fromid  = ?) as temp4,HasTag  where((temp2.fromWho = 1 and temp3.uid = ? ) or (temp2.fromWho = 2 and temp4.toid = temp3.uid  ) or temp2.fromWho = 3 or temp3.uid = ?) and  (temp2.lng is null or (6371 * acos(cos( radians(temp3.lat) ) * cos( radians(temp2.lat ) ) * cos( radians(temp2.lng ) - radians(temp3.lng) ) + sin( radians(temp2.lat) ) * sin( radians( temp3.lat ) ))) <=  (temp2.radius/1000)) and (temp2.tid is null or (HasTag.tid = temp2.tid and HasTag.nid = temp3.nid)) and (temp2.state is null or temp2.state = ?) and (temp2.starttime is null or ScheduleMatch(temp2.startdate,temp2.starttime,temp2.enddate,temp2.endtime,temp2.repeatid,temp2.sfrom,temp2.sto,temp3.startdate,temp3.starttime,temp3.enddate,temp3.endtime,temp3.repeatid,temp3.sfrom,temp3.sto))";


       console.log(queryString);
       connection.query(queryString,[loginUser,lati,longi,lati,time,date,loginUser,loginUser,loginUser,loginUser,state], function (err, rows) {
           if (err) throw err;
           else {
               var jsonstr="[]";
               var jsonarray = eval('('+jsonstr+')');
               var wordsarray = words.split(",");
               for (var i = 0; i < rows.length;i++) {
                   if (wordsarray.length > 0) {
                       var flag = 1;
                       for (var j = 0; j < wordsarray.length; j++) {
                           if (rows[i].text.indexOf(wordsarray[j]) == -1) {
                               flag = 0;
                               break;
                           }
                       }
                       if (flag == 0)
                           continue;
                   }
                   console.log(rows[i]);
                   var arr={nid:rows[i].nid, text: rows[i].text, name: rows[i].place_name, address: rows[i].address,username:rows[i].username};
                   jsonarray.push(arr);


               }
              res.json(jsonarray);

           }

       });
   }








});






module.exports = router;