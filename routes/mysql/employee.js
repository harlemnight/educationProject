var express = require('express');
var mysql = require('mysql');
var dbConfig = require('../../models/mysqlmodels/mysqldb');
var EmployeeSql = require('../../models/mysqlmodels/employeesql');
var router = express.Router();
var pool = mysql.createPool( dbConfig.mysql );

// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({     code:'-200',     msg: '操作失败'
        });
    } else {
        res.json(ret);
    }};


/*
* 员工列表
* */
router.get('/list', function(req, res) {
    pool.getConnection(function(err, connection) {
        var param = ['陈曦', '123456',33, '33836858@qq.com','深圳市南山区科技园南区R2-B三楼','17783119364',null,null,null];
        connection.query(EmployeeSql.insert, param, function(err, result) {
            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);
            // 释放连接
            connection.release();

        });
    });
});

module.exports = router;