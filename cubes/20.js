function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(20);
		cube.setTexture("20.png");
        callback(cube);
    });
}
