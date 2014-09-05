function(callback) {
    getCube("heal.js", function(cube) {
        cube.setHealth(20);
		cube.setTexture("heal_20.png");
        callback(cube);
    });
}
