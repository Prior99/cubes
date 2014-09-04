function(callback) {
    var cube = new Cube({
    	scale : 0.7,
        enemy : true,
        distance : 20,
        rotation : 0,
        speed : 0.01
    });
	cube.setTexture("enemy.png");
    cube.addTickHandler(function(game) {
        var threshold = 0.16;
        if(cube.distance < 5.75 && cube.distance > 5.6 && !cube.killed) {
			for(var c in game.cubes) {
				var other = game.cubes[c];
                console.log((other.rotation) + " - " + (cube.rotation) + " = " + Math.abs(other.rotation - cube.rotation));
				if(other.friend && (
                    Math.abs(other.rotation - cube.rotation) < threshold ||
                    Math.abs(other.rotation - cube.rotation - Math.PI * 2) < threshold
                )) {
					cube.kill();
                    game.giveRed();
                    other.damage(1);
				}
			}
		}
		if(!cube.killed) cube.move(-cube.speed);
		if(cube.distance < 1 && !cube.killed) {
            cube.kill();
            game.damage();
        }
    });
    callback(cube);
}
