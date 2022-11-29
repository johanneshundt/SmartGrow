const model = require('../../../model')

exports.searchStrain = async function(req,res){
	let results = []
	if(!req.query.search || req.query.search.length < 3){
		res.send({results:[]})
		return false;
	}
	let strains = await model.strain.find({name: new RegExp(req.query.search, 'i')})
		.populate({path:'breeder',model:'Breeder'})
		.exec()
	if(strains){
		for(let strain of strains){
			results.push({id:strain._id,text:strain.name+' ('+strain.breeder.name+')'})
		}
	}
	res.send({results:results})
}