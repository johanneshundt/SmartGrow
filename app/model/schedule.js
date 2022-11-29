const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ScheduleSchema = new Schema({
	name: String,
	stadium:[{type: Schema.Types.ObjectId, ref: 'Stadium'}],
	start:Date,
},{timestamps:true});

const Schedule = module.exports = mongoose.model('Schedule', ScheduleSchema, 'schedule');
