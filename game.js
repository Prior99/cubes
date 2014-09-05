var START_C = 120;

var Game = function(cubes, underlay, input) {
	var self = this;
	this.underlay = underlay;
	this.underlay.className = "underlay";
	this.ctx = this.underlay.getContext("2d");
	this.pressed = input;
	this.speed = 0.1;
	this.cubes = cubes;
	this.storage = new Storage();
	this.storage.restore();
};

Game.prototype.giveRed = function() {
	this.storage.red ++;
	this.redrawHUD();
};


Game.prototype.giveBlue = function() {
	this.storage.blue ++;
	this.redrawHUD();
};

Game.prototype.gameover = function() {
	this.underlay.className = "overlay";
	var ctx = this.ctx;
	ctx.clearRect(0, 0, this.underlay.width, this.underlay.height);
	var size = 50;
	var text = "Game Over";
	ctx.font = size+"px akashiregular";
	ctx.strokeStyle = "black";
	ctx.fillStyle = "#ff5555";
	ctx.lineWidth = 1;
	ctx.textAlign = "center";
	ctx.fillText(text, this.underlay.width/2, this.underlay.height/2 + size * 2/5);
	ctx.strokeText(text, this.underlay.width/2, this.underlay.height/2 + size * 2/5);
	clearInterval(this.interval);
	this.storage.store();
	//Esc
	ctx.textAlign = "right";
	ctx.fillStyle = "#ddd";
	ctx.font = "16px akashiregular";
	ctx.fillText("Press ENTER or touch to return", this.underlay.width - 16, this.underlay.height - 20);
	self.input.addEscListener(function() {
		self.input.escape();
		self.input.removeEscListener(this);
	});

};

Game.prototype.setHP = function(hp) {
	this.hp = hp;
	this.initialHP = hp;
};

Game.prototype.start = function() {
	var self = this;
	this.tickNum = 0;
	this.interval = setInterval(function() {
		window.requestAnimationFrame(function() {
			self.tick();
		});
	}, 1000/60);
	for(var i = 0; i < self.storage.cubes.length; i++) {
		(function(i) {
			var cube = self.storage.cubes[i];
			if(cube) {
				getCube(cube.type, function(cube) {
					cube.rotation = (Math.PI * 2/self.storage.cubes.length) * i;
					self.cubes.push(cube);
				});
			}
		})(i);
	}
	this.redrawHUD();
	window.addEventListener('resize', function() {
		self.redrawHUD();
	});
};

Game.prototype.getKMH = function() {
	return (this.speed * 60 * 3.6).toFixed(2) + "km/h";
};

Game.prototype.getCubesPerSecond = function() {
	return ((1000 / 60) * 1000 / (START_C - 50 * 10 * this.speed)).toFixed(2) + "mc/s";
};

Game.prototype.tick = function() {
	this.speed += 0.000003;
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

Game.prototype.damage = function() {
	this.hp --;
	this.redrawHUD();
	if(this.hp < 0) this.gameover();
};

Game.prototype.redrawHUD = function() {
	var ctx = this.ctx;
	ctx.lineWidth = 1;
	var size = Math.min(this.underlay.height, this.underlay.width)/10;
	ctx.clearRect(0, 0, this.underlay.width, this.underlay.height);
	ctx.font = size+"px akashiregular";
	ctx.strokeStyle = "black";
	//Red
	ctx.fillStyle = "#ff5555";
	ctx.textAlign = "right";
	ctx.fillText(this.storage.red, this.underlay.width/2 - 10, this.underlay.height*3/4 + size * 2/5);
	ctx.strokeText(this.storage.red, this.underlay.width/2 - 10, this.underlay.height*3/4 + size * 2/5);
	//Blue
	ctx.fillStyle = "#5555ff";
	ctx.textAlign = "left";
	ctx.fillText(this.storage.blue, this.underlay.width/2 + 10, this.underlay.height*3/4 + size * 2/5);
	ctx.strokeText(this.storage.blue, this.underlay.width/2 + 10, this.underlay.height*3/4 + size * 2/5);
	//Lifes
	ctx.fillStyle = "#ffcb2d";
	ctx.textAlign = "center";
	ctx.fillText(this.hp, this.underlay.width/2, this.underlay.height/2 + size * 2/5);
	ctx.strokeText(this.hp, this.underlay.width/2, this.underlay.height/2 + size * 2/5);
	//Circles
	ctx.beginPath();
	ctx.arc(this.underlay.width/2, this.underlay.height/2, size, 0, Math.PI*2);
	ctx.lineWidth = 10;
	ctx.stroke();
	ctx.strokeStyle = "#ffcb2d";
	ctx.beginPath();
	ctx.arc(this.underlay.width/2, this.underlay.height/2, size, 0, Math.PI*2*(this.hp/this.initialHP));
	ctx.lineWidth -= 2;
	ctx.stroke();
	//Esc
	ctx.textAlign = "right";
	ctx.fillStyle = "#ddd";
	ctx.font = "16px akashiregular";
	ctx.fillText("Use the arrow keys", this.underlay.width - 16, this.underlay.height - 40);
	ctx.fillText("or touch on the edges", this.underlay.width - 16, this.underlay.height - 20);
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
	function add(cube) {
		cube.speed = self.speed * (Math.random() / 2 + .75);
		cube.rotation = a;
		cube.distance = 20;
		cube.normalizeRotation();
		self.cubes.push(cube);
	}
	if(Math.random() < .1) {
		getCube("energy.js", function(cube) {
			add(cube);
		});
	}
	else {
		getCube("enemy.js", function(cube) {
			add(cube);
		});
	}
};
