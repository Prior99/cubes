var Shop = function(cubes, underlay, input) {
	this.cubes = cubes;
	this.underlay = underlay;
	this.underlay.className = "underlay";
	this.ctx = this.underlay.getContext("2d");
	this.input = input;
	this.storage = new Storage();
	this.storage.restore();
};

Shop.prototype.redrawHUD = function() {
	var ctx = this.ctx;
	ctx.lineWidth = 1;
	var size = Math.min(this.underlay.height, this.underlay.width)/10;
	ctx.clearRect(0, 0, this.underlay.width, this.underlay.height);
	ctx.font = size+"px akashiregular";
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

Shop.prototype.terminate = function() {
	clearInterval(this.interval);
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
			entry.on("mouseup", function(e) {
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
	overlay.append($("<div class='button' style='margin-top: 20px;'></div>")
		.append("<div class='name'>Back</div>")
		.append("<div class='description'>Back to the main menu.</div>")
		.click(function() {
			self.input.fireEscape();
		})
	);
};

Shop.prototype.block = function() {
	this.blocked = true;
};

Shop.prototype.unblock = function() {
	this.blocked = false;
};

Shop.prototype.start = function() {
	var self = this;
	$.ajax({
		url : "offerings.json",
		dataType : "text",
		success : function(html) {
			self.offerings = JSON.parse(html);
			self.setupOfferings();
			self.setupUI();
		}
	});
};

Shop.prototype.setupUI = function() {
	var self = this;
	this.selected = parseInt(this.storage.cubes.length/2);
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
	this.interval = setInterval(function() {
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
};

Shop.prototype.selectNext = function() {
	this.rotateRight();
	this.unselect();
	if(++this.selected >= this.storage.cubes.length) {
		this.selected -= this.storage.cubes.length;
	}
	this.select();
};

Shop.prototype.selectPrevious = function() {
	this.rotateLeft();
	this.unselect();
	if(--this.selected < 0) {
		this.selected += this.storage.cubes.length;
	}
	this.select();
};

Shop.prototype.unselect = function() {
	if(this.cubeUnselect && this.cubeUnselect.cube) {
		this.cubeUnselect.cube.move(0.3*this.cubeUnselect.ticks);
	}
	this.cubeUnselect = {
		cube : this.cubes[this.selected],
		ticks : 10
	};
};

Shop.prototype.select = function() {
	if(this.cubeSelect && this.cubeSelect.cube) {
		this.cubeSelect.cube.move(0.3*this.cubeSelect.ticks);
	}
	this.cubeSelect = {
		cube : this.cubes[this.selected],
		ticks : 10
	};
};

Shop.prototype.tick = function() {
	if(this.blocked) return;
	if(!this.rotating) {
		if(this.input.keyboard.right ) {
			this.selectNext();
		}
		if(this.input.keyboard.left) {
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
};

Shop.prototype.rotateLeft = function() {
	this.dir = 1;
	this.rotating = 20;
};

Shop.prototype.rotateRight = function() {
	this.dir = -1;
	this.rotating = 20;
};
