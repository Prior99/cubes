var Graphics = function(width, height, cubes, gl, callback) {
    this.textures = {};
    this.texturesLoading = {};
    this.models = {},
    this.modelsLoading = {},
    this.modelMatrixStack = [];
    this.cubes = cubes;
    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.rotation = [0, 0, 0];
    this.position = [0, 0, 0];
    this.gl = gl;
    var self = this;
    this.initShaders({
        fragment : "shader.frag",
        vertex : "shader.vert"
    }, function() {
        self.gl.clearColor(0, 0, 0, 0);
        self.gl.enable(self.gl.DEPTH_TEST);
        self.gl.enable(self.gl.BLEND);
        self.gl.blendFunc(self.gl.SRC_ALPHA, self.gl.ONE_MINUS_SRC_ALPHA);
        self.resize(width, height);
        callback();
    });
    this.backgroundPlane;
    this.backgroundTexture;
    this.brokenTexture;
    this.loadModel("plane.js", function(model) {
        self.backgroundPlane = model;
    });
    this.loadTexture("circle.png", function(tex) {
        self.backgroundTexture = tex;
    });
    this.loadTexture("damage.png", function(tex) {
        self.brokenTexture = tex;
    });
};

Graphics.prototype.displayRing = function() {
    this.ring = true;
};

Graphics.prototype.hideRing = function() {
    this.ring = false;
};

Graphics.prototype.pop = function() {
    if(this.modelMatrixStack.length == 0) {
        throw "Could not pop on empty stack!";
    }
    else {
        this.modelMatrix = this.modelMatrixStack.pop();
    }
};

Graphics.prototype.push = function() {
    var tmp = mat4.clone(this.modelMatrix);
    this.modelMatrixStack.push(tmp);
};

Graphics.prototype.loadModel = function(url, callback) {
    var self = this;
    if(this.models[url]) {
        callback(this.models[url]);
    }
    else {
        var ml;
        if(ml = this.modelsLoading[url]) {
            ml.push(callback);
        }
        else {
            ml = this.modelsLoading[url] = [];
            ml.push(callback);
            console.log("Fetching model " + url);
            $.ajax({
                url : "models/" + url,
                dataType : "text",
                success : function(data) {
                    var model = eval("(" + data + ")");
                    self.models[url] = model = self.bindModel(model);
                    for(var key in ml) {
                        ml[key](model);
                    }
                    self.modelsLoading[url] = undefined;
                }
            });
        }
    }
};

Graphics.prototype.bindModel = function(model, callback) {
    var m = {
        vertices : this.gl.createBuffer(),
        textureMap : this.gl.createBuffer(),
        faces : this.gl.createBuffer(),
        texture : model.texture,
        name : model.name,
        vertexCount : model.vertices.length / 3,
        indexCount : model.faces.length
    };
    if(model.init) model.init();
    if(!model.vertices) console.error("Model \"" + model.name + "\" is missing vertices.");
    if(!model.textureMap) console.error("Model \"" + model.name + "\" is missing textureMap.");
    if(!model.faces) console.error("Model \"" + model.name + "\" is missing faces.");
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, m.vertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(model.vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, m.textureMap);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(model.textureMap), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, m.faces);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.faces), this.gl.STATIC_DRAW);
    return m;
};

Graphics.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.gl.viewport(0, 0, this.width, this.height);
}

Graphics.prototype.start = function() {
    this.redraw();
};

Graphics.prototype.initShaders = function(shaders, callback) {
    var self = this;
    this.loadShaders(shaders, function(vertex, fragment) {
        self.shader = self.gl.createProgram();
        self.gl.attachShader(self.shader, vertex);
        self.gl.attachShader(self.shader, fragment);
        self.gl.linkProgram(self.shader);
        if(!self.gl.getProgramParameter(self.shader, self.gl.LINK_STATUS)) {
            console.error("Unable to link shaders together.");
        }
        self.gl.useProgram(self.shader);
        self.shader.vertexPositionAttribute = self.gl.getAttribLocation(self.shader, "aVertexPosition");
        self.gl.enableVertexAttribArray(self.shader.vertexPositionAttribute);
        self.shader.textureCoordAttribute = self.gl.getAttribLocation(self.shader, "aTextureCoord");
        self.gl.enableVertexAttribArray(self.shader.textureCoordAttribute);
        self.shader.projectionMatrixUniform = self.gl.getUniformLocation(self.shader, "uProjectionMatrix");
        self.shader.modelMatrixUniform = self.gl.getUniformLocation(self.shader, "uModelMatrix");
        self.shader.viewMatrixUniform = self.gl.getUniformLocation(self.shader, "uViewMatrix");
        self.shader.samplerUniform = self.gl.getUniformLocation(self.shader, "uSampler");
        self.shader.samplerUniform2 = self.gl.getUniformLocation(self.shader, "uSampler2");
        self.shader.alphaUniform = self.gl.getUniformLocation(self.shader, "uAlpha");
        self.shader.damageUniform = self.gl.getUniformLocation(self.shader, "uDamage");
        callback();
    });
};

Graphics.prototype.loadShaders = function(shaders, callback) {
    var ok = 0;
    var vertex, fragment;
    this.getShader(shaders.vertex, "vertex", function(result) {
        ok++;
        vertex = result;
        if(ok == 2) done();
    });
    this.getShader(shaders.fragment, "fragment", function(result) {
        ok++;
        fragment = result;
        if(ok == 2) done();
    });
    function done() {
        callback(vertex, fragment);
    }
};

Graphics.prototype.redraw = function() {
    var self = this;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    mat4.perspective(this.projectionMatrix, 45, this.width / this.height, 0.1, 1000.0);
    mat4.identity(this.modelMatrix);
    mat4.identity(this.viewMatrix);
    mat4.rotateX(this.viewMatrix, this.viewMatrix, this.rotation[0]);
    mat4.rotateY(this.viewMatrix, this.viewMatrix, this.rotation[1]);
    mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.rotation[2]);
    mat4.translate(this.viewMatrix, this.viewMatrix, this.position);
    this.gl.uniform1i(this.shader.samplerUniform, 0);
    this.gl.uniform1i(this.shader.samplerUniform2, 1);
    if(this.ring && this.backgroundPlane && this.backgroundTexture) {
        this.push();
        mat4.scale(this.modelMatrix, this.modelMatrix, [10.5, 10.5, 1]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0, 0, -.6]);
        this.drawModel(this.backgroundPlane, this.backgroundTexture, 1.);
        this.pop();
    }
    this.drawCubes();
    window.requestAnimationFrame(function() {
        self.redraw();
    });
};

Graphics.prototype.drawModel = function(model, texture, alpha, texture2) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.vertices);
    this.gl.vertexAttribPointer(this.shader.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.textureMap);
    this.gl.vertexAttribPointer(this.shader.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    if(texture2) {
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture2);
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, model.faces);
    this.gl.uniformMatrix4fv(this.shader.projectionMatrixUniform, false, this.projectionMatrix);
    this.gl.uniformMatrix4fv(this.shader.modelMatrixUniform, false, this.modelMatrix);
    this.gl.uniformMatrix4fv(this.shader.viewMatrixUniform, false, this.viewMatrix);
    this.gl.uniform1f(this.shader.alphaUniform, alpha);
    this.gl.drawElements(this.gl.TRIANGLES, model.indexCount, this.gl.UNSIGNED_SHORT, 0);
}

Graphics.prototype.drawCubes = function() {
    for(var c in this.cubes) {
        var cube = this.cubes[c];
        if(cube && cube.model) {
            this.push();
            mat4.rotateZ(this.modelMatrix, this.modelMatrix, cube.rotation);
            var offset = (1 - cube.scale) / 2;
            mat4.translate(this.modelMatrix, this.modelMatrix, [cube.distance, 0, 0]);
            mat4.scale(this.modelMatrix, this.modelMatrix, [cube.scale, cube.scale, cube.scale]);
            mat4.translate(this.modelMatrix, this.modelMatrix, [offset, offset, offset]);
            if(cube.initHealth !== undefined) {
                this.gl.uniform1f(this.shader.damageUniform, cube.getHealthRel());
                this.drawModel(cube.model, cube.boundTexture, cube.alpha, this.brokenTexture);
            }
            else {
                this.gl.uniform1f(this.shader.damageUniform, 0.);
                this.drawModel(cube.model, cube.boundTexture, cube.alpha);
            }
            this.pop();
        }
    }
},

Graphics.prototype.getShader = function(filename, type, callback) {
    var self = this;
    $.ajax({
        url : filename,
        success : function(data) {
            var shader;
            if(type.toLowerCase() == "fragment") {
                shader = self.gl.createShader(self.gl.FRAGMENT_SHADER);
            }
            else if(type.toLowerCase() == "vertex") {
                shader = self.gl.createShader(self.gl.VERTEX_SHADER);
            }
            else {
                console.error("Unknown type of shader: \"" + type + "\"");
                callback(null);
            }
            self.gl.shaderSource(shader, data);
            self.gl.compileShader(shader);
            if (!self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)) {
                console.error("Unable to compile shader \"" + filename + "\":" + self.gl.getShaderInfoLog(shader));
                callback(null);
            }
            callback(shader);
        }
    });
};

Graphics.prototype.loadTexture = function(url, callback) {
    var self = this;
    if(this.textures[url]) callback(this.textures[url]);
    else {
        var tl;
        if(tl = this.texturesLoading[url]) {
            tl.push(callback);
        }
        else {
            console.log("Fetching texture " + url);
            tl = this.texturesLoading[url] = [];
            tl.push(callback);
            var img = new Image();
            img.onload = function() {
                var tex = self.gl.createTexture();
                self.gl.bindTexture(self.gl.TEXTURE_2D, tex);
                self.gl.pixelStorei(self.gl.UNPACK_FLIP_Y_WEBGL, true);
                self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, self.gl.RGBA, self.gl.UNSIGNED_BYTE, img);
                self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
                self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR);
                self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_S, self.gl.REPEAT);
                self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_T, self.gl.REPEAT);
                self.gl.bindTexture(self.gl.TEXTURE_2D, null);
                self.textures[url] = tex;
                for(var key in tl) {
                    tl[key](tex);
                }
                self.texturesLoading[url] = undefined;
            }
            img.src = "textures/" + url;
        }
    }
};

Graphics.prototype.rotate = function(x, y, z) {
    this.rotation[0] += x;
    this.rotation[1] += y;
    this.rotation[2] += z;
    return this;
};

Graphics.prototype.setRotation = function(x, y, z) {
    this.rotation[0] = x;
    this.rotation[1] = y;
    this.rotation[2] = z;
    return this;
};

Graphics.prototype.move = function(x, y, z) {
    this.position[0] += x;
    this.position[1] += y;
    this.position[2] += z;
    return this;
};

Graphics.prototype.setPosition = function(x, y, z) {
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    return this;
};
