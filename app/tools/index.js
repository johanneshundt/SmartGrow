exports.payload = async function(req,options){
	let defaults = {
		url: req.path,
		base: '/'+req.path.split('/')[1],
		user:req.session,
		appTitle:'GMon'
	}
	return Object.assign({}, defaults, options)
}