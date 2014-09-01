var Shop = function(cubes) {
	this.cubes = cubes;
	this.pressed = new Input();
	this.storage = new Storage();
	this.storage.restore();
	this.offerings = [
	{
		type : "05.js",
		energy : 0,
		cubes : 10,
		name : "x5"
	}, {
		type : "10.js",
		energy : 0,
		cubes : 10,
		name : "x10"
	}, {
		type : "20.js",
		energy : 0,
		cubes : 10,
		name : "x20"
	}, {
		type : "50.js",
		energy : 0,
		cubes : 10,
		name : "x50"
	}, {
		type : "75.js",
		energy : 0,
		cubes : 10,
		name : "x75"
	}, {
		type : "100.js",
		energy : 0,
		cubes : 10,
		name : "x100"
	}, {
		type : "heal.js",
		energy : 0,
		cubes : 10,
		name : "Heal x5"
	}, {
		type : "heal_20.js",
		energy : 0,
		cubes : 10,
		name : "Heal x20"
	}, {
		type : "multiply.js",
		energy : 0,
		cubes : 10,
		name : "Multiply"
	}, {
		type : "infinite.js",
		energy : 0,
		cubes : 10,
		name : "Infinite"
	}];
}

Shop.prototype.setupOfferings = function() {
	var self = this;
	var overlay = $("div[class='overlay']");
	for(var o in this.offerings) {
		(function() {
			var offering = self.offerings[o];
			overlay.append($("<button>" + offering.name + "</button>")
				.click(function() {
					getCube(offering.type, function(cube) {
						cube.distance = 5;
						cube.rotation = Math.PI;
						cube.tick = function(g) {
							if(g.pressed.left) this.rotate(0.03);
							if(g.pressed.right) this.rotate(-0.03);
						};
						self.cubes[self.selected] = cube;
						self.storage.cubes[self.selected] = {
							type : offering.type,
						};
						self.storage.store();
						self.select();
					});
				}));
		})(o);
	}
};

Shop.prototype.start = function() {
	this.setupOfferings();
	this.selected = 5;
	var self = this;
	for(var i = 0; i < 10; i++) {
		var type = this.storage.cubes[i];
		if(type == undefined) {
			var c = new Cube({
				modelFile : "cube.js",
				alpha : 0.9
			});
			c.setTexture("default.png"),
			this.addCube(c, i);
			if(i == 5) {
				self.select();
			}
		}
		else {
			(function(i) {
				getCube(type.type, function(cube) {
					self.addCube(cube, i);
					if(i == 5) {
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
}

Shop.prototype.addCube = function(c, i) {
	c.distance = 5;
	c.rotation = (Math.PI*2/10)*i;
	c.tick = function(g) {
		if(g.pressed.left) this.rotate(0.03);
		if(g.pressed.right) this.rotate(-0.03);
	};
	this.cubes[i] = c;
}

Shop.prototype.selectNext = function() {
	this.rotateRight();
	this.unselect();
	if(++this.selected >= 10) {
		this.selected -= 10;
	}
	this.select();
}

Shop.prototype.selectPrevious = function() {
	this.rotateLeft();
	this.unselect();
	if(--this.selected < 0) {
		this.selected += 10;
	}
	this.select();
}

Shop.prototype.unselect = function() {
	this.cubeUnselect = {
		cube : this.cubes[this.selected],
		ticks : 10
	};
}

Shop.prototype.select = function() {
	this.cubeSelect = {
		cube : this.cubes[this.selected],
		ticks : 10
	};
}

Shop.prototype.tick = function() {
	if(this.pressed.left && !this.rotating) {
		this.selectNext();
	}
	if(this.pressed.right && !this.rotating) {
		this.selectPrevious();
	}
	if(this.rotating) {
		this.rotating--;
		if(this.rotating >= 5) {
			for(var c in this.cubes) {
				var cube = this.cubes[c];
				if(cube) {
					this.cubes[c].rotate(Math.PI * 2/(15 * 10) * this.dir);
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
