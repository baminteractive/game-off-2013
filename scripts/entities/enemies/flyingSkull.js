FlyingSkull = function (game) {
	Enemy.call(this, game, 0, 0, 'flyingSkull');
  this.x = 300;
  this.y = 100;
  this.currentAction = "patrol";
  this.initialCoords = {};
  this.patrolRange = {x:150,y:10};
  this.patrolVelocity = {x:50,y:20};
  this.patrolDirection = -1;
};

FlyingSkull.prototype = Object.create(Enemy.prototype);
FlyingSkull.prototype.constructor = FlyingSkull;

FlyingSkull.prototype.setCoords = function(x,y) {
  this.x = x;
  this.y = y;
  this.initialCoords = {x:x,y:y};
  this.body.velocity.x = this.patrolVelocity.x * -1;
}



FlyingSkull.prototype.update = function() {
  
  //If enemy is within range, follow it!
  if(this.targetInRange(player,200)) {
    this.currentAction = "follow";
  } else if(!this.targetInRange(player,200) && this.currentAction == "follow") {
    this.setCoords(this.x,this.y);
    this.currentAction = "patrol";

  }

  switch(this.currentAction) {
    case "patrol":
      //Handle X Bobbing
      if(this.x <= this.initialCoords.x - this.patrolRange.x/2) {
        this.body.velocity.x = this.patrolVelocity.x;
      } else if(this.x > this.initialCoords.x + this.patrolRange.x/2) {
        this.body.velocity.x = this.patrolVelocity.x * -1;
      } else if(this.body.velocity.x == 0) {
        this.body.velocity.x = this.patrolVelocity.x*-1;
      }

      //Handle Y Bobbing
      if(this.y <= this.initialCoords.y - this.patrolRange.y/2) {
        this.body.velocity.y = this.patrolVelocity.y;
      } else if(this.y > this.initialCoords.y + this.patrolRange.y/2) {
        this.body.velocity.y = this.patrolVelocity.y*-1;
      } else if(this.body.velocity.y ==0) {
        this.body.velocity.y = this.patrolVelocity.y;
      }
      break;
    case "follow":
      game.physics.moveToObject(this,player,100);
      break;
  }
  //Enemy Update stuff here
  Enemy.prototype.update.call(this);
};