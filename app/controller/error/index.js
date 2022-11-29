exports._500 = async function(req,res){
	let options = {
		title:'500',
		text:'Server error'
	}
	res.renderHtml('error',options)
}
exports._404 = async function(req,res){
	let options = {
		title:'404',
		text:'Page not found'
	}
	res.renderHtml('error',options)
}