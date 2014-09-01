function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 100;
		cube.setTexture("100.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
