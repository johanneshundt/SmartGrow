const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WaterUtilitiesSchema = new Schema({
	name:String,
	ean:String,
	flow:Number,
	adjustable:Boolean,
	url: String,
	image: String
},{timestamps:true});

const WaterUtilities = module.exports = mongoose.model('WaterUtilities', WaterUtilitiesSchema, 'waterUtilities');

WaterUtilities.create({
	"name": "Endtropfer",
	"ean": "4078500134002",
	"flow": 2,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/endtropfer/900907801/",
})
WaterUtilities.create({
	"name": "Endtropfer, druckausgleichend",
	"ean": "4078500831000",
	"flow": 2,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/endtropfer-druckausgleichend/901161001/",
})
WaterUtilities.create({
	"name": "Regulierbarer Endtropfer",
	"ean": "4078500139106",
	"flow": 10,
	"adjustable": true,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/regulierbarer-endtropfer/900914801/",
})
WaterUtilities.create({
	"name": "Regulierbarer Endtropfer",
	"ean": "4078500831604",
	"flow": 8,
	"adjustable": true,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/regulierbarer-endtropfer/966960701/",
})
WaterUtilities.create({
	"name": "Reihentropfer",
	"ean": "4078500834308",
	"flow": 2,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/reihentropfer/901164601/",
})
WaterUtilities.create({
	"name": "Reihentropfer",
	"ean": "4078500831109",
	"flow": 2,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/reihentropfer/901161201/",
})
WaterUtilities.create({
	"name": "Regulierbarer Reihentropfer",
	"ean": "4078500839204",
	"flow": 10,
	"adjustable": true,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/regulierbarer-reihentropfer/901167101/",
})
WaterUtilities.create({
	"name": "Regulierbarer Reihentropfer",
	"ean": "4078500831703",
	"flow": 8,
	"adjustable": true,
	"url": "https://www.gardena.com/de/produkte/bewasserung/micro-drip-system/regulierbarer-reihentropfer/966959701/",
})
