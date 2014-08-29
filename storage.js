var Storage = function() {

}

Storage.prototype.restore = function() {
    if(localStorage.cubes === undefined) {
        this.cubeScore = 0;
        this.energyScore = 0;
        this.cubes = [{
            type : "infinite.js",
            properties : {}
        }, null, null, null, null, null, null, null, null, null];
    }
    else {
        this.cubeScore = localStorage.cubes.cubeScore;
        this.energyScore = localStorage.cubes.energyScore;
        this.cubes = localStorage.cubes.cubes;
    }
}

Storage.prototype.store = function() {
    localStorage.cubes = {
        cubeScore : this.cubeScore,
        energyScore : this.energyScore,
        cubes: this.cubes
    };
}
