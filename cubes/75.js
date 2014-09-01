function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(75);
		cube.setTexture("75.png");
        callback(cube);
    });
}
