var Storage = function() {

}

Storage.prototype.restore = function() {
    if(localStorage.cubes === undefined) {
        this.cubeScore = 0;
        this.energyScore = 0;
        this.cubes = [{
            type : "infinite.js",
        }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    }
    else {
        var r = JSON.parse(localStorage.cubes);
        this.cubeScore = r.cubeScore;
        this.energyScore = r.energyScore;
        this.cubes = r.cubes;
    }
}

Storage.prototype.store = function() {
    localStorage.cubes = JSON.stringify({
        cubeScore : this.cubeScore,
        energyScore : this.energyScore,
        cubes: this.cubes
    });
}
