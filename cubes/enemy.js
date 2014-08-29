function(callback) {
    var cube = new Cube({
    	texture : "enemy.png",
    	scale : 0.7,
        enemy : true,
        distance : 20,
        rotation : 0,
        speed : 0.01
    });
    cube.addTickHandler(function(game) {
        if(cube.distance < 6 && cube.distance > 4.7 && !cube.killed) {
			for(var c in game.cubes) {
				var other = game.cubes[c];
				if(other.friend && Math.abs(other.rotation - other.rotation) < 0.22) {
					cube.kill();
					localStorage.points++;
				}
			}
		}
		if(!cube.killed) cube.move(-cube.speed);
		if(cube.distance < 1 && !cube.killed) cube.kill();
    });
    callback(cube);
}
