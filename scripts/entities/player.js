Player = function (game) {
	Phaser.Sprite.call(this, game, 0, 0, 'player');
    this.init();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.init = function() {
	this.anchor.setTo(0.5, 0.5);
    this.body.gravity.y = 13;
    this.body.bounce.y = 0;
    this.x = 50;
    this.y = 50;
    this.body.collideWorldBounds = true;
    this.clearedPlatformIntitialHeight = 0;
    this.jumpable = true;
    this.bulletTime = 0;

    this.enablePlatformPhysics = true;

    this.bullets = game.add.group();
    this.bullets.createMultiple(20, 'bullet');
    this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);
    this.bulletDelay = 150;
    this.analogShoot = true;
    this.bulletVelocity = 500;
};

Player.prototype.update = function() {

    //Collide with floor
    game.physics.collide(this,floorLayer);

    //Handle down jump collision detection
    if(this.enablePlatformPhysics) {
      game.physics.collide(this,platformLayer);
    } else {
      var distanceFallen = this.y - this.clearedPlatformIntitialHeight;
      if(distanceFallen > this.height + tileset.tileHeight || this.body.touching.down) {
        this.enablePlatformPhysics = true;
      }
    }

    if(!jumpKey.isDown && !gamepad.buttons[0]) {
      this.jumpable = true;
    }

    //Handle down jump action
    if (jumpKey.isDown || gamepad.buttons[0]) {
      if(this.jumpable) {
        if (this.body.touching.down) {
          if(cursors.down.isDown || gamepad.axes[1] > .5) {
            this.body.velocity.y = -150;
            this.enablePlatformPhysics = false;
            this.clearedPlatformIntitialHeight = this.y;
          } else {
            this.body.velocity.y = -450;
          }
        }
        this.jumpable = false;
      }
    }

    this.body.velocity.x = 0;

    //Handle left and right movement
    if (cursors.left.isDown || gamepad.axes[0] < -.2)
    {
        this.body.velocity.x = -150;
    }
    else if (cursors.right.isDown || gamepad.axes[0] > .2)
    {
        this.body.velocity.x = 150;
    }
    if(sprintKey.isDown || gamepad.buttons[6]) {
      this.body.velocity.x *= 1.8;
    }

    //sprite direction
    if(this.body.velocity.x > 0) {
      this.scale.x = 1;
    } else if(this.body.velocity.x < 0) {
      this.scale.x = -1;
    }

    //handle player shot direction
    if((cursors.up.isDown || gamepad.axes[1] < -.2) && ((cursors.left.isDown || gamepad.axes[0] < -.2) || (cursors.right.isDown || gamepad.axes[0] > .2))) {
      this.projDirection = "angledUp";
    } else if(cursors.up.isDown || gamepad.axes[1] < -.2) {
      this.projDirection = "up";
      direction = 1;
  	} else if((cursors.down.isDown || gamepad.axes[1] > .2) &&((cursors.left.isDown || gamepad.axes[0] < -.2) || (cursors.right.isDown || gamepad.axes[0] > .2))) {
    	this.projDirection = "angledDown";
    } else if(cursors.down.isDown || gamepad.axes[1] > .2) {
  		this.projDirection = "down";
  		direction = -1;
    } else {
      this.projDirection = "straight";
    }

    if(this.analogShoot) {
    	if(gamepad.axes[0] > .2 || gamepad.axes[0] < -.2 || gamepad.axes[1] > .2 || gamepad.axes[1] < -.2) {
    		this.projDirection = "analog";
    		var angle = this.getGamepadAngle();
    		//console.log("angle",angle);
    	}
    }

    //handle projectile
    if(shootKey.isDown || gamepad.buttons[7] > .2) {
       this.fireBullet();
    }

};

Player.prototype.fireBullet = function() {
	if (game.time.now > this.bulletTime)
    {
        bullet = this.bullets.getFirstExists(false);

        if (bullet) {
            var direction;
            if(this.scale.x > 0) {
              direction = 1;
            } else {
              direction = -1;
            }
            bullet.anchor.setTo(.5,.5);
            switch(this.projDirection) {
              case "analog":
              	bullet.reset(this.x,this.y);
              	var angle = this.getGamepadAngle();
              	bullet.body.velocity.y = Math.sin(angle)*this.bulletVelocity;
              	bullet.body.velocity.x = Math.cos(angle)*this.bulletVelocity;
              	bullet.angle = angle*(180/Math.PI);


              	break;
              case "up":
                bullet.reset(this.x, this.y - 35);
                bullet.angle = 270;
                bullet.body.velocity.y = -this.bulletVelocity;
                bullet.body.velocity.x = 0;
                bullet.scale.x = direction;
                break;
              case "down":
              	console.log("lkj");
              	bullet.reset(this.x, this.y + 35);
              	bullet.angle = 90;
              	bullet.body.velocity.y = this.bulletVelocity;
              	bullet.body.velocity.x = 0;
              	bullet.scale.x = direction;
              	break;
              case "angledUp":
                bullet.reset(this.x,this.y);
                if(direction>0) {
                  bullet.angle = 315;
                } else {
                  bullet.angle = 45;
                }
                bullet.body.velocity.y = Math.sin(5.498)*this.bulletVelocity;
                bullet.body.velocity.x = Math.cos(.785)*this.bulletVelocity*direction;
                bullet.scale.x = direction;
                break;
              case "angledDown":
                bullet.reset(this.x,this.y);
                if(direction>0) {
                  bullet.angle = 45;
                } else {
                  bullet.angle = 315;
                }
                bullet.body.velocity.y = Math.sin(.785)*this.bulletVelocity;
                bullet.body.velocity.x = Math.cos(5.498)*this.bulletVelocity*direction;
                bullet.scale.x = direction;
                break;
              case "straight":
                bullet.reset(this.x + 35*direction, this.y);
                bullet.angle = 0;
                bullet.body.velocity.y = 0;
                bullet.body.velocity.x = this.bulletVelocity*direction;
                bullet.scale.x = direction;
                break;
            }
            this.bulletTime = game.time.now + this.bulletDelay;
        }
    }
}

Player.prototype.resetBullet = function(bullet) {
    bullet.kill();
}

Player.prototype.getGamepadAngle = function() {
	//var angle = Math.tan((gamepad.axes[1])/(gamepad.axes[0]));
	var angle = Math.atan2((gamepad.axes[1]), (gamepad.axes[0]));
	//console.log(angle);
	return angle;
}