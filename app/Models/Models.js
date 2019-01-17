//Require Mongoose

var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Models = new Schema({
Device:{type:String,unique:true},
model:Array
},{collection:'Models'});

// Compile model from schema
module.exports  = mongoose.model('Models', Models);
