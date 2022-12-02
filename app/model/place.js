const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PlaceSchema = new Schema({
	name: String,
	supplier: String,
	size: {
		length:Number,
		width:Number,
		height:Number
	},
	accounting: {
		cost:Number,
		usageTime:Number,
	},
},{timestamps:true});

const Place = module.exports = mongoose.model('Place', PlaceSchema, 'place');
