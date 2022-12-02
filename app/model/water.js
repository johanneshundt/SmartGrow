const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WaterSchema = new Schema({
	supplier: String,
	model: String,
	utilities: [{ type: Schema.Types.ObjectId, ref: 'WaterUtilities' }],
},{timestamps:true});

const Water = module.exports = mongoose.model('Water', WaterSchema, 'water');