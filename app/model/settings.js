const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SettingsSchema = new Schema({
	name: String,
	schedule:{type: Schema.Types.ObjectId, ref: 'Schedule'},
	layout:{type: Schema.Types.ObjectId, ref: 'Layout'},
},{timestamps:true});

const Setting = module.exports = mongoose.model('Setting', SettingsSchema, 'settings');

module.exports.getSettings = async function(name){
	return await Setting.findOne({name:name})
		.populate({
			path:'schedule',
			model:'Schedule',
			populate: {
				path:'stadium',
				model:'Stadium',
				populate: [
					{
						path:'light.source',
						model: 'Light'
					},
					{
						path:'fertilizer.source',
						model: 'Fertilizer'
					},
					{
						path:'water.source',
						model: 'Water'
					},
					{
						path:'pot',
						model: 'Pot',
						populate: {
							path: 'waterUtilities',
							model: 'WaterUtilities'
						}
					},
					{
						path:'soil',
						model: 'Soil'
					}
				]
			}
		})
		.populate({
			path:'layout',
			model:'Layout',
			populate:{
				path:'plants',
				model:'Plant',
				populate:{
					path:'strain',
					model:'Strain'
				}
			}
		})
		.exec()
}