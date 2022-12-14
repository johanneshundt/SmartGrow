const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LightSchema = new Schema({
	supplier:String,
	name:String,
	colorTemperature: Number,
	lightFlux: Number,
	socket: String,
	power: Number,
	type: String,
	accounting: {
		cost:Number,
		usageTime:Number,
	},
},{timestamps:true});

const Light = module.exports = mongoose.model('Light', LightSchema, 'light');
