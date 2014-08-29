var Shop = function(cubes) {
	this.cubes = cubes;
	this.pressed = new Input();
}

Shop.prototype.start = function() {
	for(var i = 0; i < 1; i++) {
		var c = new Cube({
			modelFile : "cube.js",
			texture: "friend.png",
			distance : 5,
			rotation : (Math.PI * 2/10) * i,
			tick:function(g) {
				if(g.pressed.left) this.rotate(0.03);
				if(g.pressed.right) this.rotate(-0.03);
			},
			friend : true
		});
		this.cubes.push(c);
	}
	var self = this;
	setInterval(function() {
		window.requestAnimationFrame(function() {
			self.tick();
		});
	}, 1000/60);
}

Shop.prototype.tick = function() {
	if(this.pressed.left && !this.rotating) {
		this.rotateLeft();
		this.select(++selected);
	}
	if(this.pressed.right && !this.rotating) {
		this.rotateRight();
		this.select(--selected);
	}
	if(this.rotating) {
		this.rotating--;
		if(this.rotating > 10) {
			for(var c in this.cubes) this.cubes[c].rotate(Math.PI * 2/(20 * 10) * this.dir);
		}
		if(this.rotating == 0) {
			this.rotating = undefined;
		}
	}
}

Shop.prototype.rotateLeft = function() {
	this.dir = 1;
	this.rotating = 30;
}

Shop.prototype.rotateRight = function() {
	this.dir = -1;
	this.rotating = 30;
}

Shop.prototype.select = function() {
	
}
