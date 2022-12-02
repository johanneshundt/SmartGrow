const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StadiumSchema = new Schema({
	name: String,
	temperature: {
		min:Number,
		max:Number
	},
	humidity: {
		min:Number,
		max:Number
	},
	place:{ type: Schema.Types.ObjectId, ref: 'Place' },
	exhaust:{ type: Schema.Types.ObjectId, ref: 'Exhaust' },
	filter:{ type: Schema.Types.ObjectId, ref: 'Filter' },
	fan:[{ type: Schema.Types.ObjectId, ref: 'Fan' }],
	light: {
		schedule: {
			on: {
				hour:Number,
				minute:Number,
				second: Number
			},
			off: {
				hour:Number,
				minute:Number,
				second: Number
			},
			interval:Number
		},
		source: { type: Schema.Types.ObjectId, ref: 'Light' }
	},
	water: {
		manual: Boolean,
		amount: Number,
		unit: String,
		time: {
			hour:Number,
			minute:Number,
			second: Number
		},
		interval: Number,
		source: { type: Schema.Types.ObjectId, ref: 'Water' }
	},
	fertilizer: {
		amount: Number,
		unit: String,
		schedule: {
			time: {
				hour:Number,
				minute:Number,
				second: Number
			},
			interval: Number
		},
		source: { type: Schema.Types.ObjectId, ref: 'Fertilizer' }
	},
	pot: { type: Schema.Types.ObjectId, ref: 'Pot' },
	soil: { type: Schema.Types.ObjectId, ref: 'Soil' },
	duration: Number,
},{timestamps:true});

const Stadium = module.exports = mongoose.model('Stadium', StadiumSchema, 'stadium');