export const de = {
	modal: {
		camera: {
			title: 'Kameras',
		},
		costs: {
			title: 'Kostenübersicht',
			button: {
				abort: {
					label:'Abbrechen'
				}
			},
			stadium:'Phase',
			duration:'Dauer',
			electricity:'Strom',
			consumables:'Verbrauch',
			wearing:'Verschleiß',
			sum: 'Summe',
			light:'Licht',
			fan:'Umluft',
			exhaust:'Abluft',
			heater:'Heizung',
			water:'Wasser',
			soil:'Erde',
			fertilizer:'Dünger',
			seeds:'Samen',
			filter:'Filter',
			pot:'Topf',
			place:'Zelt',
			waterUtilities:'Bewässerung',
		},
		'settings/schedule': {
			title: 'Anbauplan',
			button: {
				abort: {
					label:'Abbrechen'
				},
				save: {
					label:'Speichern'
				},
			}
		},
		'settings/layout': {
			title: 'Layout',
			plants:'Pflanzen',
			button: {
				abort: {
					label:'Abbrechen'
				},
				save: {
					label:'Speichern'
				},
			},
			input: {
				columns: {
					label:'X <i class="fa-duotone fa-right-from-line"></i>'
				},
				rows: {
					label:'Y <i class="fa-duotone fa-down-from-line"></i>'
				},
			}
		},
		'settings/widgets': {
			title: 'Widgets',
			button: {
				abort: {
					label:'Abbrechen'
				},
				save: {
					label:'Speichern'
				},
			},
			input: {
				temperature: {
					label:'Temperatur'
				},
				humidity: {
					label:'Luftfeuchtigkeit'
				},
				stadium: {
					label:'Anbauphase'
				},
				layout: {
					label:'Layout'
				},
				light: {
					label:'Licht'
				},
				water: {
					label:'Wasser'
				},
				clock: {
					label:'Uhr'
				},
				fertilizer: {
					label:'Dünger'
				},
				parameters: {
					label:'Parameter'
				},
				schedule: {
					label:'Anbauplan'
				},
				buttons: {
					label:'Buttons'
				},
			}
		},
		settings: {
			title: 'Einstellungen',
			user:'Benutzer',
			input: {
				language: {
					label:'Sprache'
				},
				theme: {
					label:'Theme',
					dark: 'Dunkel',
					light: 'Hell'
				},
				background: {
					label:'Hintergrund',
					dark: 'Dunkel',
					light: 'Hell',
					green: 'Grün',
					blue: 'Blau',
					red:'Rot',
					orange:'Orange',
					purple:'Lila'
				},
			},
			button: {
				layout: {
					label:'Layout'
				},
				schedule: {
					label:'Anbauplan'
				},
				widgets: {
					label:'Widgets'
				},
				abort: {
					label:'Abbrechen'
				},
				save: {
					label:'Speichern'
				},
			}
		},
		pot: {
			title: 'Topf',
			input: {
				shape: {
					label:'Form'
				},
				volume: {
					label:'Volumen'
				},
			},
			button: {
				abort: {
					label:'Abbrechen'
				},
				save: {
					label:'Speichern'
				},
			}
		},
		plant: {
			info: {
				title:'Info',
				pot:'Topf',
				water:'Bewässerung',
				soil:'Medium',
			},
			history: {
				title:'Verlauf',
				dateFormat:'fr-CH'
			},
			input: {
				text: {
					label:'Text'
				},
				strain: {
					label:'Sorte'
				},
				feminized: {
					label:'Feminisiert'
				}
			},
			button: {
				pot: {
					label:'Topf'
				},
				cut: {
					label:'Beschneiden'
				},
				measure: {
					label:'Messen'
				},
				note: {
					label:'Notiz'
				},
				abort: {
					label:'Abbrechen'
				},
				save: {
					label:'Speichern'
				},
			}

		}
	},
	alert: {
		fertilizer: {
			title: 'Dünger hinzufügen',
			description: 'Bitte fügen Sie dem Dünger-Beimischgerät hinzu:',
			button: {
				ok: {
					label: 'OK'
				},
				reminder: {
					label: 'Erneut erinnern <small style="font-size: 14px;">5 Minuten</small>'
				},
			}
		},
		cut: {
			title: 'Pflanze beschneiden',
			dateLabel: 'Datum',
			button: {
				save: {
					label: 'Speichern'
				},
				abort: {
					label: 'Abbrechen'
				},
			}
		},
		measure: {
			title: 'Pflanze messen',
			dateLabel: 'Datum',
			heightLabel: 'Höhe',
			heightUnit: 'cm',
			button: {
				save: {
					label: 'Speichern'
				},
				abort: {
					label: 'Abbrechen'
				},
			}
		},
		note: {
			title: 'Notiz hinzufügen',
			dateLabel: 'Datum',
			noteLabel: 'Notiz',
			button: {
				save: {
					label: 'Speichern'
				},
				abort: {
					label: 'Abbrechen'
				},
			}
		},
	},
	widgets: {
		temperature: {
			title:'Innentemperatur',
			unit:'°C'
		},
		humidity: {
			title:'Relative Luftfeuchtigkeit',
			unit:'%'
		},
		stadium: {
			title:'Anbauphase',
			empty:'Keine',
			dateFormat: 'fr-CH'
		},
		light: {
			title:'Beleuchtung',
			empty:'keine Beleuchtung',
			source : {
				power:'Leistung',
				temperature:'Farbtemperatur',
				flux:'Lichtleistung'
			},
			powerUnit:'Watt',
			temperatureUnit:'Kelvin',
			fluxUnit:'Lumen'

		},
		buttons: {
			fan: 'Umluft',
			exhaust: 'Abluft',
			water: 'Bewässerung',
			light: 'Beleuchtung',
			settings: 'Einstellungen',
			schedule: 'Anbauplan',
			camera: 'Kamera',
			costs: 'Kosten',
			runningCosts: 'Laufende Kosten:',
		},
		fertilizer: {
			title:'Dünger',
			nextTitle:'nächste Düngung',
			empty:'kein Dünger',
			intervalUnit: 'Stunden',
			dateFormat: 'fr-CH'
		},
		layout: {
			empty:'kein Layout',
			feminized:'Feminisiert'
		},
		parameters: {
			empty:'keine Parameter',
			place:'Ort',
			filter:'Filter',
			exhaust:'Abluft',
			fans:'Umluft',
			temperature:'Temperatur',
			humidity:'Luftfeuchtigkeit',
			light:'Beleuchtung',
			water:'Bewässerung',
			fertilizer:'Dünger',
			pot:'Topf',
			soil:'Medium'
		},
		schedule: {
			empty:'kein Anbauplan',
			dateFormat: 'fr-CH'
		},
		water: {
			title:'Bewässerung',
			nextTitle:'nächste Bewässerung',
			empty:'keine Bewässerung',
			plant: 'Pflanze',
			intervalUnit: 'Stunden',
			duration: 'Dauer',
			dateFormat: 'fr-CH'
		},
		clock: {
			dateFormat: 'fr-CH',
			calendarWeek: 'KW'
		}
	}
}
export const en = {
	modal: {
		camera: {
			title: 'Cameras',
		},
		'settings/schedule': {
			title: 'Schedule',
			button: {
				abort: {
					label:'Abort'
				},
				save: {
					label:'Save'
				},
			}
		},
		'settings/layout': {
			title: 'Layout',
			button: {
				abort: {
					label:'Abort'
				},
				save: {
					label:'Save'
				},
			}
		},
		'settings/widgets': {
			title: 'Widgets',
			button: {
				abort: {
					label:'Abort'
				},
				save: {
					label:'Save'
				},
			}
		},
		settings: {
			title: 'Settings',
			button: {
				layout: {
					label:'Layout'
				},
				schedule: {
					label:'Schedule'
				},
				widgets: {
					label:'Widgets'
				},
				abort: {
					label:'Abort'
				},
				save: {
					label:'Save'
				},
			}
		},
		pot: {
			title: 'Pot',
			input: {
				shape: {
					label:'Shape'
				},
				volume: {
					label:'Volume'
				},
			},
			button: {
				abort: {
					label:'Abort'
				},
				save: {
					label:'Save'
				},
			}
		},
		plant: {
			info: {
				title:'Info',
				pot:'Pot',
				water:'Watering',
				soil:'Soil',
			},
			history: {
				title:'History',
				dateFormat:'fr-CH'
			},
			input: {
				text: {
					label:'Text'
				},
				strain: {
					label:'Strain'
				},
				feminized: {
					label:'Feminized'
				}
			},
			button: {
				pot: {
					label:'Pot'
				},
				cut: {
					label:'Cut'
				},
				measure: {
					label:'Measure'
				},
				note: {
					label:'Note'
				},
				abort: {
					label:'Abort'
				},
				save: {
					label:'Save'
				},
			}

		}
	},
	alert: {
		fertilizer: {
			title: 'Add fertilizer',
			description: 'Please add the following fertilizer:',
			button: {
				ok: {
					label: 'OK'
				},
				reminder: {
					label: 'Remind me <small style="font-size: 14px;">in 5 Minutes</small>'
				},
			}
		},
		cut: {
			title: 'Cut plant',
			dateLabel: 'Date',
			button: {
				save: {
					label: 'Save'
				},
				abort: {
					label: 'Abort'
				},
			}
		},
		measure: {
			title: 'Measure plant',
			dateLabel: 'Date',
			heightLabel: 'Height',
			heightUnit: 'cm',
			button: {
				save: {
					label: 'Save'
				},
				abort: {
					label: 'Abort'
				},
			}
		},
		note: {
			title: 'Add note',
			dateLabel: 'Date',
			noteLabel: 'Note',
			button: {
				save: {
					label: 'Save'
				},
				abort: {
					label: 'Abort'
				},
			}
		},
	},
	widgets: {
		temperature: {
			title:'inside temperature',
			unit:'°F'
		},
		humidity: {
			title:'Humidity',
			unit:'%'
		},
		stadium: {
			title:'Phase',
			empty:'none',
			dateFormat: 'fr-CH'
		},
		light: {
			title:'Light',
			empty:'no light',
			source : {
				power:'Power',
				temperature:'Temperature',
				flux:'Light flux'
			},
			powerUnit:'Watts',
			temperatureUnit:'Kelvin',
			fluxUnit:'Lumen'

		},
		buttons: {
			fan: 'Fan',
			exhaust: 'Exhaust',
			water: 'Water',
			light: 'Light',
			settings: 'Settings',
			schedule: 'Plan',
			camera: 'Camera'
		},
		fertilizer: {
			title:'Fertilizer',
			nextTitle:'next fertilizer',
			empty:'no fertilizer',
			intervalUnit: 'Hours',
			dateFormat: 'fr-CH'
		},
		layout: {
			empty:'no layout',
			feminized:'Feminized'
		},
		parameters: {
			empty:'no parameters',
			temperature:'Temperature',
			humidity:'Humidity',
			light:'Light',
			water:'Water',
			fertilizer:'Fertilizer',
			pot:'Pot',
			soil:'Soil'
		},
		schedule: {
			empty:'no schedule',
			dateFormat: 'fr-CH'
		},
		water: {
			title:'Water',
			nextTitle:'next watering',
			empty:'no watering',
			plant: 'Plant',
			intervalUnit: 'Hours',
			duration: 'Duration',
			dateFormat: 'fr-CH'
		},
		clock: {
			dateFormat: 'fr-CH',
			calendarWeek: 'CW'
		}
	}
}