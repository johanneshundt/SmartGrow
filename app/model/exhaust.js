const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ExhaustSchema = new Schema({
	name: String,
	supplier: String,
	power:Number,
	volume:Number,
	accounting: {
		cost:Number,
		usageTime:Number,
	},
},{timestamps:true});

const Exhaust = module.exports = mongoose.model('Exhaust', ExhaustSchema, 'exhaust');