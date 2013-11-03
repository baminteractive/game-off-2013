FlyingSkull = function (game) {
	Enemy.call(this, game, 0, 0, 'flyingSkull');
  this.x = 300;
  this.y = 100;
};

FlyingSkull.prototype = Object.create(Enemy.prototype);
FlyingSkull.prototype.constructor = FlyingSkull;


FlyingSkull.prototype.update = function() {

  //Enemy Update stuff here
  Enemy.prototype.update.call(this);
};