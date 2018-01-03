var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../models/dbConfig');
var Course =  require('../models/course').course;
var Baby =  require('../models/baby').baby;
var router = express.Router();
mongoose.connect(dbConfig.dblink,dbConfig.userMongoClent);


router.get('/list', function(req, res) {
    var baby_name = req.query.baby_name;
    var course_rqq = req.query.course_rqq;
    var course_rqz = req.query.course_rqz;
    var num = req.query.page;
    var pageNum = 0;
    var pageSize = 3;
    if ( num == undefined || num <= 1) {
        pageNum = 1;
    }else {
        pageNum = num;
    }
    var offset = (parseInt(pageNum)-1)*pageSize;
    var condition ;
    console.log(baby_name);
    console.log(course_rqq);
    console.log(course_rqz);

    if (baby_name==undefined||baby_name==""){
        if (
             (course_rqq==undefined||course_rqq=="")
                ||(course_rqz==undefined||course_rqz=="") ){
            condition = {yxbz:'Y'};
        }else {
            condition = {yxbz:'Y',course_rq:{$gte:course_rqq,$lte:course_rqz}};
        }
    }else {
        if (course_rqq==undefined||course_rqq=="") {
            condition = {yxbz:'Y',"baby_name":baby_name,course_rq:{$lte:course_rqz}};
        }else if (course_rqz==undefined||course_rqz=="") {
            condition = {yxbz:'Y',"baby_name":baby_name,course_rq:{$gte:course_rqq}};
        }else {
            condition = {yxbz:'Y',"baby_name":baby_name} ;
        }
    }

    Course.find(condition,//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
            function (err, cs) {
                if (err) {
                    res.render('course/list', { msg:err.toString()});
                }
                else {
                        Course.count(condition,
                                        function(err,count){
                                        var pageTotal =Math.ceil(count/pageSize);
                                        res.render('course/list', { courses:cs,
                                                                    course_rqq:course_rqq,
                                                                    course_rqz:course_rqz,
                                                                    baby_name:baby_name,
                                                                    pageNum:pageNum,
                                                                    pageTotal:pageTotal
                                                                    });
                                }
                    )
                }
            }).limit(pageSize).skip(offset).sort({'course_rq':-1});
});



router.get('/delete',function(req, res) {
    var course = {yxbz:'N',xgrq: Date.now()};
    var conditions = {_id:req.query.id};
    var update     = {$set : course};
    Course.update(conditions,update,function(err) {
        var msg = "";
        if (err) {
        }else {
        }
        res.redirect('/course/list');
    });

});


router.get('/add',function(req, res) {
    var pageNum = 1;
    var pageSize = 3;
    var offset = (pageNum-1)*pageSize;
    Baby.find({yxbz:'Y',course_count:{$gt: 0}},//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
        function (err, babies) {
            if (err) {
                res.render('course/add', {status:false,msg:err.toString()});
            }
            else {
                Baby.count({yxbz:'Y'},function(err,count) {
                    var pageTotal = Math.ceil(count / pageSize);
                    res.render('course/add', {status: true, babies: babies, pageNum: pageNum, pageTotal: pageTotal});
                })
            }
        }).limit(pageSize).skip(offset).sort({'lrrq':-1});

});


router.post('/add', function(req, res) {
    Baby.find({_id:{$in: req.body.baby_id}},function(err,baby_docs){
        if(err){
            res.render('course/add', { status:false,msg:err.toString()});
        }else if(!baby_docs){
            res.render('course/add', { status:false,msg: '没有获取到宝贝信息'});
        }else{
            var course_docs = [baby_docs.length];
            for ( var i = 0;i<baby_docs.length;i++) {
                course_docs[i] = new Course(
                    {
                        babyId:baby_docs[i]._id,
                        course_bh: req.body.course_rq+''+req.body.course_time,
                        course_rq: req.body.course_rq,
                        course_time:req.body.course_time,
                        baby_name:baby_docs[i].baby_name,
                        father:baby_docs[i].father,
                        mather:baby_docs[i].mather,
                        phone_no1:baby_docs[i].phone_no1
                    }
                );
            }
                Course.collection.insert(course_docs,function (err, docs) {
                    if (err) {
                        res.render('course/add', {status:false,msg:err.toString()});
                    } else {
                        var pageNum = 1;
                        var pageSize = 3;
                        var offset = (pageNum-1)*pageSize;
                    Baby.find({yxbz:'Y',course_count:{$gt: 0}},//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
                        function (err, babies) {
                            if (err) {
                                res.render('course/add', { status:false,msg:err.toString()});
                            }
                            else {
                                Baby.count({yxbz:'Y'},function(err,count) {
                                    var pageTotal = Math.ceil(count / pageSize);
                                    res.render('course/add', { status:true,msg:'保存记录卡成功',babies:babies,pageNum:pageNum, pageTotal: pageTotal});

                                })
                            }
                        }).limit(pageSize).skip(offset).sort({'lrrq':-1});
                        Baby.find({yxbz:'Y',course_count:{$gt: 0}},//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
                            function (err, babies) {
                                if (err) {
                                    res.render('course/add', { status:false,msg:err.toString()});
                                }
                                else {
                                    res.render('course/add', { status:true,msg:'保存记录卡成功',babies:babies,pageNum:pageNum});
                                }
                            }).limit(pageSize).skip(offset).sort({'lrrq':-1});

                    }
                }
            );


        }
    });

});


module.exports = router;
