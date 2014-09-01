function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 50;
		cube.setTexture("50.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
