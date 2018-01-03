var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var course_Schema = new Schema({
    course_bh: String,
    course_rq: Date,
    course_time:String,
    course_lx:String,
    teachers:String,
    babyId:Schema.Types.ObjectId,
    baby_name:String,
    father:String,
    mather:String,
    phone_no1:String,
    yxbz:{type:String,default:'Y'},
    lrrq:{type:Date,default:Date.now},
    xgrq:{type:Date,default:Date.now}

});
exports.course = mongoose.model('course', course_Schema);