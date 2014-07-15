var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.orchestrateKey);

/* GET home page. */
router.get('/', function(req, res) {
    db.list('Categories', {"limit":"100"})
        .then(function (result) {
            items = result.body.results;
            console.log(items);
            res.render('index.hjs', {request: req.param('categoryName'), result: "Success!", categories: items});
        })
        .fail(function (err) {
            res.render('index.hjs', {request: req.param('categoryName'), result: "Failure!"});
        })
  res.render('index', { title: "RateJoes'.com" });
});

module.exports = router;
