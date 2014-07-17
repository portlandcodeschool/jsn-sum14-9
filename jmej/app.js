// dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var Q = require('q');
var config = require('./config.js'); //needs to look like this: module.exports = {dbKey: "YOUR_ORCHESTRATE_KEY", f2fKey: "YOUR_API_KEY"};
var db = require('orchestrate')(config.dbKey);
var f2fKey = config.f2fKey; //food2fork API key

// start express
var app = express();

//setup date for timestamping logs - used in generating db ids
var date = new Date();
var now = date.getTime();

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
  db.put('ingredients', '1_eggs', {"type" : "eggs", "qty":"12"}
  )
  .fail(function (err) {
    console.error(err);
    console.error('could not add the ingredient. sorry :-(');
  });
};

dbFunctions.addIngredient = function (type, qty) {
  var timeStamp = now;
  var oid = timeStamp+'_'+type;
  db.put('ingredients', oid, {
    "type": type, "qty":qty
  })
  .fail(function (err) {
    console.error(err);
    console.error('could not add the ingredient. sorry :-(');
  });
};

 dbFunctions.addFakeingredient();

// express route

app.get('/ingredients', function (req, res) {
  var items = []; //stores all my ingredient objects as they come back from orchestrate
  var ings = []; //stores the item.qty + item.type strings for the template output
  var ingtypes = [];
  var recipes = [];

  var getRecipes = function(arr){
    var path = "http://food2fork.com/api/search?key="+f2fKey+"&q=";
    var ingq = "";
    for (var i =0; i<(arr.length); i++){
      ingq = ingq+arr[i]+',';
    }
    ingq = ingq.slice(0, -1);
    //console.log(path+ings);
    var options = {
    host: 'food2fork.com',
    path: path+ingq
  };

  var callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
    str += chunk;
  });

    response.on('end', function () {
    var o = [];
    recipes = JSON.parse(str);
    for (var i=0; i<recipes.recipes.length; i++){
      o.unshift({url:recipes.recipes[i].source_url,img:recipes.recipes[i].image_url, title:recipes.recipes[i].title});
    }
    res.render('ingredients', {items:ings, recipes:o});
    //console.log(ings);
    });
  };

  http.request(options, callback).end();
};
  db.list('ingredients', {limit:100, startKey:'1'})  //call to orchestrate
  .then(function (result) {
    result.body.results.forEach(function (item, index) {
      var resultItem = item.value;
      items.unshift(resultItem);
    }); 
  })
  .then(function(result) {
    items.forEach(function (item, index){
    ings.unshift(item.qty+" "+item.type);
    ingtypes.unshift(item.type);
    });
    getRecipes(ingtypes);
    //console.log(ingtypes);
  })
  .fail(function (err) {
    console.error(err);
  });
});


// json from client
app.post('/addingredient', function (req, res){
  req.accepts('application/json');
  console.log(req.body.ingredient);
  var ingArr = req.body.ingredient.split(" ");
  var ing = ingArr.pop();                           //assumes the last word entered is the actual ingredient
  var qty = ingArr.toString();
  var re = /,/gi;
  qty = qty.replace(re," "); //assumes all but the first word are a string describing qty
  console.log('just added ' +qty+ ' the ingredient: '+ing);
  dbFunctions.addIngredient(ing, qty);
  res.send(200, 'ok, we added your ingredient');
});

// get list of recipes from food2fork.com



//getRecipes();

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