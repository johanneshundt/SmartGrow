const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StrainSchema = new Schema({
	name:String,
	breeder:String,
	sort:String,
	location: {
		indoor:Boolean,
		outdoor:Boolean
	},
	flowering_time:Number,
	seed_types: {
		feminized: Boolean,
		normal: Boolean
	},
	available: Boolean,
	urls: {
		seedfinder:String,
		breeder:String
	}
},{timestamps:true});

const Strain = module.exports = mongoose.model('Strain', StrainSchema, 'strain');