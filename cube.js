var Cube = function(obj) {
    var self = this;
    this.distance = 0;
    this.scale = 1;
    this.rotation = 0;
    this.alpha = 1;
    if(obj) {
        for(var key in obj) {
            this[key] = obj[key];
        }
        if(obj.modelFile) {
            graphics.loadModel(obj.modelFile, function(model) {
                self.model = model;
                if(!self.texture && self.model && self.model.texture) {
                    graphics.loadTexture(self.model.texture, function(tex) {
                        self.boundTexture = tex;
                    });
                }
            });
        }
        if(obj.texture) {
            graphics.loadTexture(obj.texture, function(tex) {
                self.boundTexture = tex;
            });
        }
    }
    this.normalizeRotation();
    if(this.init) this.init();
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
