function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(50);
		cube.setTexture("50.png");
        callback(cube);
    });
}
