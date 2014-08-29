function(callback) {
    var cube = new Cube({
        distance : 5,
        texture : "friend.png",
        friend : true,
        speed : 0.03,
        rotation : 0,
        health : 0
    });
    cube.damage = function() {
        cube.health--;
        if(cube.health <= 0) cube.kill();
    };
    cube.addTickHandler(function(game) {
		if(game.pressed.left) cube.rotate(cube.speed);
		if(game.pressed.right) cube.rotate(-cube.speed);
    });
    callback(cube);
}
