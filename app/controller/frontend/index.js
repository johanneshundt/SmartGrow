const axios = require('axios')
const cheerio = require('cheerio')
const model = require('../../model')
const tools = require('../tools')


setInterval(tools.collectData,1000)
/*
fetchSeedfinder = async function(req,res){
	let baseUrl = 'https://de.seedfinder.eu/'
	let pages = ['1234567890','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	for(let page of pages){
		let url = baseUrl+'database/strains/alphabetical/'+page+'-all/';
		try {
			let {data} = await axios.get(url)
			let $ = cheerio.load(data)
			for(let row of $('#cannabis-strain-table tbody tr')){
				let strain = {
					name:$(row).find('th a').text(),
					breeder:$($(row).find('td')[0]).text(),
					sort:$($(row).find('td')[1]).find('img').attr('title'),
					location: {
						indoor:$($(row).find('td')[2]).find('img').attr('title').indexOf('Indoor') !== -1,
						outdoor:$($(row).find('td')[2]).find('img').attr('title').indexOf('Outdoor') !== -1
					},
					flowering_time:parseInt($($(row).find('td')[3]).find('span').text())||null,
					seed_types: {
						feminized: $($(row).find('td')[4]).find('img').attr('src').indexOf('fem_reg.gif') === -1,
						normal: $($(row).find('td')[4]).find('img').attr('src').indexOf('fem_fem.gif') === -1
					},
					available: !!$($(row).find('td')[5]).find('img').length,
					urls:{
						seedfinder:$(row).find('th a').attr('href').replace('../../../../',baseUrl),
						//breeder:String
					}
				}
				await model.strain.updateOne({'urls.seedfinder':strain.urls.seedfinder},strain,{upsert:true}).exec();
			}
		} catch (error) {
			console.error(error)
		}
		console.log(url)
	}
}
*/

getBreederInfo = async function(){
	//https://en.seedfinder.eu/api/json/ids.json?strains=1&ac=3f368a610ae22d50c6092ee2792872db
	let baseUrl = 'https://en.seedfinder.eu/api/json/ids.json?'
	let url = baseUrl+'strains=1&ac='+process.env.SEEDFINDER_API_KEY
	try {
		let {data} = await axios.get(url)
		console.log(data)
	} catch (error) {
		console.error(error)
	}
}
getStrainInfo = async function(breeder,name){
	//https://en.seedfinder.eu/api/json/strain.json?br=Royal_Queen_Seeds&str=Triple_G&ac=3f368a610ae22d50c6092ee2792872db&lng=de&parents=1&hybrids=1&medical=1&pics=1
	let baseUrl = 'https://de.seedfinder.eu/api/json/strain.json?'
	let url = baseUrl+'br='+breeder+'&str='+name+'&ac='+process.env.SEEDFINDER_API_KEY+'&lng=de&parents=1&hybrids=1&medical=1&pics=1'
	try {
		let {data} = await axios.get(url)
		console.log(data)
	} catch (error) {
		console.error(error)
	}


}




exports.index = async function(req,res){
	//getBreederInfo()
	//getStrainInfo('Royal_Queen_Seeds','Triple_G')

	let options = {
		settings: await model.settings.getSettings('Standard'),
		title:'Startseite'
	}
	res.renderHtml('index',options)
}