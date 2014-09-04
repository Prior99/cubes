var Storage = function() {

}

Storage.prototype.restore = function() {
    if(localStorage.cubes === undefined) {
        this.cubes = [{
            type : "infinite.js",
        }, null, null, null, null, null, null, null, null, null, null, null];
        this.red = 0;
        this.blue = 0;
    }
    else {
        var r = JSON.parse(localStorage.cubes);
        this.red = r.red;
        this.blue = r.blue;
        this.cubes = r.cubes;
    }
}

Storage.prototype.store = function() {
    localStorage.cubes = JSON.stringify({
        red : this.red,
        blue : this.blue,
        cubes: this.cubes
    });
}
