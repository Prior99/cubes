var CODE_LEFT = 37;
var CODE_UP = 38;
var CODE_RIGHT = 39;
var CODE_DOWN = 40;

var Game = function(cubes) {
	var self = this;
	this.pressed = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	this.cubes = cubes;
	document.addEventListener("keydown", function(e) {
		if(e.which == CODE_UP) self.pressed.up = true;
		if(e.which == CODE_DOWN) self.pressed.down = true;
		if(e.which == CODE_LEFT) self.pressed.left = true;
		if(e.which == CODE_RIGHT) self.pressed.right = true;
	});
	document.addEventListener("keyup", function(e) {
		if(e.which == CODE_UP) self.pressed.up = false;
		if(e.which == CODE_DOWN) self.pressed.down = false;
		if(e.which == CODE_LEFT) self.pressed.left = false;
		if(e.which == CODE_RIGHT) self.pressed.right = false;
		console.log(e);
	});
};

Game.prototype.start = function() {
	var self = this;
	this.tickNum = 0;
	setInterval(function() {
		window.requestAnimationFrame(function() {
			self.tick();
		});
	}, 1000/60);
	for(var i = 0; i < 3; i++) {
		var c = new Cube({
			modelFile : "cube.js",
			texture: "energy.png",
			distance : 5,
			rotation : (Math.PI * 2/3) * i,
			tick:function(g) {
				if(g.pressed.left) this.rotate(0.1);
				if(g.pressed.right) this.rotate(-0.1);
			},
			friend : true
		});
		this.cubes.push(c);
	}
};

Game.prototype.tick = function() {
	for(var c in this.cubes) {
		var cube = this.cubes[c];
		if(cube.tick !== undefined) {
			cube.tick(this);
		}
	}
	this.tickNum++;
	if(this.tickNum % 80 == 0) this.spawnEnemy();
};

Game.prototype.remove = function(cube) {
	var i;
	if((i = this.cubes.indexOf(cube)) != -1) this.cubes.splice(i, 1);
};

Game.prototype.spawnEnemy = function() {
	var a;
	if(Math.random() <.5) a = Math.random() * Math.PI / 2 - Math.PI / 4;
	else a = Math.random() * Math.PI / 2 - Math.PI / 4 + Math.PI;
	var c = new Cube({
		modelFile : "cube.js",
		distance : 20,
		rotation: a,
		scale : 0.5,
		tick : function(g) {
			if(this.distance < 6.1 && this.distance > 5.9 && !this.killed) {
				for(var c in g.cubes) {
					var cube = g.cubes[c];
					if(cube.friend && Math.abs(cube.rotation - this.rotation) < 0.22) {
						this.kill();
					}
				}
			}
			if(this.killed !== undefined) {
				this.killed -= 0.05;
				if(this.killed < 0) g.remove(this);
			}
			if(!this.killed) this.move(-0.05);
			if(this.distance < 2) g.remove(this);
		},
		kill : function() {
			this.killed = 1;
		}
	});
	this.cubes.push(c);
};
