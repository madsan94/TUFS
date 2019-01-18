var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Models = new Schema({
Device:{type:String,unique:true},
model:Array
},{collection:'Models'});
module.exports  = mongoose.model('Models', Models);
