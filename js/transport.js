

//  ------ CONTROLS CLASS -- START ------ //

function Controls() {
	this.bindControls();
}

Controls.prototype.keyDownHandler = function(e){
			 if(e.keyCode == 37) this.left = true;
  else if(e.keyCode == 39) this.right = true;
  else if(e.keyCode == 38) this.top = true;
  else if(e.keyCode == 40) this.bottom = true;

  else if(e.keyCode == 65) this.a = true;
  else if(e.keyCode == 68) this.d = true;
  else if(e.keyCode == 87) this.w = true;
  else if(e.keyCode == 83) this.s = true;

  else if(e.keyCode == 81) this.q = true;
  else if(e.keyCode == 69) this.e = true;
  else if(e.keyCode == 82) this.r = true;
  else if(e.keyCode == 84) this.t = true;
  else if(e.keyCode == 89) this.y = true;
  else if(e.keyCode == 85) this.u = true;
  else if(e.keyCode == 73) this.i = true;
  else if(e.keyCode == 79) this.o = true;
  else if(e.keyCode == 80) this.p = true;

  else if(e.keyCode == 32) this.space = true;
	return this;
};

Controls.prototype.keyUpHandler = function(e){
			 if(e.keyCode == 37) this.left = false;
	else if(e.keyCode == 39) this.right = false;
	else if(e.keyCode == 38) this.top = false;
  else if(e.keyCode == 40) this.bottom = false;

  else if(e.keyCode == 65) this.a = false;
  else if(e.keyCode == 68) this.d = false;
  else if(e.keyCode == 87) this.w = false;
  else if(e.keyCode == 83) this.s = false;

  else if(e.keyCode == 81) this.q = false;
  else if(e.keyCode == 69) this.e = false;
  else if(e.keyCode == 82) this.r = false;
  else if(e.keyCode == 84) this.t = false;
  else if(e.keyCode == 89) this.y = false;
  else if(e.keyCode == 85) this.u = false;
  else if(e.keyCode == 73) this.i = false;
  else if(e.keyCode == 79) this.o = false;
  else if(e.keyCode == 80) this.p = false;

	else if(e.keyCode == 32) this.space = false;
	return this;
};

Controls.prototype.bindControls = function(){
	var _this = this;
	document.addEventListener("keydown", function(e){
		e.preventDefault();
		_this.keyDownHandler(e);
	}, false);
	document.addEventListener("keyup", function(e){
		e.preventDefault();
		_this.keyUpHandler(e);
	}, false);
	return this;
};

//  ------ CONTROLS CLASS -- END ------  //






//  ------ TRANSPORT CLASS -- START ------ //
function Transport(settings) {
	settings = settings || {};
	this.controls = settings.controls || new Controls();
	this.fps = settings.fps || 25;
	this.el = document.getElementById('transport');
	this.canvas = document.getElementById("trsp_canvas");
	this.ctx = this.canvas.getContext("2d");
	this.max_scale = parseInt(settings.max_scale) || 10;
	this.min_scale = parseInt(settings.min_scale) || 40;
	this.scale = parseInt(settings.scale) || 12;
	this.vehicle = new Bus({
		game: this,
		model: 'bogdan',
		width: 2380,
		length: 7430,
		steering_wheels__x: 730,
		steering_wheels__y: 1020,
		front_wheels__y: 2525,
		back_wheels__y: 1290,
		scale: this.scale
	});
	this.init();
}

Transport.prototype.showControls = function(){
	var ctrls = this.controls;
	for (key in ctrls) {
		var el = this.el.querySelector('.control-'+key);
		if (!el) continue;
		if (ctrls[key]) {
			el.className += ' active';
		} else {
			el.className = el.className.split(' active')[0];
		}
	}
	return this;
};

Transport.prototype.renderVehicle = function(){
	this.ctx.drawImage(
		this.vehicle.render(), 
		Math.round( this.canvas.width/2 - this.vehicle.canvas.width/2 ), 
		Math.round( this.canvas.height/2 - this.vehicle.canvas.height/2 ), 
		Math.round( this.vehicle.canvas.width ), 
		Math.round( this.vehicle.canvas.height )
	);
	return this;
}

Transport.prototype.render = function(){
	var _this = this;
	this.showControls();
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.renderVehicle();
	setTimeout(function(){
		_this.render();
	}, parseInt(1000/_this.fps));
	return this;
}

Transport.prototype.resizeCanvas = function() {
	var size = getComputedStyle(this.el.querySelector('.transport__screen'));
	this.canvas.width = parseInt(size.width);
	this.canvas.height = parseInt(size.height);
}

Transport.prototype.bindResizeCanvas = function() {
	var _this = this;
	this.resizeCanvas();
	window.addEventListener('resize', function(){
		_this.resizeCanvas();
	});
	return this;
}

Transport.prototype.scaleCanvas = function(scale) {
	if (scale === 'plus' && this.scale > this.max_scale) {
		this.scale--;
		this.vehicle.scaleCanvas();
	} else if (scale === 'minus' && this.scale < this.min_scale) {
		this.scale++;
		this.vehicle.scaleCanvas();
	}
	return this;
}


Transport.prototype.bindScaleCanvas = function() {
	var _this = this;
	this.resizeCanvas();
	this.el.querySelector('.scale_plus').addEventListener('click', function(){
		_this.scaleCanvas('plus');
	});
	this.el.querySelector('.scale_minus').addEventListener('click', function(){
		_this.scaleCanvas('minus');
	});
	return this;
}

Transport.prototype.init = function(){
	this.bindResizeCanvas();
	this.bindScaleCanvas();
	this.render();
	return this;
};

//  ------ TRANSPORT CLASS -- END ------  //









//  ------ VEHICLE CLASS -- START ------ //

function Vehicle(options){
	this.options = options || {};
	this.game = options.game;
	this.canvas = document.createElement("canvas");
  this.canvas.width = Math.round( options.width*2/this.game.scale );
  this.canvas.height = Math.round( options.length*2/this.game.scale );
	this.ctx = this.canvas.getContext("2d");
	this.controls = options.controls || new Controls;
	this.model = options.model || 'car';
	this.steering_angle = 0;
	this.steering_max_angle = options.steering_max_angle || 45;
	this.steering_wheel_max_angle = options.steering_max_angle || 520;
	this.steering_angle_speed = options.steering_angle_speed || 2;
	this.steering_wheels__x = options.steering_wheels__x || 0;
	this.steering_wheels__y = options.steering_wheels__y || 0;
	this.front_wheels__x = options.front_wheels__x || Math.round( options.width/2 );
	this.front_wheels__y = options.front_wheels__y || Math.round( options.length/3 );
	this.back_wheels__x = options.back_wheels__x || Math.round( options.width/2 );
	this.back_wheels__y = options.back_wheels__y || Math.round( options.length/3 );
	this.lights = {
		dipped_beam: false,
		brake: false,
		turn_left: false,
		turn_right: false,
		emergency: false,
		turn_timer: new Date(),
		render_timer: new Date()
	};
}

Vehicle.prototype.scaleCanvas = function() {
  this.canvas.width = Math.round( this.options.width*2/this.game.scale );
  this.canvas.height = Math.round( this.options.length*2/this.game.scale );
	return this;
}

Vehicle.prototype.turnSteering = function(direction){
	if (direction === 'left') {
		if (this.steering_angle > -this.steering_max_angle) this.steering_angle -= this.steering_angle_speed;
	} else if (direction === 'right') {
		if (this.steering_angle < this.steering_max_angle) this.steering_angle += this.steering_angle_speed;
	}
};

Vehicle.prototype.renderWheels = function(onlyaxles){
	// draw back wheels
	var back_wheel = new Image();
	back_wheel.src = (onlyaxles) ? 'vehicle/'+this.model+'/'+this.model+'__back-wheel--axle.svg' : 'vehicle/'+this.model+'/'+this.model+'__back-wheel.svg';
	this.ctx.drawImage(
		back_wheel,
		Math.round( this.canvas.width/2 - this.back_wheels__x/this.game.scale ),
		Math.round( this.canvas.height/2 + this.back_wheels__y/this.game.scale - back_wheel.height/(2*this.game.scale) ),
		Math.round( back_wheel.width/this.game.scale ),
		Math.round( back_wheel.height/this.game.scale )
	);
	this.ctx.drawImage(
		back_wheel,
		Math.round( this.canvas.width/2 + (this.back_wheels__x-back_wheel.width)/this.game.scale ),
		Math.round( this.canvas.height/2 + this.back_wheels__y/this.game.scale - back_wheel.height/(2*this.game.scale) ),
		Math.round( back_wheel.width/this.game.scale ),
		Math.round( back_wheel.height/this.game.scale )
	);
	// draw front wheels
	var front_wheel = new Image();
	front_wheel.src = (onlyaxles) ? 'vehicle/'+this.model+'/'+this.model+'__front-wheel--axle.svg' : 'vehicle/'+this.model+'/'+this.model+'__front-wheel.svg';
	drawImageCenter(this.ctx, front_wheel, {
	 	rotation: this.steering_angle,
	 	scale: this.game.scale,
	  x: Math.round( this.canvas.width*this.game.scale/2 - this.front_wheels__x + front_wheel.width/2 ),
	  y: Math.round( this.canvas.height*this.game.scale/2 - this.front_wheels__y )
	});
	drawImageCenter(this.ctx, front_wheel, {
	  rotation: this.steering_angle,
	  scale: this.game.scale,
	  x: Math.round( this.canvas.width*this.game.scale/2 + this.front_wheels__x - front_wheel.width/2 ),
	  y: Math.round( this.canvas.height*this.game.scale/2 - this.front_wheels__y )
	 });
};

Vehicle.prototype.renderInrerior = function(){
	var interior = new Image();
	interior.src = 'vehicle/'+this.model+'/'+this.model+'__interior.svg';
	this.ctx.drawImage(
		interior,
		Math.round( this.canvas.width/2 - interior.width/(2*this.game.scale) ),
		Math.round( this.canvas.height/2 - interior.height/(2*this.game.scale) ),
		Math.round( interior.width/this.game.scale ),
		Math.round( interior.height/this.game.scale )
	);
	// draw steering wheel
	var steering_wheel = new Image();
	steering_wheel.src = 'vehicle/'+this.model+'/'+this.model+'__steering-wheel.svg';
	drawImageCenter(this.ctx, steering_wheel, {
	 	rotation: Math.round( this.steering_angle*this.steering_wheel_max_angle/this.steering_max_angle ),
	 	scale: this.game.scale,
	  x: Math.round( this.canvas.width*this.game.scale/2 - this.options.width/2 + this.steering_wheels__x - steering_wheel.width/2 ),
	  y: Math.round( this.canvas.height*this.game.scale/2 - this.options.length/2 + this.steering_wheels__y - steering_wheel.height/2 )
	});
};

Vehicle.prototype.turnLights = function(lights_type, turned){
	if (lights_type === 'brake') {
		this.lights.brake = turned || false;
		return this;
	}
	var time_diff = new Date() - this.lights.turn_timer;
	if ( time_diff < 500 ) return this;
	if (lights_type === 'turn_left') {
		if (this.lights.turn_left) {
			this.lights.turn_left = false;
		} else {
			this.lights.emergency = false;
			this.lights.turn_right = false;
			this.lights.turn_left = true;
			this.lights.render_timer = new Date();
		}
	}
	if (lights_type === 'turn_right') {
		if (this.lights.turn_right) {
			this.lights.turn_right = false;
		} else {
			this.lights.emergency = false;
			this.lights.turn_left = false;
			this.lights.turn_right = true;
			this.lights.render_timer = new Date();
		}
	}
	if (lights_type === 'emergency') {
		if (this.lights.emergency) {
			this.lights.emergency = false;
		} else {
			this.lights.emergency = true;
			this.lights.render_timer = new Date();
		}
	}
	this.lights.turn_timer = new Date();
	return this;
};

Vehicle.prototype.renderLights = function(){
	if (this.lights.brake) {
		var light_stop = new Image();
		light_stop.src = 'vehicle/'+this.model+'/'+this.model+'__light-stop.svg';
		this.ctx.drawImage(
			light_stop,
			Math.round( this.canvas.width/2 - light_stop.width/(2*this.game.scale) ),
			Math.round( this.canvas.height/2 - light_stop.height/(2*this.game.scale) ),
			Math.round( light_stop.width/this.game.scale ),
			Math.round( light_stop.height/this.game.scale )
		);
	}
	var time_diff = new Date() - this.lights.render_timer;
	if (  Math.floor(time_diff/500) % 2 ) return this;
	if (this.lights.turn_left || this.lights.emergency) {
		var light_left = new Image();
		light_left.src = 'vehicle/'+this.model+'/'+this.model+'__light-left.svg';
		this.ctx.drawImage(
			light_left,
			Math.round( this.canvas.width/2 - light_left.width/(2*this.game.scale) ),
			Math.round( this.canvas.height/2 - light_left.height/(2*this.game.scale) ),
			Math.round( light_left.width/this.game.scale ),
			Math.round( light_left.height/this.game.scale )
		);
	}
	if (this.lights.turn_right || this.lights.emergency) {
		var light_right = new Image();
		light_right.src = 'vehicle/'+this.model+'/'+this.model+'__light-right.svg';
		this.ctx.drawImage(
			light_right,
			Math.round( this.canvas.width/2 - light_right.width/(2*this.game.scale) ),
			Math.round( this.canvas.height/2 - light_right.height/(2*this.game.scale) ),
			Math.round( light_right.width/this.game.scale ),
			Math.round( light_right.height/this.game.scale )
		);
	}
	return this;
};

Vehicle.prototype.render = function(){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.controlsHandler();
	this.renderLights();
	// draw frame
	var frame = new Image();
  frame.src = 'vehicle/'+this.model+'/'+this.model+'__frame.svg';
  this.ctx.drawImage(
  	frame,
		Math.round( this.canvas.width/2 - frame.width/(2*this.game.scale) ),
		Math.round( this.canvas.height/2 - frame.height/(2*this.game.scale) ),
		Math.round( frame.width/this.game.scale ),
		Math.round( frame.height/this.game.scale )
  );
  // draw interior
	if (true) {
		this.renderInrerior();
		this.renderWheels(true);
	} else {
		this.renderWheels();
	}
  // return canvas
	return this.canvas;
}

Vehicle.prototype.controlsHandler = function(){
	var ctrls = this.controls;
	for (key in ctrls) {
				 if ( (key === 'left' || key === 'a') && ctrls[key] ) this.turnSteering('left');
		else if ( (key === 'right' || key === 'd') && ctrls[key] ) this.turnSteering('right');

		else if ( (key === 'bottom' || key === 's') ) {
			this.turnLights('brake', (ctrls['bottom'] || ctrls['s']));
		}
		else if (key === 'q' && ctrls[key]) this.turnLights('turn_left');
		else if (key === 'e' && ctrls[key]) this.turnLights('turn_right');
		else if (key === 'r' && ctrls[key]) this.turnLights('emergency');
	}
	return this;
};

//  ------ VEHICLE CLASS -- END ------  //






//  ------ BUS CLASS -- START ------ //

function Bus(settings) {
	Vehicle.apply(this, arguments);
	this.doors = {
		doors_y: [
			-660,
			2540
		],
		opened: false,
		angle: 0,
		open_timer: 0,
		time_for_open: 1200
	}
}
Bus.prototype = Object.create(Vehicle.prototype);
Bus.prototype.constructor = Vehicle;

Bus.prototype.renderInrerior = function(){
	Vehicle.prototype.renderInrerior.call(this, arguments);
	this.renderDoors();
	return this;
};

Bus.prototype.renderDoors = function(){
	var time_diff = Math.round( (new Date() - this.doors.open_timer)*90/this.doors.time_for_open );
	if (this.doors.opened) {
		this.doors.angle = Math.max(-time_diff, -90);
	} else {
		this.doors.angle = Math.min(-90 + time_diff, 0);
	}
	var door = new Image();
	door.src = 'vehicle/'+this.model+'/'+this.model+'__door.svg';
	for (var i=0; i<this.doors.doors_y.length; i++) {
		drawImageCenter(this.ctx, door, {
		 	rotation: Math.round(this.doors.angle),
		 	scale: this.game.scale,
		  x: Math.round( this.canvas.width*this.game.scale/2 + this.options.width/2 - door.width/2 ),
		  y: Math.round( this.canvas.height*this.game.scale/2 - door.height/2 + this.doors.doors_y[i] ),
		  cx: door.width/2 + Math.round(this.doors.angle*3),
		  cy: door.height/2 - Math.round(this.doors.angle*2)
		});
	}
	return this;
};

Bus.prototype.openDoors = function(){
	var time_diff = new Date() - this.doors.open_timer;
	if ( time_diff < this.doors.time_for_open ) return this;
	this.doors.opened = (this.doors.opened) ? false : true;
	this.doors.open_timer = new Date();
	return this;
};

Bus.prototype.controlsHandler = function(){
	Vehicle.prototype.controlsHandler.call(this, arguments);
	var ctrls = this.controls;
	for (key in ctrls) {
		if ( key === 't' && ctrls[key] ) this.openDoors();
	}
	return this;
};

//  ------ BUS CLASS -- END ------  //






function drawImageCenter(ctx, image, opt){
	opt = opt || {};
	var o = {};
	o.x = (opt.hasOwnProperty('x')) ? opt.x : 0;
	o.y = (opt.hasOwnProperty('y')) ? opt.y : 0;
	o.cx = (opt.hasOwnProperty('cx')) ? opt.cx : image.width/2;
	o.cy = (opt.hasOwnProperty('cy')) ? opt.cy : image.height/2;
	o.scale = (opt.hasOwnProperty('scale')) ? 1/opt.scale : 1;
	o.rotation = (opt.hasOwnProperty('rotation')) ? opt.rotation : 0;
  ctx.setTransform(1, 0, 0, 1, o.x*o.scale, o.y*o.scale); // sets scale and origin
  ctx.rotate(o.rotation*Math.PI/180);
  ctx.drawImage(image, -o.cx*o.scale, -o.cy*o.scale, image.width*o.scale, image.height*o.scale);
  ctx.setTransform(1,0,0,1,0,0);
} 






document.addEventListener('DOMContentLoaded', function() {
	var controls = new Controls();
	var transport = new Transport({
		controls: controls
	});
});