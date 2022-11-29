class SmartGrow {
	temperatureData = [];
	humidityData = [];
	temperatureRange = 60;//60*60*24, //24 hours
	humidityRange = 60;//60*60*24, //24 hours
	reopen = false;
	isMobile = false;
	constructor() {
		console.log('SmartGrow v0.0.1')
		this.checkMobile();
		this.eventHandler();
		this.initSortable();
		this.initTemperatureChart();
		this.initHumidityChart();
		this.initSocket();
	}
	checkMobile(){
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
			this.isMobile = true;
			$('.container').addClass('mobile')
		}
		else {
			$('.container').removeClass('mobile')
		}
	}
	resizeLayout(){
		if(this.isMobile){
			let widgetWidth = $('.layout_widget').outerWidth()
			let plantWidth = ((widgetWidth-40)/3)-2
			$('.layout_widget .plant').css({'width':plantWidth+'px',height:plantWidth+'px'})
			$('.layout_widget').css({height:(plantWidth*3)+40+'px'})
		}
	}
	eventHandler(){
		let plugin = this;
		$(document).on('click','li.plant',async function (){
			await plugin.loadPlant($(this).data('plant'))
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
		}).on('click','modal button.pot',async function (){
			plugin.reopen = $('form#plantForm').data('plant')
			await plugin.loadPot($(this).data('pot'))
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
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
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
		}).on('click','button.schedule',async function(){
			await plugin.loadSchedule();
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
		}).on('click','button.settings',async function(){
			await plugin.loadSettings();
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
		}).on('click','modal .close',async function (){
			if(plugin.reopen){
				await plugin.loadPlant(plugin.reopen)
				plugin.initSelect2();
				$('.container.mobile').css({overflow:'hidden'});
				$('modal').removeClass('hidden');
				plugin.reopen = false;
			}
			else {
				$('.container.mobile').css({overflow:'unset'});
				$('modal').html('').addClass('hidden')
			}
		}).on('click','alert button.ok, alert button.close',function (){
			$('alert').addClass('hidden')
		}).on('submit','form#plantForm',function (e){
			e.preventDefault();
			$.post('set/plant/'+$(this).data('plant'),$(this).serializeArray())
			$('.container.mobile').css({overflow:'unset'});
			$('modal').addClass('hidden')
		}).on('submit','form#historyCut',async function (e){
			e.preventDefault();
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/cut',$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
			$('alert').addClass('hidden')
		}).on('submit','form#historyNote',async function (e){
			e.preventDefault();
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/note',$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
			$('alert').addClass('hidden')
		}).on('submit','form#historyMeasure',async function (e){
			e.preventDefault();
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/measure',$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
			$('modal').removeClass('hidden');
			$('alert').addClass('hidden')
		}).on('click','.history .remove',async function (){
			await $.post('set/plant/'+$('form#plantForm').data('plant')+'/history/remove/'+$(this).data('id'),$(this).serializeArray())
			await plugin.loadPlant($('form#plantForm').data('plant'))
			plugin.initSelect2();
			$('.container.mobile').css({overflow:'hidden'});
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