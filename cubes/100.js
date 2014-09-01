function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(100);
		cube.setTexture("100.png");
        callback(cube);
    });
}
