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
	var overlay = $("#wrapper");
	for(var o in this.offerings) {
		(function() {
			var offering = self.offerings[o];
			overlay.append($("<div class='button'></div>")
				.append("<div class='name'>" + offering.name + "</div>")
				.append("<div class='description'>"+offering.description+"</div>")
				.click(function() {
					if(self.rotating) return;
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
				})
			);
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
