var CODE_LEFT = 37;
var CODE_UP = 38;
var CODE_RIGHT = 39;
var CODE_DOWN = 40;

var Input = function() {
	var self = this;
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
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
	});
}
