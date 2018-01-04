var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../models/dbConfig');
var Baby =  require('../models/baby').baby;
var router = express.Router();
mongoose.connect(dbConfig.dblink,dbConfig.userMongoClent);

// 后端使用 moment
// babies.forEach(function(baby){
//    console.log(moment(baby.birthday).format('YYYY-MM-DD'));
// });

/*
* 宝宝列表
* */
router.get('/list', function(req, res) {
    var searchparams = req.query.searchparams;
    var num = req.query.page;
    var pageNum = 0;
    var pageSize = 20;
    if ( num == undefined || num <= 1) {
        pageNum = 1;
    }else {
        pageNum = num;
    }
    var offset = (parseInt(pageNum)-1)*pageSize;
    var condition = {} ;
    if (searchparams==undefined||searchparams==""){
        condition = {yxbz:'Y'};
    }else {
        condition = {yxbz:'Y',$or:[{"baby_name":searchparams},
            {"phone_no1":searchparams},
            {"father":searchparams},
            {"mather":searchparams}]
        };
    };

    console.log(__dirname);
    Baby.find(condition,//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
                function (err, babies) {
                    if (err) {
                        res.render('baby/list', { msg:err.toString()});
                    }
                    else {
                        Baby.count(condition,
                                    function(err,count){
                                    var pageTotal =Math.ceil(count/pageSize);
                                    res.render('baby/list', {   status:true,
                                                                babies:babies,
                                                                searchparams:searchparams,
                                                                pageNum:pageNum,
                                                                pageTotal:pageTotal,
                                                                offset:offset,
                                        active_url:'baby/list'
                                                            });
                            }
                         )
                    }
                }).limit(pageSize).skip(offset).sort({'lrrq':-1});
});


/*
 * 添加宝宝
 */
router.get('/add',function(req, res) {
    res.render('baby/add', { });

});

router.post('/add', function(req, res) {
    var new_Baby = new Baby(
        {
            baby_name: req.body.baby_name,
            birthday: req.body.birthday,
            age:req.body.age,
            father:req.body.father,
            mather:req.body.mather,
            grandpa:req.body.grandpa,
            grandma:req.body.grandma,
            home_address:req.body.home_address,
            phone_no1:req.body.phone_no1,
            phone_no2:req.body.phone_no2,
            case:req.body.case,
            allergy:req.body.allergy,
            hobby:req.body.hobby,
            character:req.body.character,
            member_lx:req.body.member_lx,
            init_count:req.body.course_count,
            course_count:req.body.course_count
        }
    );
    new_Baby.save(function (err, baby) {
        if (err) {
        }else {
        }
        res.redirect('/baby/list');
    });
});



/*
* 宝宝按ID查询
* */
router.get('/modify/:id',function(req, res) {
    var baby = { _id: req.params.id};
    Baby.findOne(baby,function(err,doc){
        if(err){
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在
        }else{}
        res.render('baby/detail', { baby:doc});
    });
});



/*
* 宝宝按ID修改
* */
router.post('/modify',function(req, res) {
    var baby = {
        baby_name: req.body.baby_name,
        birthday: req.body.birthday,
        age:req.body.age,
        father:req.body.father,
        mather:req.body.mather,
        grandpa:req.body.grandpa,
        grandma:req.body.grandma,
        home_address:req.body.home_address,
        phone_no1:req.body.phone_no1,
        phone_no2:req.body.phone_no2,
        case:req.body.case,
        allergy:req.body.allergy,
        hobby:req.body.hobby,
        character:req.body.character,
        member_lx:req.body.member_lx,
        course_count: req.body.course_count,
        init_count:req.body.init_count,
        xgrq:Date.now()
    };
    var conditions = {_id:req.body._id};
    var update_content     = {$set : baby};
    Baby.update(conditions,update_content,function(err) {
        var msg = "";
        if (err) {
        }else {
        }
        res.redirect('/baby/list');
    });
});


/*
 * 宝宝按ID删除
 */
router.get('/delete',function(req, res) {
    var baby = {yxbz:'N',xgrq: Date.now()};
    var conditions = {_id:req.query.id};
    var update     = {$set : baby};
    Baby.update(conditions,update,function(err) {
        var msg = "";
        if (err) {
        }else {
        }
        res.redirect('/baby/list');
    });

});

module.exports = router;