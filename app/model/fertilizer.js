const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FertilizerSchema = new Schema({
	supplier: String,
	name: String,
	data: {
		n:Number,
		p:Number,
		k:Number
	},
	dilution: Number,
	package: {
		amount:Number,
		unit:String,
		costs:Number,
	},
	url: String
},{timestamps:true});

const Fertilizer = module.exports = mongoose.model('Fertilizer', FertilizerSchema, 'fertilizer');