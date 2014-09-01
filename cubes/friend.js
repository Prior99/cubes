function(callback) {
    var cube = new Cube({
        distance : 5,
        friend : true,
        speed : 0.045,
        rotation : 0,
        health : 0
    });
    cube.damage = function() {
        cube.health--;
        if(cube.health <= 0) {
            cube.kill();
            cube.health = 0;
        }
    };
    cube.addTickHandler(function(game) {
		if(game.pressed.left) cube.rotate(cube.speed);
		if(game.pressed.right) cube.rotate(-cube.speed);
    });
    cube.setHealth = function(h) {
        this.health = h;
        this.initHealth = h;
    };
    cube.getHealthRel = function() {
        return 0.9 - Math.floor((this.health/this.initHealth) * 9) / 10;
    };
    callback(cube);
}
