var START_C = 120;

var Game = function(cubes) {
	if(localStorage.points == undefined) localStorage.points = 0;
	var self = this;
	this.pressed = new Input();
	this.speed = 0.1;
	this.cubes = cubes;
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
		getCube("infinite.js", function(cube) {
			cube.rotation = (Math.PI * 2/3) * i;
			self.cubes.push(cube);
		});
	}
};

Game.prototype.getKMH = function() {
	return (this.speed * 60 * 3.6).toFixed(2) + "km/h";
};

Game.prototype.getCubesPerSecond = function() {
	return ((1000 / 60) * 1000 / (START_C - 50 * 10 * this.speed)).toFixed(2) + "mc/s";
};

Game.prototype.tick = function() {
	this.speed += 0.00001;
	$("div[class='overlay']").html(this.getKMH() + "<br>" + this.getCubesPerSecond() + "<br>" + localStorage.points);
	var remove = [];
	for(var c in this.cubes) {
		var cube = this.cubes[c];
		cube.tick(this);
		if(!cube.enabled) remove.push(cube);
	}
	for(var c in remove) {
		this.cubes.splice(this.cubes.indexOf(remove[c]), 1);
	}
	this.tickNum++;
	if(parseInt(this.tickNum % (START_C - 50 * 10 * this.speed)) == 0) this.spawnEnemy();
};

Game.prototype.remove = function(cube) {
	var i;
	if((i = this.cubes.indexOf(cube)) != -1) this.cubes.splice(i, 1);
};

Game.prototype.spawnEnemy = function() {
	var a;
	var self = this;
	if(Math.random() <.5) a = Math.random() * Math.PI / 2 - Math.PI / 4;
	else a = Math.random() * Math.PI / 2 - Math.PI / 4 + Math.PI;
	getCube("enemy.js", function(cube) {
	    cube.speed = self.speed * (Math.random() / 2 + .75);
	    cube.rotation = a;
	    cube.distance = 20;
		self.cubes.push(cube);
	});
};
