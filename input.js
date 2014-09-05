var CODE_LEFT = 37;
var CODE_UP = 38;
var CODE_RIGHT = 39;
var CODE_DOWN = 40;
var CODE_ESC = 13;

var Input = function() {
	var self = this;
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.keyboard = {
		up : false,
		down : false,
		left : false,
		right : false
	};
	this.touch = {
		left : false,
		right : false
	};
	this.esc = [];
	this.down = [];
	document.addEventListener("touchstart", function(e) {
		if(e.clientX < window.innerWidth / 2) self.touch.left = true;
		if(e.clientX > window.innerWidth / 2) self.touch.right = true;
		self.refresh();
	});
	document.addEventListener("touchend", function(e) {
		if(e.clientX < window.innerWidth / 2) self.touch.left = false;
		if(e.clientX > window.innerWidth / 2) self.touch.right = false;
		self.refresh();
	});
	document.addEventListener("keydown", function(e) {
		if(e.which == CODE_UP) self.keyboard.up = true;
		if(e.which == CODE_DOWN) self.keyboard.down = true;
		if(e.which == CODE_LEFT) self.keyboard.left = true;
		if(e.which == CODE_RIGHT) self.keyboard.right = true;
		self.refresh();
	});
	document.addEventListener("keyup", function(e) {
		if(e.which == CODE_UP) self.keyboard.up = false;
		if(e.which == CODE_DOWN) self.keyboard.down = false;
		if(e.which == CODE_LEFT) self.keyboard.left = false;
		if(e.which == CODE_RIGHT) self.keyboard.right = false;
		self.refresh();
		if(e.which == CODE_ESC) {
			for(var l in self.esc) {
				self.esc[l]();
			}
		}
			for(var l in self.down) {
				self.down[l]();
			}
	});
};

Input.prototype.refresh = function() {
	this.up = this.keyboard.up;
	this.down = this.keyboard.down;
	this.left = this.keyboard.left || this.touch.left;
	this.right = this.keyboard.right || this.touch.right;
}

Input.prototype.addEscListener = function(f) {
	this.esc.push(f);
};

Input.prototype.addDownListener = function(f) {
	this.down.push(f);
};

Input.prototype.removeEscListener = function(f) {
	this.esc.splice(this.esc.indexOf(f), 1);
};

Input.prototype.removeDown = function(f) {
	this.down.splice(this.down.indexOf(f), 1);
};
