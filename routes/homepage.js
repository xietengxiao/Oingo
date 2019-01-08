var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (isLogined)
       res.render('homepage');
    else
        res.redirect('/');
});
router.get('/Mynotes', function(req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (isLogined)
        res.render('MyNotes');
    else
        res.redirect('/');
});
router.get('/Filters', function(req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (isLogined)
        res.render('filter');
    else
        res.redirect('/');
});
router.get('/Friends', function(req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (isLogined)
        res.render('friends');
    else
        res.redirect('/');
});
router.get('/Profile', function(req, res, next) {
    var sess = req.session;
    var loginUser = sess.user;
    var isLogined = !!loginUser;
    console.log(loginUser);
    if (isLogined)
        res.render('profile');
    else
        res.redirect('/');
});



module.exports = router;