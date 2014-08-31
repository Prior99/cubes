var Cube = function(obj) {
    var self = this;
    this.modelFile = "cube.js";
    this.enabled = true;
    this.distance = 0;
    this.scale = 1;
    this.rotation = 0;
    this.alpha = 1;
    this.tickHandlers = [];
    if(obj) {
        for(var key in obj) {
            this[key] = obj[key];
        }
    }
    graphics.loadModel(this.modelFile, function(model) {
        self.model = model;
        if(!self.texture && self.model && self.model.texture) {
            graphics.loadTexture(self.model.texture, function(tex) {
                self.boundTexture = tex;
            });
        }
    });
    /*graphics.loadTexture(this.texture, function(tex) {
        self.boundTexture = tex;
    });*/
    this.normalizeRotation();
    if(this.init) this.init();
};

Cube.prototype.setTexture = function(tex) {
    var self = this;
    graphics.loadTexture(tex, function(tex) {
        self.boundTexture = tex;
    });
};

Cube.prototype.rotate = function(a) {
    this.rotation += a;
    this.normalizeRotation();
    return this;
};

Cube.prototype.normalizeRotation = function() {
    while(this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2;
    while(this.rotation < 0) this.rotation += Math.PI * 2;
};

Cube.prototype.setRotation = function(a) {
    this.rotation = a;
    this.normalizeRotation();
    return this;
};

Cube.prototype.move = function(x) {
    this.distance += x;
    return this;
};

Cube.prototype.setPosition = function(x) {
    this.distance = x;
    return this;
};

Cube.prototype.damage = function() {

};

Cube.prototype.kill = function() {
	this.killed = 1;
};

Cube.prototype.tick = function(game) {
    for(var t in this.tickHandlers) {
        this.tickHandlers[t](game);
    }
	if(this.killed !== undefined) {
		this.killed -= 0.01;
		this.alpha = this.killed;
		if(this.killed < 0) this.remove();
	}
};

Cube.prototype.remove = function() {
    this.enabled = false;
}

Cube.prototype.addTickHandler = function(handler) {
    this.tickHandlers.push(handler);
};
