function(callback) {
    getCube("friend.js", function(cube) {
        cube.setHealth(5);
		cube.setTexture("heal.png");
        cube.damage = function(game) {
            cube.health--;
            if(cube.health <= 0) {
                cube.kill();
                cube.health = 0;
            }
            if(game.hp < game.initialHP) {
                game.hp++;
            }
            game.redrawHUD();
        };
        callback(cube);
    });
}
