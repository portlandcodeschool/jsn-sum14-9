// dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var Q = require('q');
var config = require('./config.js');
var db = require('orchestrate')(config.dbKey); // you need to use your own api key
// add a file in this same directory called config.js
// export an object from the file with the property called dbKey
// add your own orchestrate app key 

// start express
var app = express();

// template configuration
app.engine('html', consolidate.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// app.set('env', 'production'); 

// express middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


var dbFunctions = {};

dbFunctions.addFakeingredient = function () {
  db.put('my-kitchen', 'ingredients', {ingredient: [{"eggs": "12"}, {"flour": "1 lb"}, {"milk": "1 Quart"}, {"sugar": "1 lb"}, {"baking soda":"1 box"}, {"baking power":"1 can"}]}
  )
  .fail(function (err) {
    console.error(err);
    console.error('could not add the ingredient. sorry :-(');
  });
}

dbFunctions.addIngredient = function (id, description) {
  db.put('ingredients', ('ingredient' + id), {
    "ingredient": description
  })
  .fail(function (err) {
    console.error(err);
    console.error('could not add the ingredient. sorry :-(');
  });
}

 dbFunctions.addFakeingredient();

// express routes

var items = [];

app.get('/ingredients', function (req, res) {
  items = [];
  db.list('my-kitchen', {limit:100, startKey:'ingredients'})
  .then(function (result) {
    //console.log(result.body.results);
    result.body.results.forEach(function (item, index) {
      var resultItems = item.value;
      console.log(resultItems);  
      resultItems.forEach(function (item, index){
        var resultItem = item;
        
        items.unshift(resultItem);
      });  
    });
  })
  .then(function(result) {
    res.render('ingredients', {items:items});
  })
  .fail(function (err) {
    console.error(err);
  })
});


// json from client: {"eggs": "1 dozen}
app.post('/addingredient', function (req, res){
  req.accepts('application/json');
  var id = items.length;
  console.log(req.body);
  console.log('just added the ingredient: ' + req.body.ingredient);
  dbFunctions.addIngredient(id, req.body.ingredient)
  res.send(200, 'ok, we added your ingredient');
});

// express middleware for error handling
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace to browswer...awesome!
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user... also awesome!
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port # ' + app.get('port'));
});