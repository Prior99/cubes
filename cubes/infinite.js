function (callback) {
    getCube("friend.js", function(cube) {
		cube.setTexture("infinite.png");
        cube.damage = function() {

        };
        callback(cube);
    });
}
