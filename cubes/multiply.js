function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 10;
		cube.setTexture("multiply.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
