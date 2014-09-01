function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(10);
		cube.setTexture("10.png");
        callback(cube);
    });
}
