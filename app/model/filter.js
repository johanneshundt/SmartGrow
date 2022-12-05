const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FilterSchema = new Schema({
	name: String,
	supplier: String,
	volume:Number,
	accounting: {
		cost:Number,
		usageTime:Number,
	},
	ean:String,
	url:String,
},{timestamps:true});

const Filter = module.exports = mongoose.model('Filter', FilterSchema, 'filter');