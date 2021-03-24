const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
const api = require('./router/api');
const session = require('express-session');
const cookie = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/hw18', {
  useNewUrlParser: true,
  useUnifiedTopology : true,
  useCreateIndex : true
});

app.use(cookie());
app.set('veiws', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  key: 'user_sid',
  secret: 'mysecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));


app.use(express.static(path.join(__dirname, 'views')));

app.use('/',api);









app.listen(8080, function() {
  console.log('server is running on port 8080......');
})