// dependencies
var express = require('express');
var path = require('path');
var http = require('http');
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
  db.put('ingredients', '1', {"type" : "eggs", "qty":"12"}
  )
  .fail(function (err) {
    console.error(err);
    console.error('could not add the ingredient. sorry :-(');
  });
};

dbFunctions.addIngredient = function (id, type, qty) {
  db.put('ingredients', id, {
    "type": type, "qty":qty
  })
  .fail(function (err) {
    console.error(err);
    console.error('could not add the ingredient. sorry :-(');
  });
};

 dbFunctions.addFakeingredient();

// express routes

app.get('/ingredients', function (req, res) {
  var items = []; //stores all my ingredient objects as they come back from orchestrate
  var ings = []; //stores the item.qty + item.type strings for the template output
  var ingtypes = [];
  db.list('ingredients', {limit:100, startKey:'1'})
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
    res.render('ingredients', {items:ings});
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
  var id = items.length+1;
  console.log(req.body.ingredient);
  var ingArr = req.body.ingredient.split(" ");
  var ing = ingArr.pop();                           //assumes the last word entered is the actual ingredient
  var qty = ingArr.toString();
  var re = /,/gi;
  qty = qty.replace(re," "); //assumes all but the first word are a string describing qty
  console.log('just added ' +qty+ ' the ingredient: '+ing);
  dbFunctions.addIngredient(id, ing, qty);
  res.send(200, 'ok, we added your ingredient');
});

// get list of recipes from food2fork.com

var getRecipes = function(arr){
  var path = "http://food2fork.com/api/search?key=3ebaeb557c399a02f6d31c1920934738&q=";
  var ings = "";
  for (var i =0; i<(arr.length); i++){
      ings = ings+arr[i]+',';
    }
  ings = ings.slice(0, -1);
  console.log(path+ings);
  var options = {
  host: 'food2fork.com',
  path: path+ings
};
  var recipes = {};

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    recipes = JSON.parse(str);
    for (var i=0; i<recipes.recipes.length; i++){
      console.log(recipes.recipes[i].title + " website: "+recipes.recipes[i].source_url+" image "+recipes.recipes[i].image_url)
    }
  });
};

http.request(options, callback).end();
};

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