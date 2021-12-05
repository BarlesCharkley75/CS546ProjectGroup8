const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(
  session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
  })
);

app.use('/private', (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).render('hotelpages/error', {title: 'error'});
  } else {
    next();
  }
});

var myLogger = function (req, res, next) {
  if (!req.session.user) {
    let time = new Date().toUTCString();
    let result = '';
    result = '[' + time + ']' + ': ' + req.method + ' ' + req.originalUrl + ' (Non-Authenticated User)';
    console.log(result);
  
  } else {
    let time = new Date().toUTCString();
    let result = '';
    result = '[' + time + ']' + ': ' + req.method + ' ' + req.originalUrl + ' (Authenticated User)';
    console.log(result);
    
  }
  next();
}

app.use(myLogger);

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });