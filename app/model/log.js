const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LogSchema = new Schema({
	type:String,
	message:String,
	req:{},
},{timestamps:true});

module.exports = mongoose.model('Log', LogSchema, 'logs');