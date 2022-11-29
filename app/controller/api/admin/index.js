const model = require('../../../model');

exports.auth  = async function(req, res, next) {
	if(req.session.adminID){
		let result = await model.admin.findById(req.session.adminID).exec();
		if(result){
			return next();
		}
	}
	else {
		res.send(false)
	}
}
exports.login = async function(req,res){
	let result = await model.admin.login(req.body.username,req.body.password)
	if(result){
		req.session.adminID = result._id;
		req.session.username = result.username;
		req.session.name = result.name;
		req.session.email = result.email;
		req.session.image = result.image;
		req.session.save();
		res.send(true)
	}
	else {
		res.send(false)
	}
}
exports.logout = async function(req,res){
	req.session.destroy();
	res.send(true)
}

exports.test = async function(req,res){
	res.send(true)
}