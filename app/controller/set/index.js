const model = require('../../model')
exports.arduino = require('./arduino')



exports.settings = async function(req,res){
	let update = {
		electricityPrice:req.body.electricityPrice,
		waterPrice:req.body.waterPrice,
		language:req.body.language,
		theme:req.body.theme,
		background:req.body.background,
	}
	await model.settings.updateOne({_id:req.params.settings},update).exec();
	res.send(true)
}


exports.layout = async function(req,res){
	await model.layout.updateOne({_id:req.params.layout},{plants:req.body.plants}).exec();
	VALUES.layoutChanged = true; //TODO: set this in session
	res.send(true)
}
exports.plant = async function(req,res){
	let update = {
		text:req.body.text,
		strain:req.body.strain,
		feminized:!!req.body.feminized,
	}
	await model.plant.updateOne({_id:req.params.plant},update).exec()
	VALUES.layoutChanged = true;
	res.send(true)
}
exports.removePlantHistory = async function(req,res){
	let plant = await model.plant.findById(req.params.plant).exec()
	for(let key in plant.history){
		if(plant.history[key]._id.toString() === req.params.id.toString()){
			plant.history.splice(key,1);
			await plant.save();
		}
	}
	res.send(true)
}
exports.plantHistory = async function(req,res){
	let update = {
		date:req.body.date,
	}
	if(req.params.type === 'cut'){
		update.value = 'Pflanze beschnitten',
		update.icon = 'fa-scissors'
	}
	if(req.params.type === 'measure'){
		update.value = 'Pflanzenhöhe: '+req.body.value+' cm',
		update.icon = 'fa-ruler'
	}
	if(req.params.type === 'note'){
		update.value = req.body.value,
		update.icon = 'fa-notes'
	}
	await model.plant.updateOne({_id:req.params.plant},{ $addToSet: { history: update } }).exec()
	res.send(true)
}