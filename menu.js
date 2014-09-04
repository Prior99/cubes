var Menu = function(cubes, graphics) {
	this.input = new Input();
	this.div = $("#wrapper");
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
			div.append($("<div class='button'></div>")
				.append("<div class='name'>" + entry.name + "</div>")
				.append("<div class='description'>" + entry.description + "</div>")
				.click(function() {
					entry.method();
				})
			);
		})(this.entries[i]);
	}
};

Menu.prototype.destroy = function() {
	this.div.html("");
};
