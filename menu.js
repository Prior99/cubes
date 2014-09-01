var Menu = function(cubes, graphics) {
	this.input = new Input();
	this.div = $("div[class='overlay']");
	this.index = 0;
	var self = this;
	this.entries = [];
};

Menu.prototype.addEntry = function(entry) {
	this.entries.push(entry);
}

Menu.prototype.start = function() {
	var div = this.div;
	for(var i in this.entries) {
		(function(entry) {
			div.append($("<button>" + entry.name + "</button>").click(function() {
				entry.method();
			}));
		})(this.entries[i]);
	}
};

Menu.prototype.destroy = function() {
	this.div.html("");
};