const model = require('../../model')
const tools = require('../tools')

exports.settings = async function(req,res){
	res.renderHtml('modal/settings', {})
}
exports.schedule = async function(req,res){
	res.renderHtml('modal/schedule', {})
}
exports.layout = async function(req,res){
	res.renderHtml('modal/layout', {})
}
exports.widgets = async function(req,res){
	res.renderHtml('modal/widgets', {})
}


exports.plant = async function(req,res){
	let settings = await model.settings.getSettings('Standard');
	let stadium = (await tools.getCurrentStadium(settings)).current;
	let options = {
		plant: await model.plant.findById(req.params.plant).populate({path:'strain',model:'Strain',populate:{path:'breeder',model:'Breeder'}}).exec(),
		strains: await model.strain.find({},{breeder:true,name:true}).exec(),
		stadium: stadium
	}
	res.renderHtml('modal/plant', options)
}
exports.pot = async function(req,res){
	let options = {
		reopen: req.query.reopen||null,
		pot: await model.pot.findById(req.params.pot).exec(),
	}
	res.renderHtml('modal/pot', options)
}
exports.camera = async function(req,res){
	res.renderHtml('modal/camera', {})
}

//ALERTS
exports.addFertilizer = async function(req,res){
	//TODO: get current phase, get fertilizer amount
	res.renderHtml('modal/alert/addFertilizer', {})
}
exports.changeLight = async function(req,res){
	//TODO: get current phase, get light
	res.renderHtml('modal/alert/changeLight', {})
}
exports.changePotAndSoil = async function(req,res){
	//TODO: get current phase, get pot, get soil
	res.renderHtml('modal/alert/changePotAndSoil', {})
}
exports.changePot = async function(req,res){
	//TODO: get current phase, get pot
	res.renderHtml('modal/alert/changePot', {})
}
exports.changeSoil = async function(req,res){
	//TODO: get current phase, get soil
	res.renderHtml('modal/alert/changeSoil', {})
}


