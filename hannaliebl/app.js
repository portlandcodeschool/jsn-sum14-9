var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var bodyParser = require('body-parser');
var q = require('q');
var config = require('./config.js');
var db = require('orchestrate')(config.dbKey);

var app = express();

app.engine('html', consolidate.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

var jobsAppliedFor = [];
var jobsInterestedIn = [];

var dbFunctions = {};
dbFunctions.sendApplication = function (id, title, company, applied_to) {
  if (applied_to) {
    db.put('jobs_applied_for', 'appliedto'+id, {
      "title": title,
      "company": company,
      "applied_to": applied_to
    })
    .fail(function (err) {
      console.log(err);
    });
  } else {
    db.put('jobs_interested_in', ('interestedin'+id), {
      "title": title,
      "company": company,
      "applied_to": applied_to
    })
    .fail(function (err) {
      console.log(err);
    });
  }
}

app.get('/', function (req, res) {
  db.list('jobs_applied_for', {startKey: 'appliedto1'})
  .then(function (result) {
    console.log("get result:",result.body)
    result.body.results.forEach(function (item, index) {
      var displayJobTitle = item.value.title;
      jobsAppliedFor.unshift(displayJobTitle);
    });
  })
  .then(function (result) {
    res.render('index', {jobsAppliedFor:jobsAppliedFor});
  })
  .fail(function (err) {
    console.log(err);
  })
  // res.render('index');
});

app.post('/', function (req, res) {
  if (req.body.appliedTo === 'false') {
    var id = jobsInterestedIn.length + 1;
  } else {
    var id = jobsAppliedFor.length + 1;
  }
  console.log(id);
  req.accepts('application/json');
  console.log(req.body);
  dbFunctions.sendApplication(id, req.body.jobTitle, req.body.company, req.body.appliedTo);
  res.send('200', 'Added application');
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port # ' + app.get('port'));
});