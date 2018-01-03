var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var baby_Schema =  new Schema({
    baby_id:String,
    baby_name: String,
    birthday: Date,
    age:Number,
    father:String,
    mather:String,
    grandpa:String,
    grandma:String,
    home_address:String,
    phone_no1:String,
    phone_no2:String,
    photo:Buffer,//宝宝照片
    status:{ type:Number,default:0},
    /*
        0：未注册
        1：已注册
        2：已毕业
    */
    member_lx:String, //会员卡类型
    init_count:Number,//初始课程次数
    course_count: Number,//剩余课程次数
    case:String,//病史
    allergy:String,//过敏史
    hobby:String,//爱好
    character:String,//性格特征
    lrrq:{type:Date,default:Date.now},
    xgrq:{type:Date,default:Date.now},
    yxbz: { type:String, default:'Y'}

});	//	定义了一个新的模型，但是此模式还未和babys集合有关联
exports.baby = mongoose.model('baby', baby_Schema); //	与babys集合关联