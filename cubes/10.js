function() {
    var cube = new Cube();
    cube.health = 10;
    cube.damage = function() {
        this.health--;
        if(this.health <= 0) this.kill();
    }
}
