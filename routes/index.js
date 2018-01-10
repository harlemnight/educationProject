var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../models/dbConfig');
var Baby =  require('../models/baby').baby;
var router = express.Router();
mongoose.connect(dbConfig.dblink,dbConfig.userMongoClent);


router.get('/', function(req, res, next) {
    Baby.find({yxbz:'Y'},
        function (err, babies) {
            if (err) {
                res.render('index2', { msg:err.toString()});
            }
            else {
                // 后端使用 moment
                // babies.forEach(function(baby){
                //    console.log(moment(baby.birthday).format('YYYY-MM-DD'));
                // });
                res.render('index2', { status:true,babies:babies,date : new Date()});

            }
        }).limit(7);
});



module.exports = router;
