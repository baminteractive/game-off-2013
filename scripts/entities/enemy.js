Enemy = function (game,x,y,key) {
	Phaser.Sprite.call(this, game, x, y,key);
    this.anchor.setTo(0.5, 0.5);
  	this.body.collideWorldBounds = true;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {

};