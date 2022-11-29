const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BreederSchema = new Schema({
	_id:String,
	name:String,
	logo:String
},{timestamps:true});

const Breeder = module.exports = mongoose.model('Breeder', BreederSchema, 'breeder');
