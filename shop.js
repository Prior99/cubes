var Shop = function(cubes, underlay) {
	this.cubes = cubes;
	this.underlay = underlay;
	this.underlay.className = "underlay";
	this.ctx = this.underlay.getContext("2d");
	this.pressed = new Input();
	this.storage = new Storage();
	this.storage.restore();
	this.offerings = [
	{
		type        : "05.js",
		blue      : 2,
		red       : 50,
		name        : "x5",
		description : "The first crappy cube you will be able to buy, capable of blocking the small amount of 5 enemys."
	}, {
		type        : "10.js",
		blue      : 5,
		red       : 150,
		name        : "x10",
		description : "This cube is twice as efficient as the x5 cube but also costs nearly 3 times as much."
	}, {
		type        : "20.js",
		blue      : 7,
		red       : 300,
		name        : "x20",
		description : "If the x5 and x10 cube are giving you a hard time already, you might want to give this one a try."
	}, {
		type        : "50.js",
		blue      : 10,
		red       : 500,
		name        : "x50",
		description : "This cube is not only 2.5 times as resistant as the x20 cube but also costs less than twice as much. The best deal we have in store."
	}, {
		type        : "75.js",
		blue      :  15,
		red       : 1000,
		name        : "x75",
		description : "If you liked the x50 you will love th x75. Okay - it might cost twice as much but is also capable of defending 25 additional enemys."
	}, {
		type        : "100.js",
		blue      : 25,
		red       : 2000,
		name        : "x100",
		description : "This is the stores number one elite cube. This one will protect you from 100 enemys which is the highest physical possible amount."
	}, {
		type        : "heal.js",
		blue      : 75,
		red       : 1000,
		name        : "Heal x5",
		description : "Even though this cube will already be gone after being hit by 5 enemys you should give it a shot. It will absorb the energy of each enemy and heal you by one HP each time."
	}, {
		type        : "heal_20.js",
		blue      : 500,
		red       : 5000,
		name        : "Heal x20",
		description : "This is fairly the same as the cheaper healing cube but lasts 4 times as long as it. Just image in it, this means 20 more HP for you!"
	}];
};

Shop.prototype.redrawHUD = function() {
	var ctx = this.ctx;
	ctx.lineWidth = 1;
	var size = Math.min(this.underlay.height, this.underlay.width)/10;
	ctx.clearRect(0, 0, this.underlay.width, this.underlay.height);
	ctx.font = size+"px Verdana";
	ctx.strokeStyle = "black";
	//Red
	ctx.fillStyle = "#ff5555";
	ctx.textAlign = "right";
	ctx.fillText(this.storage.red, this.underlay.width/2 - 10, this.underlay.height - size/4);
	ctx.strokeText(this.storage.red, this.underlay.width/2 - 10, this.underlay.height - size/4);
	//Blue
	ctx.fillStyle = "#5555ff";
	ctx.textAlign = "left";
	ctx.fillText(this.storage.blue, this.underlay.width/2 + 10, this.underlay.height - size/4);
	ctx.strokeText(this.storage.blue, this.underlay.width/2 + 10, this.underlay.height - size/4);
};

Shop.prototype.setupOfferings = function() {
	var self = this;
	var overlay = $("#wrapper");
	for(var o in this.offerings) {
		(function() {
			var offering = self.offerings[o];
			var entry = $($("#template_shop").html());
			entry.find("span[class='red']").html(offering.red);
			entry.find("span[class='blue']").html(offering.blue);
			entry.find("div[class='text']").html(offering.description);
			entry.find("div[class='name']").html(offering.name);
			overlay.append(entry);
			entry.click(function() {
				if(self.storage.red < offering.red || self.storage.blue < offering.blue) return;
				if(self.rotating) return;
				self.storage.red -= offering.red;
				self.storage.blue -= offering.blue;
				self.redrawHUD();
				self.block();
				getCube(offering.type, function(cube) {
					cube.distance = 5;
					cube.rotation = Math.PI;
					self.cubes[self.selected] = cube;
					self.storage.cubes[self.selected] = {
						type : offering.type,
					};
					self.storage.store();
					self.select();
					self.unblock();
				});
			});
		})(o);
	}
};

Shop.prototype.block = function() {
	this.blocked = true;
};

Shop.prototype.unblock = function() {
	this.blocked = false;
};

Shop.prototype.start = function() {
	this.setupOfferings();
	this.selected = parseInt(this.storage.cubes.length/2);
	var self = this;
	for(var i = 0; i < this.storage.cubes.length; i++) {
		var type = this.storage.cubes[i];
		if(type == undefined) {
			var c = new Cube({
				modelFile : "cube.js",
				alpha : 0.9
			});
			c.setTexture("default.png"),
			this.addCube(c, i);
			if(i == self.selected) {
				self.select();
			}
		}
		else {
			(function(i) {
				getCube(type.type, function(cube) {
					self.addCube(cube, i);
					if(i == self.selected) {
						self.select();
					}
				});
			})(i);
		}
	}
	var self = this;
	setInterval(function() {
		window.requestAnimationFrame(function() {
			self.tick();
		});
	}, 1000/60);
	window.addEventListener('resize', function() {
		self.redrawHUD();
	});
	this.redrawHUD();
}

Shop.prototype.addCube = function(c, i) {
	c.distance = 5;
	c.rotation = (Math.PI*2/this.storage.cubes.length)*i;
	this.cubes[i] = c;
}

Shop.prototype.selectNext = function() {
	this.rotateRight();
	this.unselect();
	if(++this.selected >= this.storage.cubes.length) {
		this.selected -= this.storage.cubes.length;
	}
	this.select();
}

Shop.prototype.selectPrevious = function() {
	this.rotateLeft();
	this.unselect();
	if(--this.selected < 0) {
		this.selected += this.storage.cubes.length;
	}
	this.select();
}

Shop.prototype.unselect = function() {
	if(this.cubeUnselect && this.cubeUnselect.cube) {
		this.cubeUnselect.cube.move(0.3*this.cubeUnselect.ticks);
	}
	this.cubeUnselect = {
		cube : this.cubes[this.selected],
		ticks : 10
	};
}

Shop.prototype.select = function() {
	if(this.cubeSelect && this.cubeSelect.cube) {
		this.cubeSelect.cube.move(0.3*this.cubeSelect.ticks);
	}
	this.cubeSelect = {
		cube : this.cubes[this.selected],
		ticks : 10
	};
}

Shop.prototype.tick = function() {
	if(this.blocked) return;
	if(!this.rotating) {
		if(this.pressed.right ) {
			this.selectNext();
		}
		if(this.pressed.left) {
			this.selectPrevious();
		}
	}
	if(this.rotating) {
		this.rotating--;
		if(this.rotating >= 5) {
			for(var c in this.cubes) {
				var cube = this.cubes[c];
				if(cube) {
					this.cubes[c].rotate(Math.PI * 2/(15 * this.storage.cubes.length) * this.dir);
				}
			}
		}
		if(this.rotating == 0) {
			this.rotating = undefined;
		}
	}
	if(this.cubeSelect) {
		if(this.cubeSelect.cube) this.cubeSelect.cube.move(0.3);
		if(--this.cubeSelect.ticks <= 0) this.cubeSelect = undefined;
	}
	if(this.cubeUnselect) {
		if(this.cubeUnselect.cube) this.cubeUnselect.cube.move(-0.3);
		if(--this.cubeUnselect.ticks <= 0) this.cubeUnselect = undefined;
	}
}

Shop.prototype.rotateLeft = function() {
	this.dir = 1;
	this.rotating = 20;
}

Shop.prototype.rotateRight = function() {
	this.dir = -1;
	this.rotating = 20;
}
