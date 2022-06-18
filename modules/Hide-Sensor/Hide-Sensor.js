'use strict';

/*


Smart Mirror Module List
 
alert
updatenotification
clock
MMM-MonthCalendar
calendar
weather
MMM-AirQuality
MMM-GoogleAssistant
Gateway
EXT-Detector
YouTubeVLC
 
 
*/

Module.register("Hide-Sensor", {
	defaults : {
		echoPin: 24,
		triggerPin: 23,
		distance: 200,
		sensorTimeout: 10000,
		animationSpeed: 100,
		measuringInterval: 500, // in milliseconds
		delay: 30,
		usePIR: false,
		powerSavingDelay: 30,
		verbose: false,
		calibrate: true,
       	autoStart: true,
       	iSlideShowTime: 60*5,
       	localSlideShowTime: 60*5,
       	currentMode : "SHOW_MODULE",
       	clickDelay: 500,
    	bMirror: false,  
	},
	
	start: function () {	
		var self = this;
		this.loaded = false;	
		this.config.started = false;	

		this.sendSocketNotification('CONFIG', this.config);
		
		this.sendSocketNotification('CONFIG_ULTRASONIC', this.config);
		console.log("초음파 센서");
	},

	socketNotificationReceived: function (notification, payload) {		
		// HIDE MODULE
		if (notification === "HIDE_MODULE" && config.currentMode != "HIDE_MODULE" ){
			console.log("+++++++++++++++++++++++++++++++turn off");
			MM.getModules().withClass(['updatenotification', 
                                      'clock', 
									  'MMM-MonthCalendar',
									  'calendar',
									  'weather',
									  'calendar',
									  'MMM-AirQuality',
									  'MMM-GoogleAssistant',
									  'Gateway',
									  'EXT-Detector',
									  'YouTubeVLC'])
                                .enumerate(function(module){
                                    module.hide(1000);
                                });
            config.currentMode = "HIDE_MODULE";			              
		}	
		
		// SHOW MODULE
		if (notification === "SHOW_MODULE" && config.currentMode != "SHOW_MODULE"){
			console.log("+++++++++++++++++++++++++++++++turn on");
			MM.getModules().withClass(['updatenotification', 
                                      'clock', 
									  'MMM-MonthCalendar',
									  'calendar',
									  'weather',
									  'calendar',
									  'MMM-AirQuality',
									  'MMM-GoogleAssistant',
									  'Gateway',
									  'EXT-Detector',
									  'YouTubeVLC'])
                                .enumerate(function(module){
                                    module.show(1000);
                                });
            config.currentMode = "SHOW_MODULE"
		}


		if (notification === 'STARTED') 
				this.sendSocketNotification("ACTIVATE_MEASURING", true);
	},	
});
