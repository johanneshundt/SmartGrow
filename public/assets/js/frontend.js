class SmartGrow {
	temperatureData = [];
	humidityData = [];
	temperatureRange = 60;//60*60*24, //24 hours
	humidityRange = 60;//60*60*24, //24 hours
	reopen = false;
	constructor() {
		console.log('SmartGrow v0.0.1')
		this.eventHandler();
		this.initSortable();
		this.initTemperatureChart();
		this.initHumidityChart();
		this.initSocket();
	}
	resizeLayout(){
		if($('.container').hasClass('mobile')){
			console.log('mobile')
			let widgetWidth = $('.layout_widget').outerWidth()
			let plantWidth = ((widgetWidth-40)/3)-2
			console.log(widgetWidth,plantWidth)
			$('.layout_widget .plant').css({'width':plantWidth+'px',height:plantWidth+'px'})
			$('.layout_widget').css({height:(plantWidth*3)+40+'px'})


		}
	}
	eventHandler(){
		let plugin = this;
		$(document).on('click','li.plant',async function (){
			await plugin.loadPlant($(this).data('plant'))
			plugin.initSelect2();
			$('modal').removeClass('hidden');
		}).on('click','modal button.pot',async function (){
			plugin.reopen = $('form#plantForm').data('plant')
			await plugin.loadPot($(this).data('pot'))
			plugin.initSelect2();
			$('modal').removeClass('hidden');
		}).on('click','modal button.cut',async function (){
			plugin.loadAlert('cut');
		}).on('click','modal button.measure',async function (){
			plugin.loadAlert('measure');
		}).on('click','modal button.note',async function (){
			plugin.loadAlert('note');
		}).on('click','button.fan',function(){
			$.get('set/fan')
		}).on('click','button.exhaust',function(){
			$.get('set/exhaust')
		}).on('click','button.water',function(){
			$.get('set/water')
		}).on('click','button.light',function(){
			$.get('set/light')
		}).on('click','button.camera',async function(){
			await plugin.loadCamera();
			plugin.initSelect2();
			$('modal').removeClass('hidden');
		}).on('click','button.schedule',async function(){
			await plugin.loadSchedule();
			plugin.initSelect2();
			$('modal').removeClass('hidden');
		}).on('click','button.settings',async function(){
			await plugin.loadSettings();
			plugin.initSelect2();
			$('modal').removeClass('hidden');
		}).on('click','modal .close',async function (){
			if(plugin.reopen){
				await plugin.loadPlant(plugin.reopen)
				plugin.initSelect2();
				$('modal').removeClass('hidden');
				plugin.reopen = false;
			}
			else {
				$('modal').html('').addClass('hidden')
			}
		}).on('click','alert button.ok, alert button.close',function (){
			$('alert').addClass('hidden')
		}).on('submit','form#plantForm',function (e){
			e.preventDefault();
			$.post('set/plant/'+$(this).data('plant'),$(this).serializeArray())
			$('modal').addClass('hidden')
		}).on('submit','form#historyCut',async function (e){
			e.preventDefault();
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/cut',$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('modal').removeClass('hidden');
			$('alert').addClass('hidden')
		}).on('submit','form#historyNote',async function (e){
			e.preventDefault();
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/note',$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('modal').removeClass('hidden');
			$('alert').addClass('hidden')
		}).on('submit','form#historyMeasure',async function (e){
			e.preventDefault();
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/measure',$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('modal').removeClass('hidden');
			$('alert').addClass('hidden')
		}).on('click','.history .remove',async function (){
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/remove/'+$(this).data('id'),$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('modal').removeClass('hidden');
		})
	}
	loadAlert(name){
		switch (name) {
			case 'cut':
				$('alert form.alertForm').attr('id','historyCut')
				$('alert .content .icon').html('<i class="fa-duotone fa-scissors"></i>')
				$('alert .content .message').html(`<h2>Pflanze beschneiden</h2><h4>Datum</h4><input name="date" type="date" value="${new Date().toLocaleDateString('en-CA')}">`)
				$('alert .content .image').html('')
				$('alert .content .buttons').html(`
					<button type="button" class="close">Abbrechen</button>
					<button type="submit" class="save">Speichern</button>`)
				break;
			case 'measure':
				$('alert form.alertForm').attr('id','historyMeasure')
				$('alert .content .icon').html('<i class="fa-duotone fa-ruler"></i>')
				$('alert .content .message').html(`<h2>Pflanze messen</h2><h4>Datum</h4><input name="date" type="date" value="${new Date().toLocaleDateString('en-CA')}"><h4>Höhe</h4><div class="inputGroup"><input name="value" type="number"><span>cm</span></div>`)
				$('alert .content .image').html('')
				$('alert .content .buttons').html(`
					<button type="button" class="close">Abbrechen</button>
					<button type="submit" class="save">Speichern</button>`)
				break;
			case 'note':
				$('alert form.alertForm').attr('id','historyNote')
				$('alert .content .icon').html('<i class="fa-duotone fa-notes"></i>')
				$('alert .content .message').html(`<h2>Notiz hinzufügen</h2><h4>Datum</h4><input name="date" type="date" value="${new Date().toLocaleDateString('en-CA')}"><h4>Notiz</h4><textarea name="value"></textarea>`)
				$('alert .content .image').html('')
				$('alert .content .buttons').html(`
					<button type="button" class="close">Abbrechen</button>
					<button type="submit" class="save">Speichern</button>`)
				break;
		}
		$('alert').removeClass('hidden')
	}
	initSocket(){
		let plugin = this;
		let socket = io();
		socket.on('data', function(data) {
			//update temperature
			$('.temperature_widget .value').html(data.temperature+'°C')
			//update temperature chart data
			plugin.temperatureData.push({x:data.timestamp,y:data.temperature})
			if(plugin.temperatureData.length > plugin.temperatureRange){
				plugin.temperatureData.splice(0, plugin.temperatureData.length - plugin.temperatureRange);
			}
			plugin.temperatureChart.updateSeries([{
				data: plugin.temperatureData
			}])
			//update humidity
			$('.humidity_widget .value').html(data.humidity+'%')
			//update humidity chart data
			plugin.humidityData.push({x:data.timestamp,y:data.humidity})
			if(plugin.humidityData.length > plugin.humidityRange){
				plugin.humidityData.splice(0, plugin.humidityData.length - plugin.humidityRange);
			}
			plugin.humidityChart.updateSeries([{
				data: plugin.humidityData
			}])
			//set status
			for(let name in data.status){
				if(data.status[name]){
					$('.buttons_widget button.'+name).removeClass('off');
					$('.buttons_widget button.'+name).addClass('on');
				}
				else {
					$('.buttons_widget button.'+name).removeClass('on');
					$('.buttons_widget button.'+name).addClass('off');
				}
			}
			//update stadium
			if(data.widgets.stadium){
				$('.stadium_widget').removeClass('empty')
				$('.stadium_widget .name').html(data.widgets.stadium.name)
				$('.stadium_widget .date').html(new Date(data.widgets.stadium.start).toLocaleDateString('fr-CH')+' - '+new Date(new Date(data.widgets.stadium.end).getTime()-1).toLocaleDateString('fr-CH'))
				$('.stadium_widget .countdown').html(data.widgets.stadium.countdown)
				$('.stadium_widget .percentage').html(data.widgets.stadium.progress+'%')
			}
			else {
				$('.stadium_widget').addClass('empty')
			}
			//update light
			if(data.widgets.light){
				if(data.status.light){
					$('.light_widget').addClass('on')
					$('.light_widget').removeClass('off')
				}
				else {
					$('.light_widget').addClass('off')
					$('.light_widget').removeClass('on')
				}
				$('.light_widget').toggleClass('on',data.status.light)
				$('.light_widget').removeClass('empty')
				$('.light_widget .amount').html(data.widgets.light.duration)
				$('.light_widget .time').html(data.widgets.light.start+' - '+data.widgets.light.end)
				$('.light_widget .countdown').html(data.widgets.light.countdown)
				$('.light_widget .type').html(data.widgets.light.source)
				$('.light_widget .power').html(data.widgets.light.power+' W')
				$('.light_widget .colorTemperature').html(data.widgets.light.colorTemperature+' K')
				$('.light_widget .lightFlux').html(data.widgets.light.lightFlux+' L')
			}
			else {
				$('.light_widget').addClass('empty')
			}
			//update fertilizer
			if(data.widgets.fertilizer){
				$('.fertilizer_widget').removeClass('empty')
				$('.fertilizer_widget .type').html(data.widgets.fertilizer.name)
				$('.fertilizer_widget .amount').html(data.widgets.fertilizer.amount)
				$('.fertilizer_widget .interval').html(data.widgets.fertilizer.interval+' Stunden')
				$('.fertilizer_widget .next').html(new Date(data.widgets.fertilizer.next).toLocaleDateString('fr-CH')+' '+new Date(data.widgets.fertilizer.next).toLocaleTimeString())
				$('.fertilizer_widget .countdown').html(data.widgets.fertilizer.countdown)
			}
			else {
				$('.fertilizer_widget').addClass('empty')
			}
			//update water
			if(data.widgets.water){
				if(data.status.water){
					$('.water_widget').addClass('on')
					$('.water_widget').removeClass('off')
				}
				else {
					$('.water_widget').addClass('off')
					$('.water_widget').removeClass('on')
				}
				$('.water_widget').removeClass('empty')
				$('.water_widget .amount').html(data.widgets.water.amount.all)
				$('.water_widget .amount_per_plant').html(data.widgets.water.amount.perPlant+'/Pflanze')
				$('.water_widget .interval').html(data.widgets.water.interval+' Stunden')
				$('.water_widget .duration').html('Dauer: '+data.widgets.water.duration)
				$('.water_widget .next').html(new Date(data.widgets.water.next).toLocaleDateString('fr-CH')+' '+new Date(data.widgets.water.next).toLocaleTimeString())
				$('.water_widget .countdown').html(data.widgets.water.countdown)
			}
			else {
				$('.water_widget').addClass('empty')
			}
			//update parameters
			if(data.widgets.parameters){
				$('.parameters_widget').removeClass('empty')
				$('.parameters_widget .temperatureInfo').html(data.widgets.parameters.temperature.info)
				$('.parameters_widget .temperatureValue').html(data.widgets.parameters.temperature.value)
				$('.parameters_widget .humidityInfo').html(data.widgets.parameters.humidity.info)
				$('.parameters_widget .humidityValue').html(data.widgets.parameters.humidity.value)
				$('.parameters_widget .lightInfo').html(data.widgets.light?data.widgets.parameters.light.info:'')
				$('.parameters_widget .lightValue').html(data.widgets.light?data.widgets.parameters.light.value:'')
				$('.parameters_widget .waterInfo').html(data.widgets.water?data.widgets.parameters.water.info:'')
				$('.parameters_widget .waterValue').html(data.widgets.water?data.widgets.parameters.water.value:'')
				$('.parameters_widget .fertilizerInfo').html(data.widgets.fertilizer?data.widgets.parameters.fertilizer.info:'')
				$('.parameters_widget .fertilizerValue').html(data.widgets.fertilizer?data.widgets.parameters.fertilizer.value:'')
				$('.parameters_widget .potInfo').html(data.widgets.parameters.pot.info)
				$('.parameters_widget .potValue').html(data.widgets.parameters.pot.value)
				$('.parameters_widget .soilInfo').html(data.widgets.parameters.soil.info)
				$('.parameters_widget .soilValue').html(data.widgets.parameters.soil.value)
			}
			else {
				$('.parameters_widget').addClass('empty')
			}
			//update clock
			if(data.widgets.clock){
				$('.time_widget').removeClass('empty')
				$('.time_widget .time').html(new Date(data.widgets.clock.date).toLocaleTimeString())
				$('.time_widget .date').html(new Date(data.widgets.clock.date).toLocaleDateString('fr-CH'))
				$('.time_widget .calendar_week').html('KW '+data.widgets.clock.calendarWeek)
			}
			else {
				$('.time_widget').addClass('empty')
			}
			//update schedule
			if(data.widgets.schedule){
				$('.schedule_widget').removeClass('empty')
				$('.schedule_widget table tbody').html('')
				for(let stadium of data.widgets.schedule){
					$('.schedule_widget table tbody').append(`
					<tr class="${stadium.active?'active':''}">
						<th>${stadium.name}</th>
						<td>${(stadium.start!==stadium.end?new Date(stadium.start).toLocaleDateString('fr-CH')+' - ':'')+new Date(stadium.end).toLocaleDateString('fr-CH')}</td>
					</tr>
				`)
				}
			}
			else {
				$('.schedule_widget').addClass('empty')
			}
			//update layout if layout has changed
			if(data.widgets.layout && data.widgets.layout.changed){
				$('.layout_widget').removeClass('empty')
				$('.layout_widget ul.sortable').html('').data('layout',data.widgets.layout.id);
				for(let plant of data.widgets.layout.plants){
					$('.layout_widget ul.sortable').append(`
					<li class="ui-state-default plant" data-plant="${plant.id}">
						<div class="text">${plant.text}</div>
						<div class="name">${plant.name}</div>
						<div class="breeder">${plant.breeder}</div>
						${plant.feminized?`<div class="feminized">Feminisiert</div>`:''}
					</li>
				`);
				}
				plugin.resizeLayout()
			}
			else if(!data.widgets.layout) {
				$('.layout_widget').addClass('empty')
			}
		});
	}
	initTemperatureChart(){
		let options = {
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
				range: 1000*this.temperatureRange,
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
					formatter: (value) => { return value+'°C' },
				},
				tickAmount: 5,
			},
			legend: {
				show: false
			}
		};
		this.temperatureChart = new ApexCharts(document.querySelector("#temperatureChart"), options);
		this.temperatureChart.render();
	}
	initHumidityChart(){
		let options = {
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
				range: 1000*this.humidityRange,
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
					formatter: (value) => { return value+'%' },
				},
				tickAmount: 6,
			},
			legend: {
				show: false
			}
		};
		this.humidityChart = new ApexCharts(document.querySelector("#humidityChart"), options);
		this.humidityChart.render();
	}
	initSortable(){
		$( '.sortable' ).sortable({
			update: function() {
				let plants = [];
				$('.layout_widget ul.sortable li').each(function(index,element){
					plants.push($(element).data('plant'))
				})
				$.post('set/layout/'+$('.layout_widget ul').data('layout'),{plants:plants})
			}
		}).disableSelection();
	}
	initSelect2(){
		$('.select2').select2();
	}

	async loadPlant(plant){
		let html = await $.get('modal/plant/'+plant)
		$('modal').html(html)
	}
	async loadPot(pot){
		let html = await $.get('modal/pot/'+pot)
		$('modal').html(html)
	}
	async loadCamera(){
		let html = await $.get('modal/camera')
		$('modal').html(html)
	}
	async loadSchedule(){
		let html = await $.get('modal/schedule')
		$('modal').html(html)
	}
	async loadSettings(){
		let html = await $.get('modal/settings')
		$('modal').html(html)
	}
}
window.SG = new SmartGrow();