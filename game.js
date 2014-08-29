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
		var c = new Cube({
			modelFile : "cube.js",
			texture: "friend.png",
			distance : 5,
			rotation : (Math.PI * 2/3) * i,
			tick:function(g) {
				if(g.pressed.left) this.rotate(0.03);
				if(g.pressed.right) this.rotate(-0.03);
			},
			friend : true
		});
		this.cubes.push(c);
	}
};

Game.prototype.getKMH = function() {
	return (this.speed * 60 * 3.6).toFixed(2) + "km/h";
}

Game.prototype.getCubesPerSecond = function() {
	return ((1000 / 60) * 1000 / (START_C - 50 * 10 * this.speed)).toFixed(2) + "mc/s";
}


Game.prototype.tick = function() {
	this.speed += 0.00001;
	$("div[class='overlay']").html(this.getKMH() + "<br>" + this.getCubesPerSecond() + "<br>" + localStorage.points);
	for(var c in this.cubes) {
		var cube = this.cubes[c];
		if(cube.tick !== undefined) {
			cube.tick(this);
		}
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
	if(Math.random() <.5) a = Math.random() * Math.PI / 2 - Math.PI / 4;
	else a = Math.random() * Math.PI / 2 - Math.PI / 4 + Math.PI;
	var c = new Cube({
		modelFile : "cube.js",
		distance : 20,
		rotation: a,
		texture : "enemy.png",
		scale : 0.7,
		speed : this.speed,
		tick : function(g) {
			if(this.distance < 6 && this.distance > 4.7 && !this.killed) {
				for(var c in g.cubes) {
					var cube = g.cubes[c];
					if(cube.friend && Math.abs(cube.rotation - this.rotation) < 0.22) {
						this.kill();
						localStorage.points++;
					}
				}
			}
			if(this.killed !== undefined) {
				this.killed -= 0.01;
				this.alpha = this.killed;
				if(this.killed < 0) g.remove(this);
			}
			if(!this.killed) this.move(-this.speed);
			if(this.distance < 1 && !this.killed) this.kill();
		},
		kill : function() {
			this.killed = 1;
		}
	});
	this.cubes.push(c);
};
