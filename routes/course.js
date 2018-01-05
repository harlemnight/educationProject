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
    var pageSize = 20;
    if ( num == undefined || num <= 1) {
        pageNum = 1;
    }else {
        pageNum = num;
    }
    var offset = (parseInt(pageNum)-1)*pageSize;
    var condition  = {yxbz:'Y'};
    if (!(baby_name==undefined||baby_name=="")) {
        condition.baby_name = baby_name ;
    }
    if(!(course_rqq==undefined||course_rqq=="") && !(course_rqz==undefined||course_rqz=="")) {
        condition.course_rq = {$gte: course_rqq,$lte: course_rqz};
    }else if (!(course_rqq==undefined||course_rqq=="")) {
        condition.course_rq = {$gte: course_rqq};
    }else if (!(course_rqz==undefined||course_rqz==""))  {
        condition.course_rq = {$lte: course_rqz};
    };

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
                                                                    pageTotal:pageTotal,
                                                                    offset:offset,
                                            active_url:'course/list'
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
        Course.findOneAndUpdate(conditions,update,function(err,cs_doc) {
            if (err) {
                res.render('course/list', { status:false,msg:err.toString()});
            }else if(!cs_doc) {
                res.render('course/list', { status:false,msg:'查找课程失败'});
            }else {
                    var conditions = {_id:cs_doc.babyId};
                    var update     = {$set : {xgrq: Date.now()} ,$inc:{init_count:1}};
                        Baby.update(conditions,update,function(err) {
                            if (err) {
                                res.render('course/list', { status:false,msg:'更新宝贝信息失败'});
                            }else {
                                res.redirect('/course/list');
                            }
                        });
            }
        });
});


router.get('/add',function(req, res) {

    var num = req.query.page;
    var pageNum = 0;
    var pageSize = 20;
    if ( num == undefined || num <= 1) {
        pageNum = 1;
    }else {
        pageNum = num;
    }
    var offset = (parseInt(pageNum)-1)*pageSize;
    var condition = {yxbz:'Y',init_count:{$gt: 0}};
    Baby.find(condition,//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
        function (err, babies) {
            if (err) {
                res.render('course/add', {status:false,msg:err.toString()});
            }
            else {
                Baby.count(condition,function(err,count) {
                    var pageTotal = Math.ceil(count / pageSize);
                    res.render('course/add', {  status: true,
                                                babies: babies,
                                                pageNum: pageNum,
                                                pageTotal: pageTotal,
                                                course_rq : req.query.course_rq,
                                                course_time : req.query.course_time,
                                                offset:offset,
                        active_url:'course/add'
                                             });
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
            };

            //这里由于采用非内嵌方式存储宝贝签到信息（多个文档），因此无法同时满足
            //不存在则写入，存在则更新
            //因此comment this code
            //采用内嵌数组的方式来存储宝贝签到信息
            Course.collection.insert(course_docs,function (err, docs) {
                    if (err) {
                        res.render('course/add', {status:false,msg:err.toString()});
                    } else {
                        Baby.update({_id:{$in: req.body.baby_id}},{$inc:{init_count:-1}},{multi:true} ,function(err) {
                            if (err) {
                            }else {
                                var pageNum = 1;
                                var pageSize = 20;
                                var offset = (pageNum-1)*pageSize;
                                Baby.find({yxbz:'Y',init_count:{$gt: 0}},//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
                                    function (err, babies) {
                                        if (err) {
                                            res.render('course/add', { status:false,msg:err.toString()});
                                        }
                                        else {
                                            Baby.count({yxbz:'Y',init_count:{$gt: 0}},function(err,count) {
                                                var pageTotal = Math.ceil(count / pageSize);
                                                res.render('course/add', {  status:true,
                                                    msg:'保存记录卡成功',
                                                    babies:babies,
                                                    pageNum:pageNum,
                                                    pageTotal: pageTotal,
                                                    course_rq : req.body.course_rq,
                                                    course_time : req.body.course_time,
                                                    offset:offset,
                                                    active_url:'course/add'
                                                });
                                            })
                                        }
                                    }).limit(pageSize).skip(offset).sort({'lrrq':-1});
                            }
                        });
                            }
                }
            );
        }
    });

});


module.exports = router;