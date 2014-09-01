function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(5);
		cube.setTexture("05.png");
        callback(cube);
    });
}
