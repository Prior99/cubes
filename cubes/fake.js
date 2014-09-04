function(callback) {
    var cube = new Cube({
    	scale : 0.7,
        enemy : false,
        distance : 20,
        rotation : 0,
        speed : 0.01
    });
	cube.setTexture("enemy.png");
    cube.addTickHandler(function() {
        cube.move(-cube.speed);
    });
    callback(cube);
}
