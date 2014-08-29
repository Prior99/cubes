var Shop = function(cubes) {
	this.cubes = cubes;
	this.pressed = new Input();
	this.storage = new Storage();
}

Shop.prototype.start = function() {
	this.selected = 5;
	for(var i = 0; i < 10; i++) {
		var c = new Cube({
			modelFile : "cube.js",
			texture: "friend.png",
			distance : 5,
			rotation : (Math.PI*2/10)*i,
			tick:function(g) {
				if(g.pressed.left) this.rotate(0.03);
				if(g.pressed.right) this.rotate(-0.03);
			},
			friend : true,
			alpha : 0.7
		});
		this.cubes.push(c);
	}
	this.select();
	var self = this;
	setInterval(function() {
		window.requestAnimationFrame(function() {
			self.tick();
		});
	}, 1000/60);
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
