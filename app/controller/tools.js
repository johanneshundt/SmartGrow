const arduino = require("./set/arduino");
const model = require("../model");

exports.getCurrentStadium = async function (settings){
	let now = new Date().getTime()
	let startDate = new Date(settings.schedule.start);
	let active = false;
	let activeStadium = false;
	let activeStadiumStart = false;
	let activeStadiumEnd = false;
	for(let stadium of settings.schedule.stadium){
		if (!active){
			let start = new Date(startDate).setHours(0,0,0,0)
			let end = new Date(startDate.setDate(startDate.getDate() + stadium.duration)).setHours(0,0,0,0)+1000*60*60*24;
			active = (now >= start && now <= end);
			if (!stadium.duration && start === new Date().setHours(0,0,0,0)) {
				active = true;
			}
			if(stadium.duration){ //skip to next day if current stadium has a date range
				startDate.setDate(startDate.getDate()+1)
			}
			if(active){
				activeStadium = stadium
				activeStadiumStart = new Date(start);
				activeStadiumEnd = new Date(end);
				//console.log(activeStadiumStart.toLocaleDateString('fr-CH'),activeStadiumEnd.toLocaleDateString('fr-CH'))
			}
		}
	}
	return {
		current:activeStadium,
		start:activeStadiumStart,
		end:activeStadiumEnd
	}
}
exports.pad = function(number,length=2){
	while(number.toString().length < length){
		number = "0"+number;
	}
	return number;
}
exports.calculateCountdown = function(endDate,repeatInterval=0){
	let countDownDate = new Date(endDate).getTime();
	let now = new Date().getTime();
	let distance = countDownDate - now;
	if (distance < 0) {
		if(repeatInterval){
			while(distance < 0){
				distance += 1000*60*60*repeatInterval;
			}
		}
		else {
			return false;
		}
	}
	// Time calculations for days, hours, minutes and seconds
	let days = Math.floor(distance / (1000 * 60 * 60 * 24));
	let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((distance % (1000 * 60)) / 1000);
	// If the count down is finished, write some text
	let text = ``;
	if(days && days > 1){
		text += `${days} Tage, `
	}
	else if(days === 1){
		text += `${days} Tag, `
	}
	text += `${exports.pad(hours)}:${exports.pad(minutes)}:${exports.pad(seconds)}`
	return text
}
exports.calculatePercentage = function(start,end,current){
	let distance = end-start;
	let progress = current-start
	return Math.round(progress/(distance/100)*100)/100;
}
exports.calculateDuration = function(start,end){
	let startDate = new Date().setHours(start.hour,start.minute||0,start.second||0,0)
	let endDate = new Date().setHours(end.hour,end.minute||0,end.second||0,0)
	if(endDate <= startDate){
		endDate += 1000*60*60*24;
	}
	let distance = endDate-startDate
	// Time calculations for days, hours, minutes and seconds
	let days = Math.floor(distance / (1000 * 60 * 60 * 24));
	let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((distance % (1000 * 60)) / 1000);
	// If the count down is finished, write some text
	let text = ``;
	if(days && days > 1){
		text += `${days} Tage, `
	}
	else if(days === 1){
		text += `${days} Tag, `
	}
	text += `${exports.pad(hours)}:${exports.pad(minutes)}:${exports.pad(seconds)}`
	return text
}
exports.getTimeFromArray = function(array){
	return new Date().setHours(array.hour,array.minute||0,array.second||0,0)
}
exports.getCalendarWeek = function(){
	let dateTime = new Date();
	dateTime.setDate(dateTime.getDate() - ((dateTime.getDay() + 6) % 7) + 3);
	let n1stThursday = dateTime.valueOf();
	dateTime.setMonth(0, 1);
	if (dateTime.getDay() !== 4) {
		dateTime.setMonth(0, 1 + ((4 - dateTime.getDay()) + 7) % 7);
	}
	return 1 + Math.ceil((n1stThursday - dateTime) / 604800000);
}
exports.getNextDate = function(start,interval=24){
	let now = new Date().getTime()
	start = new Date(start).getTime()
	while(start <= now){
		start+=1000*60*60*interval
	}
	return new Date(start);
}
exports.isActive = function(start,end,interval=0){
	let now = new Date().getTime()
	start = new Date(start).getTime()
	end = new Date(end).getTime()
	if(start <= now && end > now){
		return true;
	}
	else if(now > end){
		if(!interval){
			return false;
		}
		while(now > end){
			start += 1000*60*60*interval;
			end += 1000*60*60*interval;
		}
		return start <= now && end > now

	}
	return false;
}

exports.collectData = async function(){
	let now = new Date()
	let status = arduino.getStatus()
	let protected = arduino.getProtected()
	let settings = await model.settings.getSettings('Standard');
	let stadium = await exports.getCurrentStadium(settings);
	//calculate next light times (on/off)
	let lightCountdownOn = exports.calculateCountdown(exports.getTimeFromArray(stadium.current.light.schedule.on),24)
	let lightCountdownOff = exports.calculateCountdown(exports.getTimeFromArray(stadium.current.light.schedule.off),24)
	//calculate watering data
	let waterTime = {}
	let flowAmount = 0;
	for(let utility of stadium.current.pot.waterUtilities){
		flowAmount += utility.flow
	}
	let totalSeconds = (60/(flowAmount/stadium.current.water.amount)*60)
	let waterStartDate = new Date(stadium.start).setHours(stadium.current.water.time.hour,stadium.current.water.time.minute,stadium.current.water.time.second,0)+(1000*60*60)
	let waterEndDate = waterStartDate+totalSeconds*1000;
	let waterOn = false;
	waterTime.hour = exports.pad(Math.floor(totalSeconds / 3600))
	totalSeconds %= 3600;
	waterTime.minute = exports.pad(Math.floor(totalSeconds / 60));
	waterTime.second = exports.pad(totalSeconds % 60);
	//automation
	//water
	if(exports.isActive(waterStartDate,waterEndDate,stadium.current.water.interval)){
		if(!status.water && !protected.water){
			waterOn = true;
			arduino.setStatus('water',true)
			status.water = true;
		}
		if(status.water && protected.water){
			arduino.protect('water',false)
		}
		waterOn = status.water;
	}
	else {
		if(status.water  && !protected.water){
			arduino.setStatus('water',false)
			status.water = false;
		}
		if(!status.water && protected.water){
			arduino.protect('water',false)
		}
	}
	//light
	if(exports.isActive(new Date().setHours(stadium.current.light.schedule.on.hour,stadium.current.light.schedule.on.minute,stadium.current.light.schedule.on.second,0),new Date().setHours(stadium.current.light.schedule.off.hour,stadium.current.light.schedule.off.minute,stadium.current.light.schedule.off.second,0),24)){
		if(!status.light && !protected.light){
			arduino.setStatus('light',true)
			status.light = true;
		}
		if(status.light && protected.light){
			arduino.protect('light',false)
		}
	}
	else {
		if(status.light  && !protected.light){
			arduino.setStatus('light',false)
			status.light = false;
		}
		if(!status.light && protected.light){
			arduino.protect('light',false)
		}
	}
	let data = {
		timestamp:new Date().getTime()+(1000*60*60),//add one hour to get correct time
		temperature:arduino.getTemperature(),
		humidity:arduino.getHumidity(),
		status:status,
		widgets:{}
	}
	//stadium
	data.widgets.stadium = {
		name:stadium.current.name,
		start:stadium.start,
		end:stadium.end,
		countdown:exports.calculateCountdown(new Date(stadium.end).setDate(stadium.end.getDate())),
		progress:exports.calculatePercentage(new Date(stadium.start).getTime(),new Date(stadium.end).getTime(),new Date().getTime())
	}
	//layout
	data.widgets.layout = {
		id:settings.layout._id,
		plants:[],
		changed:VALUES.layoutChanged //TODO: set this in session
	}
	//light
	data.widgets.light = {
		start:exports.pad(stadium.current.light.schedule.on.hour)+':'+exports.pad(stadium.current.light.schedule.on.minute),
		end:exports.pad(stadium.current.light.schedule.off.hour)+':'+exports.pad(stadium.current.light.schedule.off.minute),
		duration:exports.calculateDuration(stadium.current.light.schedule.on,stadium.current.light.schedule.off),
		countdown:new Date('01.01.2000 '+lightCountdownOn).getTime()<new Date('01.01.2000 '+lightCountdownOff).getTime()?lightCountdownOn:lightCountdownOff,
		source: stadium.current.light.source.supplier+' '+stadium.current.light.source.name+' ('+stadium.current.light.source.type+')',
		power: stadium.current.light.source.power,
		colorTemperature: stadium.current.light.source.colorTemperature,
		lightFlux: stadium.current.light.source.lightFlux
	}
	//water
	data.widgets.water = {
		amount: {
			all:stadium.current.water.amount*settings.layout.plants.length+' '+stadium.current.water.unit,
			perPlant:stadium.current.water.amount+' '+stadium.current.water.unit
		},
		duration:waterTime.hour+':'+waterTime.minute+':'+waterTime.second,
		interval:stadium.current.water.interval,
		next:exports.getNextDate(new Date().setHours(stadium.current.water.time.hour,stadium.current.water.time.minute,stadium.current.water.time.second,0),24),
		countdown:waterOn?exports.calculateCountdown(waterEndDate,24):exports.calculateCountdown(new Date().setHours(stadium.current.water.time.hour,stadium.current.water.time.minute,stadium.current.water.time.second,0),24)
	}
	//fertilizer
	if(stadium.current.fertilizer.source){
		data.widgets.fertilizer = {
			name:stadium.current.fertilizer?.source?.supplier+' '+stadium.current.fertilizer?.source?.name,
			amount:stadium.current.fertilizer?.amount*(stadium.current.water.amount*settings.layout.plants.length)+' '+stadium.current.fertilizer.unit,
			interval:stadium.current.fertilizer.schedule.interval,
			next:exports.getNextDate(new Date().setHours(stadium.current.fertilizer.schedule.time.hour,stadium.current.fertilizer.schedule.time.minute,stadium.current.fertilizer.schedule.time.second,0),stadium.current.fertilizer.schedule.interval),
			countdown:exports.calculateCountdown(new Date().setHours(stadium.current.fertilizer.schedule.time.hour,stadium.current.fertilizer.schedule.time.minute,stadium.current.fertilizer.schedule.time.second,0),stadium.current.fertilizer.schedule.interval),
		}
	}
	//parameters
	data.widgets.parameters = {
		temperature:{
			info:null,
			value:stadium.current.temperature.min+'°C - '+stadium.current.temperature.max+'°C'
		},
		humidity:{
			info:null,
			value:stadium.current.humidity.min+'% - '+stadium.current.humidity.max+'%'
		},
		light:{
			info:stadium.current.light.source.supplier+' '+stadium.current.light.source.name+' ('+stadium.current.light.source.type+' | '+stadium.current.light.source.power+'W)',
			value:exports.pad(stadium.current.light.schedule.on.hour)+':'+exports.pad(stadium.current.light.schedule.on.minute)+' - '+exports.pad(stadium.current.light.schedule.off.hour)+':'+exports.pad(stadium.current.light.schedule.off.minute)
		},
		water:{
			info:stadium.current.water.source.supplier+' '+stadium.current.water.source.model,
			value:stadium.current.water.amount+' '+stadium.current.water.unit+' / '+stadium.current.water.interval+' Stunden'
		},
		fertilizer:{
			info:stadium.current.fertilizer?.source?.supplier+' '+stadium.current.fertilizer?.source?.name,
			value:stadium.current.fertilizer.amount+' '+stadium.current.fertilizer.unit+' / 1L / '+stadium.current.fertilizer.schedule.interval+' Stunden'
		},
		pot:{
			info:stadium.current.pot.shape === 'Rechteckig'?stadium.current.pot.size.width.amount+stadium.current.pot.size.width.unit+' x '+stadium.current.pot.size.width.amount+stadium.current.pot.size.width.unit+' x '+stadium.current.pot.size.height.amount+stadium.current.pot.size.height.unit:'Ø '+stadium.current.pot.size.diameter.amount + stadium.current.pot.size.diameter.unit + ' x ' + stadium.current.pot.size.height.amount + stadium.current.pot.size.height.unit,
			value:stadium.current.pot.volume.amount+' '+stadium.current.pot.volume.unit
		},
		soil:{
			info:stadium.current.soil.supplier+' '+stadium.current.soil.name,
			value:stadium.current.pot.volume.amount+' '+stadium.current.pot.volume.unit
		}
	}
	//clock
	data.widgets.clock = {
		date:now,
		calendarWeek:exports.getCalendarWeek()
	}
	//schedules
	data.widgets.schedule = [];
	let scheduleStartDate = new Date(settings.schedule.start);
	for(let stadium of settings.schedule.stadium){
		let scheduleStart = new Date(scheduleStartDate)
		let scheduleEnd = new Date(scheduleStartDate.setDate(scheduleStartDate.getDate()-1 + stadium.duration));
		let scheduleActive = (now >= scheduleStart.getTime() && now <= scheduleEnd.getTime());
		data.widgets.schedule.push({
			name:stadium.name,
			start:scheduleStart,
			end:scheduleEnd,
			active:scheduleActive
		})
		scheduleStartDate = new Date(scheduleEnd.setDate(scheduleEnd.getDate()+1))
		if(stadium.duration){
			scheduleStartDate = new Date(scheduleEnd.setDate(scheduleEnd.getDate()+1))
			scheduleEnd = new Date(scheduleEnd.setDate(scheduleEnd.getDate()-1))
		}
	}
	//layout
	for(let plant of settings.layout.plants){
		data.widgets.layout.plants.push({
			id: plant._id,
			text: plant.text,
			name: plant.strain.name,
			breeder: plant.strain.breeder,
			feminized: plant.feminized
		})
	}
	//set layout.changed to false -> to prevent updating the layout when it's not changed
	VALUES.layoutChanged = false;
	//send data to client
	IO.emit('data', data);
}