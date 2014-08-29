function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 10;
        cube.damage = function() {
            this.health--;
            if(this.health <= 0) this.kill();
        }
        callback(cube);
    });
}
