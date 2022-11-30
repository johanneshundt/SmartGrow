const model = require('../../model')
const tools = require('../tools')


exports.fertilizer = async function(req,res){
	let settings = await model.settings.getSettings('Standard');
	let stadium = (await tools.getCurrentStadium(settings)).current;
	let options = {
		fertilizer: stadium.fertilizer,
		waterAmount: stadium.water?.amount?stadium.water.amount*settings.layout.plants.length:1,
	}
	res.renderHtml('alert/fertilizer', options)
}
exports.cut = async function(req,res){
	let options = {
		plant: await model.plant.findById(req.params.plant).populate({path:'strain',model:'Strain',populate:{path:'breeder',model:'Breeder'}}).exec(),
	}
	res.renderHtml('alert/cut', options)
}
exports.measure = async function(req,res){
	let options = {
		plant: await model.plant.findById(req.params.plant).populate({path:'strain',model:'Strain',populate:{path:'breeder',model:'Breeder'}}).exec(),
	}
	res.renderHtml('alert/measure', options)
}
exports.note = async function(req,res){
	let options = {
		plant: await model.plant.findById(req.params.plant).populate({path:'strain',model:'Strain',populate:{path:'breeder',model:'Breeder'}}).exec(),
	}
	res.renderHtml('alert/note', options)
}