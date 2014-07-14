var express = require('express');
var router = express.Router();
var config = require('../../config.js');
var db = require('orchestrate')(config.orchestrateKey);
var items = [];


/* GET users listing. */

router.get('/', function(req, res) {
    db.list('Categories', {"limit":"100"})
        .then(function (result) {
            items = result.body.results;
            res.render('admin/product.hjs', {categories: items});
        })
        .fail(function (err) {
            res.render('admin/product.hjs', {categories: "Fail!"});
        })
});

router.post('/', function(req,res){
    db.post('Products',{"product" : req.param('productName'), "category":req.param('categoryName')}).then(function(result){
        db.list('Products', {"limit": 100})
            .then(function(result){
                items = result.body.results;
                res.render('admin/productPostSuccess.hjs', {request: req.param('categoryName'), result: "Success!" ,products: items})
            .fail(function(error){
            res.render('admin/productPostSuccess.hjs', {result: "Fail!"})
    });})})})



module.exports = router;