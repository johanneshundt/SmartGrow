const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WaterUtilitiesSchema = new Schema({
	name:String,
	ean:String,
	flow:Number,
	adjustable:Boolean,
	url: String,
	image: String,
	accounting: {
		cost:Number,
		usageTime:Number,
	},
},{timestamps:true});

const WaterUtilities = module.exports = mongoose.model('WaterUtilities', WaterUtilitiesSchema, 'waterUtilities');
