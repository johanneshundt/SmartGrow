const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PlantSchema = new Schema({
	strain: { type: Schema.Types.ObjectId, ref: 'Strain' },
	feminized:Boolean,
	text:String,
	costs:Number,
	history:[{
		date:Date,
		icon:String,
		value:String
	}]
},{timestamps:true});

const Plant = module.exports = mongoose.model('Plant', PlantSchema, 'plant');