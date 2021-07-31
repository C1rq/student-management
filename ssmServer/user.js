const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SSM');
//定义规则对象
var Schema =mongoose.Schema;
var userSchema = new Schema({
    username:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    nickname:{
        required:true,
        type:String
    },
    token:{
        required:true,
        type:String
    },
})
module.exports = mongoose.model('Menu', userSchema);

