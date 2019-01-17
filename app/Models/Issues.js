//Require Mongoose

var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Issues = new Schema({
Device:{type:String,unique:true},
Issue:Array
},{collection:'Issues'});

// Compile model from schema
module.exports  = mongoose.model('Issues', Issues);
