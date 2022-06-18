'use strict';

var NodeHelper = require("node_helper");
const Gpio = require('onoff').Gpio;
let { usleep } = require('usleep');
var main_config = null;
	
module.exports = NodeHelper.create({    
    
    _config: {
	    MICROSECONDS_PER_CM: 1e6 / 34321,
	    TRIGGER_PULSE_TIME: 5, // microseconds (us)
    },
	
    start: function () 
    {
	    var self = this;
	    this.started = false;
	    this.started_switch = false;
	    this.startedS1 = false;
	    this.mode = "off";

	    this.started = false;
	    this.started_switch = false;
    }, // end of start function
    
    // Function for ULTRA_SONIC
    hideModuels: function() {},
    setupListener: function() {
	    console.log("[HIDE MODULE] setupListener");
	    
	    if(!this.switch_on && main_config != null)
	    {
		this.trigger = new Gpio(main_config.triggerPin, "out");
		this.echo = new Gpio(main_config.echoPin, "in", "both");
	    }
		
	    this.startTick = { ticks: [0, 0] };
	    this.lastDistance = { distance: 0.0 };
	    this.measureCb = this.measure.bind(this);
    },
    
    // Function for ULTRA_SONIC
    startListener: function() {
	    console.log("[HIDE MODULE] startListener");
	    this.echo.watch(this.measureCb);
	    this.mode = "measuring";
	    this.sampleInterval = setInterval(this.doTrigger.bind(this), this.config.measuringInterval);
    },
    
    // Function for ULTRA_SONIC
    stopListener: function() {
	    console.log("[HIDE MODULE] stopListener");
	    //if(!this.switch_on)
		this.echo.unwatch(this.measureCb);
	    this.mode = "off";
	    clearInterval(this.sampleInterval);
    },
    
    // Function for ULTRA_SONIC
    doTrigger: function() {
	    this.trigger.writeSync(1);
	    usleep(this._config.TRIGGER_PULSE_TIME);
	    this.trigger.writeSync(0);
    },
    
    // Function for ULTRA_SONIC
    measure: function(err, value) {
	    var self = this;
	    var diff, usDiff, dist;
	    var average = 0;
	    if (err) {
		throw err;
	    }
	    //console.log("measure function");
	    
	    if (value == 1) {
		this.startTick["ticks"] = process.hrtime();
	    } else {
		
		diff = process.hrtime(this.startTick["ticks"]);
		// Full conversion of hrtime to us => [0]*1000000 + [1]/1000
		usDiff = diff[0] * 1000000 + diff[1] / 1000;
		if (usDiff > this.config.sensorTimeout)  // Ignore bad measurements
		    return;

		dist = usDiff / 2 / this._config.MICROSECONDS_PER_CM;
		
		this.lastDistance["distance"] = dist.toFixed(2);
		
		console.log("[HIDE MODULE] measure function in distance = " + dist.toFixed(2));
		if (this.config.calibrate && this.config.bTurnOn) {
			if(dist.toFixed(2) < 30 )
			    self.sendSocketNotification("SHOW_MODULE",dist.toFixed(2));
			else
			    self.sendSocketNotification("HIDE_MODULE",dist.toFixed(2));
		} 
	    }
    },

    socketNotificationReceived: function (notification, payload) 
    {
	    var self = this;
	    
	    if (notification === 'CONFIG') {
		if (!this.startedS1) {
		    this.config = payload;
		    main_config = payload;
		    if(!this.switch_on)
			this.setupListener();
		    this.startedS1 = true;	    
		}
		this.sendSocketNotification("STARTED", null);
	    } else if (notification === 'CONFIG_ULTRASONIC') {
		if(!this.switch_on)
		    this.setupListener();
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === true) {
		this.startListener();
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === false) {
		this.stopListener();
	    } 

	    if (notification === 'CONFIG' && this.started == false) 
	    {
		    const self = this;
		    this.config = payload;
		    main_config = payload;
		    // GPIO의 Pin 지정
		    this.pir = new Gpio(this.config.pin, 'in', 'both');
		    // GPIO로 부터 값 읽기
		    this.pir.watch((err, value) =>
		   {
		       main_config.iSlideShowTime = main_config.localSlideShowTime;
			if(value)
			{ 
				self.sendSocketNotification('SHOW_MODULE',{});
				this.startedS1 = true;
				this.config = payload;
				main_config = payload;
				main_config.currentMode = "STARTED";
				this.sendSocketNotification("STARTED", null);
			} // end of if
		    }); // end of watch
		    this.started = true;
	    } // end of if
	    
    }, // end of function
	
}); // end of NodeHelper.create
