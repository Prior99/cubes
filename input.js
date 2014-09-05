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
	this.downs = [];
	function down(e) {
		if(e.clientX < window.innerWidth / 2) self.touch.left = true;
		if(e.clientX > window.innerWidth / 2) self.touch.right = true;
		self.refresh();
		e.stopPropagation();
		e.preventDefault();
		for(var l in self.downs) {
			self.downs[l]();
		}
	}

	function up(e) {
		if(e.clientX < window.innerWidth / 2) self.touch.left = false;
		if(e.clientX > window.innerWidth / 2) self.touch.right = false;
		self.refresh();
		e.stopPropagation();
		e.preventDefault();
	}
	document.addEventListener("touchstart", down);
	document.addEventListener("touchend", up);
	document.addEventListener("mousedown", down);
	document.addEventListener("mouseup", up);
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
			self.escape();
		}
		for(var l in self.downs) {
			self.downs[l]();
		}
	});
};

Input.prototype.escape = function() {
	for(var l in this.esc) {
		this.esc[l]();
	}
};

Input.prototype.refresh = function() {
	this.up = this.keyboard.up;
	this.down = this.keyboard.down;
	this.left = this.keyboard.left || this.touch.left;
	this.right = this.keyboard.right || this.touch.right;
};

Input.prototype.addEscListener = function(f) {
	this.esc.push(f);
};

Input.prototype.addDownListener = function(f) {
	this.downs.push(f);
};

Input.prototype.removeEscListener = function(f) {
	this.esc.splice(this.esc.indexOf(f), 1);
};

Input.prototype.removeDown = function(f) {
	this.downs.splice(this.downs.indexOf(f), 1);
};
