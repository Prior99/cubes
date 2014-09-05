var CODE_LEFT = 37;
var CODE_UP = 38;
var CODE_RIGHT = 39;
var CODE_DOWN = 40;
var CODE_ESC = 27;

var Input = function() {
	var self = this;
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.esc = [];
	this.down = [];
	document.addEventListener("keydown", function(e) {
		if(e.which == CODE_UP) self.up = true;
		if(e.which == CODE_DOWN) self.down = true;
		if(e.which == CODE_LEFT) self.left = true;
		if(e.which == CODE_RIGHT) self.right = true;
	});
	document.addEventListener("keyup", function(e) {
		if(e.which == CODE_UP) self.up = false;
		if(e.which == CODE_DOWN) self.down = false;
		if(e.which == CODE_LEFT) self.left = false;
		if(e.which == CODE_RIGHT) self.right = false;
		if(e.which == CODE_ESC) {
			for(var l in self.esc) {
				self.esc[l]();
			}
		}
			for(var l in self.down) {
				self.down[l]();
			}
	});
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
