var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var employee_Schema = new Schema({
    employee_id:String,
    employee_name: String,
    password: String,
    birthday: String,
    age:String,
    wexin:String,
    email:String,
    home_address:String,
    phone_no1:String,
    phone_no2:String,
    yxbz: { type: String, default: 'Y'},
    lrrq:{type:Date,default:Date.now},
    xgrq:{type:Date,default:Date.now}

});	//	定义了一个新的模型，但是此模式还未和employees集合有关联
exports.employee = mongoose.model('employee', employee_Schema); //	与employee集合关联