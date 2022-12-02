const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FanSchema = new Schema({
	name: String,
	supplier: String,
	power:Number,
	size:Number,
	volume:Number,
	accounting: {
		cost:Number,
		usageTime:Number,
	},
},{timestamps:true});

const Fan = module.exports = mongoose.model('Fan', FanSchema, 'fan');