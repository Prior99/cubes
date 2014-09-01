function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 75;
		cube.setTexture("75.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
