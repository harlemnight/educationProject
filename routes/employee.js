var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../models/dbConfig');
var Employee =  require('../models/employee').employee;
var router = express.Router();
mongoose.connect(dbConfig.dblink,dbConfig.userMongoClent);

/*
 * 账户登录
 *
 */
router.get('/', function(req, res) {
    res.render('employee/login', { title: '登录'});
});


/*
 * 账户认证
 */

router.post('/login', function(req, res) {
    var login_employee = { employee_name: req.body.employee_name};
    var status = true;
    var msg = "";
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    Employee.findOne(login_employee,function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(err){
            //res.send(500);
            status = false;
            msg = "未知错误";
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在
            status = false;
            msg = login_employee.employee_name+" 账户不存在";
        }else{
            if(req.body.password != doc.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                status = false;
                msg = "密码错误";
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功

            }
        }

        if (status) {
            res.redirect('list');
        }else {
            res.render('employee/login', { title: '登录成功',msg:msg});
        }

    });
});

/*
* 账户列表
* */
router.get('/list', function(req, res) {
    var searchparams = req.query.searchparams;
    var num = req.query.page;
    var pageNum = 0;
    var pageSize = 10;
    if ( num == undefined || num <= 1) {
        pageNum = 1;
    }else {
        pageNum = num;
    }
    var offset = (parseInt(pageNum)-1)*pageSize;
    var condition
    if (searchparams==undefined||searchparams==""){
        condition = {yxbz:'Y'};
    }else {
        condition = {yxbz:'Y',$or:[{"employee_name":searchparams},
            {"phone_no1":searchparams}]
        };
    }

    Employee.find(condition,//这里是查询条件如果没有条件就是查询所有的数据，此参数可不传递  name: /周/
        function (err, employees) {
            if (err) {
                res.render('employee/list', { msg:err.toString()});
            }
            else {
                    Employee.count(condition,
                        function(err,count){
                            var pageTotal =Math.ceil(count/pageSize);
                            res.render('employee/list', {   status:true,
                                                            employees:employees,
                                                            searchparams:searchparams,
                                                            pageNum:pageNum,
                                                            pageTotal:pageTotal,
                                active_url:'employee/list'
                                                        });
                        }
                )
            }
        }).limit(pageSize).skip(offset).sort({'lrrq':-1});
});


/*
 * 账户添加
 */
router.get('/add',function(req, res) {
    res.render('employee/add', { });

});

router.post('/add', function(req, res) {
    var new_employee = new Employee(
        {
            employee_name: req.body.employee_name,
            password:req.body.password,
            birthday: req.body.birthday,
            age:req.body.age,
            wexin:req.body.wexin,
            email:req.body.email,
            home_address:req.body.home_address,
            phone_no1:req.body.phone_no1,
            phone_no2:req.body.phone_no2
        }
    );
    new_employee.save(function (err, employee) {
        if (err) {
        }else {
        }
        res.redirect('/employee/list');
    });
});



/*
* 账户按ID查询
* 通过href=/modify/59f0a634f934b125540f841b
* 的方式
* 注意获取参数的方式 req.params.id
* */
router.get('/modify/:id',function(req, res) {
    var login_employee = { _id: req.params.id};
    var status = true;
    var msg = "";
    Employee.findOne(login_employee,function(err,doc){
        if(err){
            msg = "未知错误";
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在
            status = false;
            msg = login_employee.employee_name+"账户不存在";
        }else{}
        res.render('employee/detail', { title: '修改账户',employee:doc});
    });
});



/*
* 账户按ID修改
* */
router.post('/modify',function(req, res) {
    var employee = {
            employee_name: req.body.employee_name,
            age:req.body.age,
            email:req.body.email,
            home_address:req.body.home_address,
            phone_no1:req.body.phone_no1,
            phone_no2:req.body.phone_no2,
            xgrq:Date.now()
    };
    var conditions = {_id:req.body._id};
    var update     = {$set : employee};
    Employee.update(conditions,update,function(err) {
        if (err) {
        }else {
        }
        res.redirect('/employee/list');
    });
});


/*
 * 账户按ID删除
 */
router.get('/delete',function(req, res) {
    var employee = {yxbz:'N',xgrq: Date.now()};
    var conditions = {_id:req.query.id};
    var update     = {$set : employee};
    Employee.update(conditions,update,function(err) {
        if (err) {
        }else {
        }
        res.redirect('/employee/list');
    });

});

module.exports = router;
