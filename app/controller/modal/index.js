const model = require('../../model')
const tools = require('../tools')

exports.settings = {
	index: async function(req,res){
		let options = {
			settings: await model.settings.findOne({name:'Standard'}).exec()
		}
		res.renderHtml('modal/settings', options)
	},
	schedule: async function(req,res){
		res.renderHtml('modal/schedule', {})
	},
	layout: async function(req,res){
		res.renderHtml('modal/layout', {})
	},
	widgets: async function(req,res){
		res.renderHtml('modal/widgets', {})
	},
	inventory: {
		index: async function(req,res){
			res.renderHtml('modal/inventory', {})
		},
		place: async function(req,res){
			res.renderHtml('modal/inventory-place', {})
		},
		light: async function(req,res){
			res.renderHtml('modal/inventory-light', {})
		},
		fan: async function(req,res){
			res.renderHtml('modal/inventory-fan', {})
		},
		exhaust: async function(req,res){
			res.renderHtml('modal/inventory-exhaust', {})
		},
		filter: async function(req,res){
			let options = {
				filter: await model.filter.find().exec()
			}
			res.renderHtml('modal/inventory-filter', options)
		},
		pot: async function(req,res){
			let options = {
				pot: await model.pot.find().exec()
			}
			res.renderHtml('modal/inventory-pot', options)
		},
		soil: async function(req,res){
			let options = {
				soil: await model.soil.find().exec()
			}
			res.renderHtml('modal/inventory-soil', options)
		},
		fertilizer: async function(req,res){
			let options = {
				fertilizer: await model.fertilizer.find().exec()
			}
			res.renderHtml('modal/inventory-fertilizer', options)
		},
		water: async function(req,res){
			let options = {
				water: await model.water.find().populate({path:'utilities',model:'WaterUtilities'}).exec()
			}
			res.renderHtml('modal/inventory-water', options)
		}
	}
}



exports.costs = async function(req,res){
	let options = {
		costs: await tools.calculateOverallCosts('Standard')
	}
	res.renderHtml('modal/costs', options)
}
exports.stadium = async function(req,res){
	res.renderHtml('modal/stadium', {})
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


