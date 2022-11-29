const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PotSchema = new Schema({
	shape: String,
	size: {
		height: {
			amount: Number,
			unit: String
		},
		width: {
			amount: Number,
			unit: String
		},
		diameter: {
			amount: Number,
			unit: String
		}
	},
	volume: {
		amount: Number,
		unit: String
	},
	waterUtilities:[{ type: Schema.Types.ObjectId, ref: 'WaterUtilities' }]
},{timestamps:true});

const Pot = module.exports = mongoose.model('Pot', PotSchema, 'pot');