const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SoilSchema = new Schema({
	supplier:String,
	name:String,
	package: {
		amount:Number,
		unit:String,
		costs:Number,
	},
	fertilized: Boolean,
	url: String,
	ean:String
},{timestamps:true});

const Soil = module.exports = mongoose.model('Soil', SoilSchema, 'soil');

