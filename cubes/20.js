function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 20;
		cube.setTexture("20.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
