const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const url = require('url');
const User = require('../models/User');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/registerPage', function(req, res) {
  if (req.session.user) {
    return res.redirect('/dashboard')
  }
  res.status(200).render('register', {err : req.query.err, usererr : req.query.usererr, passerr : req.query.passerr});
})

router.get('/signinPage', function(req, res) {
  if (req.session.user) {
    return res.redirect('/dashboard')
  }
  res.status(200).render('signin', {err : req.query.err, usererr : req.query.usererr});
})

router.post('/register', urlencodedParser, function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.redirect(url.format({
      pathname : '/auth/registerPage',
      query : {
        "err" : "please fill out username and password"
      }
    }));
  }
  if (req.body.username.length < 3) {
    return res.redirect(url.format({
      pathname : '/auth/registerPage',
      query : {
        "usererr" : "username must include atleast 3 charecters"
      }
    }));
  } else if (req.body.username.length > 20) {
    return res.redirect(url.format({
      pathname : '/auth/registerPage',
      query : {
        "usererr" : "username cant be more than 20 charecters"
      }
    }));
  }
  if (req.body.password.length < 8) {
    return res.redirect(url.format({
      pathname : '/auth/registerPage',
      query : {
        "passerr" : "password must include atleast 8 charecters"
      }
    }));
  } else if (req.body.password.length > 30) {
    return res.redirect(url.format({
      pathname : '/auth/registerPage',
      query : {
        "passerr" : "password cant be more than 30 charechters"
      }
    }));
  }
  User.findOne({username : req.body.username.trim()}, function(err, user) {
    if (err) return res.status(500).send("Internal server error :(");

    if (user) {
      return res.redirect(url.format({
        pathname : '/auth/registerPage',
        query : {
          "err" : "username already exists"
        }
      }))
    }
  })
  const newUser = new User({
    username : req.body.username.trim(),
    password : req.body.password.trim()
  })
  newUser.save(err=> {
    if (err) return res.status(500).send("Internal Server Error");
    res.redirect(url.format({
      pathname : '/auth/signinPage'
    }))
  })
})

router.post('/signin', urlencodedParser, function(req, res) {
  if (!req.body.username.trim() || !req.body.password.trim()) {
    return res.redirect(url.format({
      pathname : '/auth/signinPage',
      query : {
        "err" : "please fill out this fields"
      }
    }))
  }

  User.findOne({username : req.body.username.trim()}, function(err, user) {
    if (err) return res.status(500).send("Internal server error :(");
    if (!user) {
      return res.redirect(url.format({
        pathname : '/auth/signinPage',
        query : {
          "usererr" : "user not found !"
        }
      }))
    }
    bcrypt.compare(req.body.password.trim(), user.password, function(err, result) {
      if (err) return res.status(500).send("Internal server error :(");
      if (!result) {
        return res.redirect(url.format({
          pathname : '/auth/signinPage',
          query : {
            "usererr" : "user not found !"
          }
        }))
      }


      req.session.user = user;

      res.redirect('/dashboard');
  });

  })
})

module.exports = router;