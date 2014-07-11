// environment variables
var dotenv = require('dotenv');
dotenv.load();

// dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var handlebars = require('handlebars');
var moment = require('moment');
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);
var app = express();

// templates
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/publish', function(req, res) {
  res.render('publish', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer'
    },
    helpers: {
      "format-date": function(date) {
        return moment(date).fromNow();
      }
    },
    updates: [
      {
        author: 'chad',
        msg:'hello, world',
        timestamp: new Date()
      }
    ]
  });
});

app.get('/event/:name', function(req, res) {
  res.render('event', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer'
    },
    name: req.params.name
  });
})

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port # ' + app.get('port'));
});