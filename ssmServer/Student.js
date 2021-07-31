const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SSM');
//定义规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    //    学号
    stunum: {
        type: String,
        required: true
    },
    // 姓名
    name: {
        type: String,
        required: true
    },
    // 入学时间
    admissiondate: {
        type: String,
        required: true
    },
    // 电话
    phone: {
        type: String,
        required: true
    },
    // 授课教师
    teacher: {
        type: String,
        required: true
    },
    // 所在班级
    class: {
        type: String,
        required: true
    },
    // 工作单位
    job: {
        type: String,
        required: true
    },
    // 薪资待遇
    money: {
        type: String,
        required: true
    },
})
module.exports = mongoose.model('Student', userSchema);

