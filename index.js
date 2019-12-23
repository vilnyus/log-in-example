var express = require('express');
var bodyParser = require('body-parser');
var cons = require('consolidate');
// var path = require('path');
var bcrypt = require('bcrypt-nodejs');

const PORT = 3000;
const saltRounds = 10;

const mongoose = require('mongoose');
mongoose.connect(
  'mongodb://user-abc:user123@ds353748.mlab.com:53748/users_db_auth',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error'));
db.once('open', function(callback) {
  console.log('connection succeeded');
});

var app = express();
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

// app.use('*/views',express.static(path.join(__dirname, 'public/views')));
// app.use('*/js',express.static(path.join(__dirname, 'public/javascripts')));
// app.use('*/css',express.static(path.join(__dirname, 'public/stylesheets')));

// view engine setup
app.engine('html', cons.swig);
app.set('view engine', 'html');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.post('/sign_up', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var pass = req.body.password;
  var phone = req.body.phone;
  var salt = bcrypt.genSaltSync();
  var password_hash = bcrypt.hashSync(pass, salt);

  var user = {
    _id: name,
    email: email,
    password: password_hash,
    phone: phone
  };

  db.collection('users_db').insertOne(user, function(err, collection) {
    if (err) throw err;
    console.log('Record inserted Successfully');
  });

  return res.redirect('/signup_success.html');
});

app.post('/log_in', function(req, res) {
  var name = req.body.name;
  var pass = req.body.password;
});

app.get('/login', function(req, res) {
  console.log('display login page');
  res.redirect('/login.html');
});

app.get('/signup', function(req, res) {
  res.render('./signup');
});

app.get('/', function(req, res) {
  console.log('display index page');
  res.sendFile('/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
