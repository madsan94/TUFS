var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Orders=new Schema({
    Order_Number:{type:String,unique:true},
    Order_Type:String,
    User_Id:String,
    Creation_Date:String,
    Status:String,
    Assigned:String,
    Price:String
},{"collection":"Orders"})

module.exports = mongoose.model('Orders',Orders);