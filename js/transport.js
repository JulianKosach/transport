

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
	this.max_scale = parseFloat(settings.max_scale) || 8;
	this.min_scale = parseFloat(settings.min_scale) || 30;
	this.scale = parseFloat(settings.scale) || 14;
	this.vehicle = new Bus({
		game: this,
		model: 'bogdan',
		width: 2380,
		length: 7430,
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
		this.canvas.width/2 - this.vehicle.options.width/(2*this.scale), 
		this.canvas.height/2 - this.vehicle.options.length/(2*this.scale), 
		this.vehicle.options.width/this.scale, 
		this.vehicle.options.length/this.scale
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
	this.canvas.width = parseFloat(size.width);
	this.canvas.height = parseFloat(size.height);
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
  this.canvas.width = options.width/this.game.scale;
  this.canvas.height = options.length/this.game.scale;
	this.ctx = this.canvas.getContext("2d");
	this.controls = options.controls || new Controls;
	this.model = options.model || 'car';
	this.steering_angle = 0;
	this.steering_max_angle = options.steering_max_angle || 45;
	this.steering_wheel_max_angle = options.steering_max_angle || 520;
	this.steering_angle_speed = options.steering_angle_speed || 2;
}

Vehicle.prototype.scaleCanvas = function() {
  this.canvas.width = this.options.width/this.game.scale;
  this.canvas.height = this.options.length/this.game.scale;
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
	this.ctx.drawImage(back_wheel, 0, 4640/this.game.scale, back_wheel.width/this.game.scale, back_wheel.height/this.game.scale);
	this.ctx.drawImage(back_wheel, (this.options.width-back_wheel.width)/this.game.scale, 4640/this.game.scale, back_wheel.width/this.game.scale, back_wheel.height/this.game.scale);
	// draw front wheels
	var front_wheel = new Image();
	front_wheel.src = (onlyaxles) ? 'vehicle/'+this.model+'/'+this.model+'__front-wheel--axle.svg' : 'vehicle/'+this.model+'/'+this.model+'__front-wheel.svg';
	drawImageCenter(this.ctx, front_wheel, {
	 	rotation: this.steering_angle,
	 	scale: this.game.scale,
	  x: front_wheel.width/2,
	  y: 1190
	});
	drawImageCenter(this.ctx, front_wheel, {
	  rotation: this.steering_angle,
	  scale: this.game.scale,
	  x: 1680+front_wheel.width/2,
	  y: 1190
	 });
};

Vehicle.prototype.renderInrerior = function(){
	var interior = new Image();
	interior.src = 'vehicle/'+this.model+'/'+this.model+'__interior.svg';
	this.ctx.drawImage(interior, 0, 0, interior.width/this.game.scale, interior.height/this.game.scale);
	// draw steering wheel
	var steering_wheel = new Image();
	steering_wheel.src = 'vehicle/'+this.model+'/'+this.model+'__steering-wheel.svg';
	drawImageCenter(this.ctx, steering_wheel, {
	 	rotation: this.steering_angle*this.steering_wheel_max_angle/this.steering_max_angle,
	 	scale: this.game.scale,
	  x: 380+steering_wheel.width/2,
	  y: 660+steering_wheel.height/2
	});
};

Vehicle.prototype.render = function(){
	this.controlsHandler();
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	// draw frame
	var frame = new Image();
  frame.src = 'vehicle/'+this.model+'/'+this.model+'__frame.svg';
  this.ctx.drawImage(frame, 0, 0, frame.width/this.game.scale, frame.height/this.game.scale);
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
	}
	return this;
};

//  ------ VEHICLE CLASS -- END ------  //






//  ------ BUS CLASS -- START ------ //

function Bus(settings) {
	Vehicle.apply(this, arguments);
}
Bus.prototype = Object.create(Vehicle.prototype);
Bus.prototype.constructor = Vehicle;

Bus.prototype.renderInrerior = function(){
	Vehicle.prototype.renderInrerior.call(this, arguments);
	var door = new Image();
	door.src = 'vehicle/'+this.model+'/'+this.model+'__door.svg';
	drawImageCenter(this.ctx, door, {
	 	// rotation: (this.steering_angle*4 > -90) ? this.steering_angle*4 : -90,
	 	scale: this.game.scale,
	  x: 2150,
	  y: 2650,
	  cx: -150,
	  cy: 350
	});
	drawImageCenter(this.ctx, door, {
	 	// rotation: (this.steering_angle*4 > -90) ? this.steering_angle*4 : -90,
	 	scale: this.game.scale,
	  x: 2150,
	  y: 5850,
	  cx: -150,
	  cy: 350
	});
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