function(callback) {
    getCube("friend.js", function(cube) {
        cube.health = 10;
		cube.setTexture("heal_20.png");
        cube.damage = function() {
            cube.health--;
            if(cube.health <= 0) cube.kill();
        }
        callback(cube);
    });
}
