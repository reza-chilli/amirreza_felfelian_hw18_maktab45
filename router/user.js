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
  console.log(req.body.username);
  User.findOneAndUpdate({username:req.session.user.username}, {username:req.body.username}, {new : true}, function(err, result) {
    if (err) return console.log(err);
    req.session.user = result;
    res.redirect('/dashboard');
  })
})

router.post('/logout', urlencodedParser, function(req, res) {
  req.session.destroy();
  res.redirect('/auth/signinPage');
})

module.exports = router;