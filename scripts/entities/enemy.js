Enemy = function (game,x,y,key) {
	Phaser.Sprite.call(this, game, x, y,key);
    this.anchor.setTo(0.5, 0.5);
  	this.body.collideWorldBounds = true;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	if(this.body.velocity.x < 0) {
		this.scale.x = -1;
	} else if(this.body.velocity.x > 0) {
		this.scale.x = 1;
	}
};

//Returns weather the target is in range of this enemy
Enemy.prototype.targetInRange = function(target,range) {
	var distance = game.physics.distanceBetween(this,target);
	if(distance <= range) {
		return true;
	}
	return false;
};