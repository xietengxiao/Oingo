var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (isLogined)
        res.redirect('/homepage');
    else
        res.render('index');
});

module.exports = router;
