const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LayoutSchema = new Schema({
	plants:[{ type: Schema.Types.ObjectId, ref: 'Plant' }],
	cols:Number,
	rows:Number,
},{timestamps:true});

const Layout = module.exports = mongoose.model('Layout', LayoutSchema, 'layout');