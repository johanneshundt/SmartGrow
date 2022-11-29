const model = require('../model')

exports.renderError = function(message,req=null){
	log('renderError',message,req)
}
exports.log = function(message,req=null){
	log('log',message,req)
}
exports.debug = function(message,req=null){
	log('debug',message,req)
}
exports.info = function(message,req=null){
	log('info',message,req)
}
exports.warning = function(message,req=null){
	log('warning',message,req)
}
exports.error = function(message,req=null){
	log('error',message,req)
}
exports.critical = function(message,req=null){
	log('critical',message,req)
}

log = function(type,message,req=null){
	let doc = {
		type: type,
		message: message,
	}
	if(req){
		doc.req = {
			url:req._parsedUrl,
			method:req.method,
			statusCode:req.statusCode,
			statusMessage:req.statusMessage,
			params:req.params,
			query:req.query,
			body:req.body,
			session:req.session,
		}
	}
	model.log.create(doc)
}