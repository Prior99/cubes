function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 5;
		cube.setTexture("05.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
