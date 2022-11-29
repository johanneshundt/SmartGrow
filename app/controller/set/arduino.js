function getFakeData(min,max,increment=0.1,chance=0.1,lastFakeData){
	chance = chance*100
	let rand = Math.floor(Math.random() * (101 - 1) + 1);
	if (rand <= chance){
		if(rand % 2){ //is odd -> add increment
			lastFakeData += increment
			if(lastFakeData > max){
				lastFakeData -= increment*3
			}
		}
		else { //is even -> subtract increment
			lastFakeData -= increment
			if(lastFakeData < min){
				lastFakeData += increment*3
			}
		}
	}
	return Math.round(lastFakeData*10)/10
}

exports.toggleFan = async function(req,res){
	FAKEVALUES.status.fan = !FAKEVALUES.status.fan
	FAKEVALUES.protect.fan = true
	res.send(true)
}
exports.toggleExhaust = async function(req,res){
	FAKEVALUES.status.exhaust = !FAKEVALUES.status.exhaust
	FAKEVALUES.protect.exhaust = true
	res.send(true)
}
exports.toggleWater = async function(req,res){
	FAKEVALUES.status.water = !FAKEVALUES.status.water
	FAKEVALUES.protect.water = true
	res.send(true)
}
exports.toggleLight = async function(req,res){
	FAKEVALUES.status.light = !FAKEVALUES.status.light
	FAKEVALUES.protect.light = true
	res.send(true)
}

exports.getTemperature = function(){
	return FAKEVALUES.temperature = getFakeData(25,30,1,0.1,FAKEVALUES.temperature)//TODO: get live data
}
exports.getHumidity = function(){
	return FAKEVALUES.humidity = getFakeData(50,80,1,0.1,FAKEVALUES.humidity)//TODO: get live data
}
exports.getStatus = function(){
	//TODO: get live status
	return FAKEVALUES.status
}
exports.getProtected = function(){
	return FAKEVALUES.protect
}
exports.setStatus = function(name,value,protect=false){
	//TODO: set status on arduino pin...
	if(!FAKEVALUES.protect[name]){
		FAKEVALUES.status[name] = value
	}
	FAKEVALUES.protect[name] = protect
}
exports.protect = function(name,protect=true){
	FAKEVALUES.protect[name] = protect
}