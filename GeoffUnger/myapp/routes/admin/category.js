var express = require('express');
var router = express.Router();
var config = require('../../config.js');
var db = require('orchestrate')(config.orchestrateKey);


/* GET users listing. */
router.get('/', function(req, res) {
    res.render('admin/category.hjs', {this:"that"});
});

router.post('/', function(req,res){
    var items = [];
    db.post('Categories', {"category" : req.param('categoryName')}).then(function (result) {
            db.list('Categories', {"limit":"100"})
                .then(function (result) {
                    items = result.body.results;
                    res.render('admin/categoryPostSuccess.hjs', {request: req.param('categoryName'), result: "Success!", categories: items});
                })
                .fail(function (err) {
                    res.render('admin/categoryPostSuccess.hjs', {request: req.param('categoryName'), result: "Failure!"});
                })
        })

    .fail(function(error){
        console.table(error);
        res.render('admin/postSuccess.hjs', {request: req.param('categoryName'), result: "Failure!"});
    })}
);

module.exports = router;