const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/User');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/auth/signinPage');
  }
  res.render('dashboard', {user : req.session.user})
})

router.post('/editUser', urlencodedParser, function(req, res) {
  User.findOneAndUpdate({username:req.session.user.username}, {username:req.body.username}, {new : true}, function(err, result) {
    if (err) return console.log(err);
    req.session.user = result;
    res.redirect('/dashboard');
  })
})

router.get('/deleteUser', function(req, res) {
  User.deleteOne({username:req.session.user.username}, function(err) {
    if (err) return res.status(500).send("Internal server error :(");
    req.session.destroy();
    res.redirect('/auth/signinPage');
  })
})

router.post('/logout', urlencodedParser, function(req, res) {
  req.session.destroy();
  res.redirect('/auth/signinPage');
})

module.exports = router;