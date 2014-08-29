function (callback) {
    getCube("friend.js", function(cube) {
        cube.damage = function() {

        };
        callback(cube);
    });
}
