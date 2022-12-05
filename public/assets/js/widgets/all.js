import * as i18n from '../i18n/all.js';
import * as Tools from '../tools/all.js';

//MAIN WIDGET CLASS
class Widget {
	text = false;
	element = false;
	isInitialized = false;
	i18Element = false;
	constructor(element,i18n,language=$('.container').attr('lang')||'de') {
		this.element = element;
		if(element.length){
			this.isInitialized = true;
			this.i18n(language,i18n);
		}
	}
	empty(value=true){
		if(value){
			this.element.addClass('empty')
		}
		else {
			this.element.removeClass('empty')
		}
	}
	on(status=true){
		if(status){
			this.element.addClass('on')
			this.element.removeClass('off')
		}
		else {
			this.element.addClass('off')
			this.element.removeClass('on')
		}
	}
	off(status=true){
		this.on(!status);
	}
	i18n(language='de',element=this.i18Element){
		let widget = this;
		widget.text = $.extend(true,{}, i18n['en'], i18n[language]||{});
		if(element){
			widget.i18Element = element;
			let parts = element.split('.');
			for(let part of parts){
				widget.text = widget.text?.[part]
			}
		}
		widget.element.find('[i18n]').each(function(){
			let parts = $(this).attr('i18n').split('.')
			let text = widget.text;
			for(let part of parts){
				text = text?.[part]
			}
			$(this).html(text)
		})
		widget.element.find('[i18nDate]').each(function(){
			let parts = $(this).attr('i18nDate').split('.')
			let format = widget.text;
			for(let part of parts){
				format = format?.[part]
			}
			let html = $(this).html()
			$(this).html(new Date(html).toLocaleDateString(format));
		})
		widget.element.find('[i18nTime]').each(function(){
			let parts = $(this).attr('i18nTime').split('.')
			let format = widget.text;
			for(let part of parts){
				format = format?.[part]
			}
			let html = $(this).html()
			$(this).html(new Date(html).toLocaleTimeString(format));
		})
	}
}

//WIDGET CLASSES
class Temperature extends Widget {
	data = [];
	range = 60;//60*60*24 = 24 hours
	options = {
		series: [],
		chart: {
			height: 175,
			type: 'line',
			zoom: {
				enabled: false
			},
			toolbar: {
				show: false
			},
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: 1000
				}
			}
		},
		theme: {
			monochrome: {
				enabled: true,
				color: '#ffffff',
				shadeTo: 'light',
				shadeIntensity: 0.65
			}
		},
		tooltip: {
			enabled:false
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			width: 1
		},
		xaxis: {
			type: 'datetime',
			range: 1000*this.range,
			labels: {
				rotate: -45,
				style: {
					colors: ['#fff'],
				}
			},
			tickAmount: 10
		},
		yaxis: {
			min: 15,
			max: 40,
			labels: {
				style: {
					colors: ['#fff'],
				},
				formatter: (value) => { return value+this.text.unit },
			},
			tickAmount: 5,
		},
		legend: {
			show: false
		}
	}
	constructor() {
		super($('.temperature_widget'),'widgets.temperature');
		if(this.isInitialized){
			this.loadChart()
		}
	}
	loadChart(){
		this.chart = new ApexCharts(document.querySelector("#temperatureChart"), this.options);
		this.chart.render();
	}
	update(value,timestamp){
		this.element.find('.value').html(value+this.text.unit)
		//update chart
		this.data.push({x:timestamp,y:value})
		//remove data when out of range
		if(this.data.length > this.range){
			this.data.splice(0, this.data.length - this.range);
		}
		//update chart
		this.chart.updateSeries([{
			data: this.data
		}])
	}
}
class Humidity extends Widget {
	data = [];
	range = 60;//60*60*24 = 24 hours
	options = {
		series: [],
		chart: {
			height: 175,
			type: 'line',
			zoom: {
				enabled: false
			},
			toolbar: {
				show: false
			},
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: 1000
				}
			}
		},
		theme: {
			monochrome: {
				enabled: true,
				color: '#ffffff',
				shadeTo: 'light',
				shadeIntensity: 0.65
			}
		},
		tooltip: {
			enabled:false
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			width: 1
		},
		xaxis: {
			type: 'datetime',
			range: 1000*this.range,
			labels: {
				rotate: -45,
				style: {
					colors: ['#fff'],
				}
			},
			tickAmount: 10
		},
		yaxis: {
			min: 30,
			max: 90,
			labels: {
				style: {
					colors: ['#fff'],
				},
				formatter: (value) => { return value+this.text.unit },
			},
			tickAmount: 6,
		},
		legend: {
			show: false
		}
	}
	constructor() {
		super($('.humidity_widget'),'widgets.humidity');
		if(this.isInitialized){
			this.loadChart()
		}
	}
	loadChart(){
		this.chart = new ApexCharts(document.querySelector("#humidityChart"), this.options);
		this.chart.render();
	}
	update(value,timestamp){
		this.element.find('.value').html(value+this.text.unit)
		//update chart
		this.data.push({x:timestamp,y:value})
		//remove data when out of range
		if(this.data.length > this.range){
			this.data.splice(0, this.data.length - this.range);
		}
		//update chart
		this.chart.updateSeries([{
			data: this.data
		}])
	}
}
class Stadium extends Widget {
	constructor() {
		super($('.stadium_widget'),'widgets.stadium');
	}
	update(name,start,end,countdown,progress){
		this.element.find('.name').html(name)
		this.element.find('.date').html(new Date(start).toLocaleDateString(this.text.dateFormat)+' - '+new Date(new Date(end).getTime()-1).toLocaleDateString(this.text.dateFormat))
		this.element.find('.countdown').html(countdown)
		this.element.find('.percentage').html(progress+'%')
	}
}
class Light extends Widget {
	constructor() {
		super($('.light_widget'),'widgets.light');
	}
	update(duration,start,end,countdown){
		this.element.find('.amount').html(duration)
		this.element.find('.time').html(start+' - '+end)
		this.element.find('.countdown').html(countdown)

	}
	updateSource(type,power,temperature,flux){
		this.element.find('.type').html(type)
		this.element.find('.power').html(power+' '+this.text.powerUnit)
		this.element.find('.colorTemperature').html(temperature+' '+this.text.temperatureUnit)
		this.element.find('.lightFlux').html(flux+' '+this.text.fluxUnit)
	}
}
class Fertilizer extends Widget {
	constructor() {
		super($('.fertilizer_widget'),'widgets.fertilizer');
	}
	update(name,amount,interval,next,countdown){
		this.element.find('.type').html(name)
		this.element.find('.amount').html(amount)
		this.element.find('.interval').html(interval+' '+this.text.intervalUnit)
		this.element.find('.next').html(new Date(next).toLocaleDateString(this.text.dateFormat)+' '+new Date(next).toLocaleTimeString())
		this.element.find('.countdown').html(countdown)
	}
}
class Water extends Widget {
	constructor() {
		super($('.water_widget'),'widgets.water');
	}
	update(amount,interval,duration,next,countdown) {
		this.element.find('.amount').html(amount.all)
		this.element.find('.amount_per_plant').html(amount.perPlant+'/'+this.text.plant)
		this.element.find('.interval').html(interval+' '+this.text.intervalUnit)
		this.element.find('.duration').html(this.text.duration+' '+duration)
		this.element.find('.next').html(new Date(next).toLocaleDateString(this.text.dateFormat)+' '+new Date(next).toLocaleTimeString())
		this.element.find('.countdown').html(countdown)
	}
}
class Clock extends Widget {
	constructor() {
		super($('.time_widget'),'widgets.clock');
	}
	update(date,calendarWeek,duration,next,countdown) {
		this.element.find('.time').html(new Date(date).toLocaleTimeString())
		this.element.find('.date').html(new Date(date).toLocaleDateString(this.text.dateFormat))
		this.element.find('.calendar_week').html(this.text.calendarWeek+' '+calendarWeek)
	}
}
class Parameters extends Widget {
	constructor() {
		super($('.parameters_widget'),'widgets.parameters');
	}
	update(place,filter,exhaust,fans,temperature,humidity,light,water,fertilizer,pot,soil) {
		this.element.find('.placeInfo').html(place.info)
		this.element.find('.placeValue').html(place.value)
		this.element.find('.filterInfo').html(filter.info)
		this.element.find('.filterValue').html(filter.value)
		this.element.find('.exhaustInfo').html(exhaust.info)
		this.element.find('.exhaustValue').html(exhaust.value)
		this.element.find('.fansInfo').html(fans.info)
		this.element.find('.fansValue').html(fans.value)
		this.element.find('.temperatureInfo').html(temperature.info)
		this.element.find('.temperatureValue').html(temperature.value)
		this.element.find('.humidityInfo').html(humidity.info)
		this.element.find('.humidityValue').html(humidity.value)
		this.element.find('.lightInfo').html(light.info)
		this.element.find('.lightValue').html(light.value)
		this.element.find('.waterInfo').html(water.info)
		this.element.find('.waterValue').html(water.value)
		this.element.find('.fertilizerInfo').html(fertilizer.info)
		this.element.find('.fertilizerValue').html(fertilizer.value)
		this.element.find('.potInfo').html(pot.info)
		this.element.find('.potValue').html(pot.value)
		this.element.find('.soilInfo').html(soil.info)
		this.element.find('.soilValue').html(soil.value)
	}
}
class Schedule extends Widget {
	constructor() {
		super($('.schedule_widget'),'widgets.schedule');
	}
	update(schedule) {
		let tbody = this.element.find('table tbody');
		tbody.html('')
		for(let stadium of schedule){
			tbody.append(`
					<tr class="${stadium.active?'active':''}">
						<th>${stadium.name}</th>
						<td>${(stadium.start!==stadium.end?new Date(stadium.start).toLocaleDateString(this.text.dateFormat)+' - ':'')+new Date(stadium.end).toLocaleDateString(this.text.dateFormat)}</td>
					</tr>
				`)
		}
	}
}
class Layout extends Widget {
	columns = 3;
	rows = 3;
	constructor() {
		super($('.layout_widget'),'widgets.layout');
		if(this.isInitialized){
			this.initSortable()
		}
	}
	set(columns,rows){
		this.columns = columns;
		this.rows = rows;
		this.resizeLayout();
	}
	update(id,plants) {
		let sortable = this.element.find('ul.sortable')
		sortable.data('layout',id);
		sortable.html('');
		for(let plant of plants){
			sortable.append(`
					<li class="ui-state-default plant" data-id="${plant.id}" data-modal="plant">
						<div class="text">${plant.text}</div>
						<div class="name">${plant.name}</div>
						<div class="breeder">${plant.breeder}</div>
						${plant.feminized?`<div class="feminized">${this.text.feminized}</div>`:''}
					</li>
				`);
		}
		this.resizeLayout()
	}
	resizeLayout(){
		let widgetWidth = this.element.outerWidth()
		let plantWidth = ((widgetWidth-(20*this.columns)-20)/this.columns)-2
		let plantHeight = ((widgetWidth-(20*this.rows)-20)/this.rows)-2
		if(Tools.checkMobile()){
			this.element.css({height:(plantHeight*this.rows)+40+'px'})
		}
		this.element.find('.plant').css({'width':plantWidth+'px',height:plantHeight+'px'})
	}
	initSortable(){
		let widget = this;
		this.element.find('.sortable').sortable({
			update: function() {
				let plants = [];
				widget.element.find('ul.sortable li').each(function(index,el){
					plants.push($(el).data('id'))
				})
				$.post('set/layout/'+widget.element.find('ul').data('layout'),{plants:plants})
			}
		}).disableSelection();
	}
}
class Buttons extends Widget {
	constructor() {
		super($('.buttons_widget'),'widgets.buttons');
	}
	update(status) {
		for(let name in status){
			if(status[name]){
				this.element.find('button.'+name).removeClass('off');
				this.element.find('button.'+name).addClass('on');
			}
			else {
				this.element.find('button.'+name).removeClass('on');
				this.element.find('button.'+name).addClass('off');
			}
		}
	}
}

//EXPORT
export let temperature = new Temperature();
export let humidity = new Humidity();
export let stadium = new Stadium();
export let light = new Light();
export let fertilizer = new Fertilizer();
export let water = new Water();
export let clock = new Clock();
export let parameters = new Parameters();
export let schedule = new Schedule();
export let layout = new Layout();
export let buttons = new Buttons();