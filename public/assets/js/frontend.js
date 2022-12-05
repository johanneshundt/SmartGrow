import * as Widgets from './widgets/all.js';
import * as Tools from './tools/all.js';

class SmartGrow {
	constructor() {
		console.log('SmartGrow v0.0.1')
		this.eventHandler();
		this.initSocket();
	}
	eventHandler(){
		$(document)
			.on('click','[data-set]',function(){
				$.get('set/'+$(this).data('set'))
			})
			.on('submit','form',async function (e){
				e.preventDefault();
				let url = $(this).attr('action');
				let data = $(this).serializeArray();
				await $.post(url,data)
				if($(this).data('reopen-url')){
					Tools.modal.reopen = {url:$(this).data('reopen-url'),data:$(this).data('reopen-data')}
					await Tools.modal.close()
				}
			})
			.on('submit','.reload',async function (e){
				window.location.reload();
			})
			.on('click','[data-delete]',async function (e){
				e.preventDefault();
				let url = $(this).data('delete');
				await $.ajax({
					method: "DELETE",
					url: url,
				})
				if($(this).data('reopen-url')){
					Tools.modal.reopen = {url:$(this).data('reopen-url'),data:$(this).data('reopen-data')}
					await Tools.modal.close();
				}
			})
			.on('keyup','thead th.search input',this.searchTable)

	}
	searchTable(event){
		let query = $(event.currentTarget).val().toLowerCase();
		let table = $(event.currentTarget).closest('table').first()
		table.find('tr.searchable').each(function(){
			let row = $(this);
			let hidden = true;
			row.find('td,th').each(function(){
				$(this).unmark()
				if($(this).text().toLowerCase().indexOf(query) !== -1){
					$(this).mark(query)
					hidden = false;
				}
			})
			if(hidden){
				row.addClass('hidden')
			}
			else {
				row.removeClass('hidden')
			}
		})
	}
	initSocket(){
		let socket = io();
		socket.on('data', function(data) {
			//widgets
			if(Widgets.temperature && Widgets.temperature.isInitialized){
				if(data.temperature) {
					Widgets.temperature.empty(false)
					Widgets.temperature.update(data.temperature, data.timestamp)
				}
				else {
					Widgets.temperature.empty(true)
				}
			}
			if(Widgets.humidity && Widgets.humidity.isInitialized){
				if(data.humidity) {
					Widgets.humidity.empty(false)
					Widgets.humidity.update(data.humidity, data.timestamp)
				}
				else {
					Widgets.humidity.empty(true)
				}
			}
			if(Widgets.stadium && Widgets.stadium.isInitialized){
				if(data.widgets.stadium){
					Widgets.stadium.empty(false)
					Widgets.stadium.update(data.widgets.stadium.name,data.widgets.stadium.start,data.widgets.stadium.end,data.widgets.stadium.countdown,data.widgets.stadium.progress)
				}
				else {
					Widgets.stadium.empty(true)
				}
			}
			if(Widgets.light && Widgets.light.isInitialized){
				Widgets.light.on(data.status.light)
				if(data.widgets.light){
					Widgets.light.empty(false)
					Widgets.light.update(data.widgets.light.duration,data.widgets.light.start,data.widgets.light.end,data.widgets.light.countdown)
					Widgets.light.updateSource(data.widgets.light.source,data.widgets.light.power,data.widgets.light.colorTemperature,data.widgets.light.lightFlux)
				}
				else {
					Widgets.light.empty(true)
				}
			}
			if(Widgets.fertilizer && Widgets.fertilizer.isInitialized){
				if(data.widgets.fertilizer){
					Widgets.fertilizer.empty(false)
					Widgets.fertilizer.update(data.widgets.fertilizer.name,data.widgets.fertilizer.amount,data.widgets.fertilizer.interval,data.widgets.fertilizer.next,data.widgets.fertilizer.countdown)
				}
				else {
					Widgets.fertilizer.empty(true)
				}
			}
			if(Widgets.water && Widgets.water.isInitialized){
				Widgets.water.on(data.status.water)
				if(data.widgets.water){
					Widgets.water.empty(false)
					Widgets.water.update(data.widgets.water.amount,data.widgets.water.interval,data.widgets.water.duration,data.widgets.water.next,data.widgets.water.countdown)
				}
				else {
					Widgets.water.empty(true)
				}
			}
			if(Widgets.clock && Widgets.clock.isInitialized){
				if(data.widgets.clock){
					Widgets.clock.empty(false)
					Widgets.clock.update(data.widgets.clock.date,data.widgets.clock.calendarWeek)
				}
				else {
					Widgets.clock.empty(true)
				}
			}
			if(Widgets.parameters && Widgets.parameters.isInitialized){
				if(data.widgets.parameters){
					Widgets.parameters.empty(false)
					Widgets.parameters.update(data.widgets.parameters.place,data.widgets.parameters.filter,data.widgets.parameters.exhaust,data.widgets.parameters.fans,data.widgets.parameters.temperature, data.widgets.parameters.humidity, data.widgets.light?data.widgets.parameters.light:false, data.widgets.water?data.widgets.parameters.water:false, data.widgets.fertilizer?data.widgets.parameters.fertilizer:false, data.widgets.parameters.pot, data.widgets.parameters.soil)
				}
				else {
					Widgets.parameters.empty(true)
				}
			}
			if(Widgets.schedule && Widgets.schedule.isInitialized){
				if(data.widgets.schedule){
					Widgets.schedule.empty(false)
					Widgets.schedule.update(data.widgets.schedule)
				}
				else {
					Widgets.schedule.empty(true)
				}
			}
			if(Widgets.layout && Widgets.layout.isInitialized){
				if(data.widgets.layout && data.widgets.layout.changed){
					Widgets.layout.empty(false)
					Widgets.layout.update(data.widgets.layout.id,data.widgets.layout.plants)
					Widgets.layout.set(data.widgets.layout.cols,data.widgets.layout.rows)
				}
				else if(!data.widgets.layout) {
					Widgets.layout.empty(true)
				}
			}
			if(Widgets.buttons && Widgets.buttons.isInitialized){
				if(data.status){
					Widgets.buttons.empty(false)
					Widgets.buttons.update(data.status)
				}
				else {
					Widgets.buttons.empty(true)
				}
			}
		});
	}
}
window.SG = new SmartGrow();