var express = require('express');
var router = express.Router();
var config = require('../config.js');
var db = require('orchestrate')(config.orchestrateKey);

router.get('/', function(req, res) {
    console.log("Request category: " + req.query.category);
    db.search('Products', req.query.category)
        .then(function (result) {
            items = result.body.results;
            res.render('products.hjs', {request: req.param('productName'), result: "Success!", products: items});
        })
        .fail(function (err) {
            res.render('index.hjs', {request: req.param('productName'), result: "Failure!"});
        })

});

module.exports = router;
