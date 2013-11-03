console.log("woot");

console.log(Modernizr.gamepads);


var map;
var tileset;
var floorLayer;
var platformLayer;
var p;
var cursors;
var gamepad;
var jumpKey;

var bullets;
var bulletTime = 0;

var enableControls;
var enablePlatformPhysics;

var updateGamepad = function() {
  gamepad = navigator.webkitGetGamepads()[0];
  if(!gamepad) {
    gamepad = {};
    gamepad.buttons = [];
    gamepad.axes = [];
  }
  //console.log(gamepad);
}

if(Modernizr.gamepads) {
  updateGamepad();
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'main', { preload: preload, create: create, update: update });


function preload() {
  game.load.tilemap('test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.tileset('tiles', 'assets/tiles/tiles1.png', 32, 32, -1, 0, 0);
  game.load.image('player', 'assets/entities/nathan.png');
  game.load.image('bullet','assets/entities/bullet.png');

}

function create() {
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    game.stage.backgroundColor = '#06e0f4';

    map = game.add.tilemap('test');
    tileset = game.add.tileset('tiles');

    floorLayer = game.add.tilemapLayer(0, 0, map.layers[0].width*tileset.tileWidth, map.layers[0].height*tileset.tileHeight, tileset, map, 0);

    platformLayer = game.add.tilemapLayer(0,0, map.layers[1].width*tileset.tileWidth, map.layers[1].height*tileset.tileHeight, tileset, map, 1);

 
    floorLayer.resizeWorld();
    //game.world.setBounds(0,0,2000,2000);

    floorLayer.fixedToCamera = false;
    platformLayer.fixedToCamera = false;
    enablePlatformPhysics = true;


    //  floor
    tileset.setCollisionRange(3, 4, true, true, true, true);

    //  platform
    tileset.setCollisionRange(5, 6, false, false, true , false);

    p = game.add.sprite(32, 32, 'player');

    p.body.gravity.y = 13;
    p.body.bounce.y = 0;
    p.x = 50;
    p.y = 50;
    p.body.collideWorldBounds = true;
    p.anchor.setTo(.5,.5);
    p.clearedPlatformIntitialHeight = 0;

    console.log(p);

    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();

    bullets = game.add.group();
    bullets.createMultiple(10, 'bullet');
    bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);

}


function update() {

  updateGamepad();

    //Collide with floor
    game.physics.collide(p,floorLayer);

    //Handle down jump collision detection
    if(enablePlatformPhysics) {
      game.physics.collide(p,platformLayer);
    } else {
      var distanceFallen = p.y - p.clearedPlatformIntitialHeight;
      //console.log(distanceFallen);
      //TODO: Only down jump if colliding with platform layer
      if(distanceFallen > p.height + tileset.tileHeight || p.body.touching.down) {
        enablePlatformPhysics = true;
      }
    }

    p.body.velocity.x = 0;

    //Handle down jump action
    if (jumpKey.isDown || gamepad.buttons[0])
    {

        if (p.body.touching.down) {
          if(cursors.down.isDown || gamepad.axes[1] > .5) {
            console.log("down jump!");
            p.body.velocity.y = -150;
            enablePlatformPhysics = false;
            p.clearedPlatformIntitialHeight = p.y;
          } else {
            p.body.velocity.y = -450;
          }
        }
    }

    //Handle left and right movement
    if (cursors.left.isDown || gamepad.axes[0] < -.2)
    {
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown || gamepad.axes[0] > .2)
    {
        p.body.velocity.x = 150;
    }

    //sprite direction
    if(p.body.velocity.x > 0) {
      p.scale.x = 1;
    } else if(p.body.velocity.x < 0) {
      p.scale.x = -1;
    }

    //handle player shot direction
    if(cursors.up.isDown && (cursors.left.isDown || cursors.right.isDown)) {
      p.projDirection = "angled";
    } else if(cursors.up.isDown) {
      p.projDirection = "up";
    } else {
      p.projDirection = "straight";
    }

    //handle projectile
    if(shootKey.isDown) {
       fireBullet();
    }


}

function render() {
  game.debug.renderCameraInfo(game.camera, 32, 32);
  game.debug.renderSpriteCollision(p, 32, 320);
}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            var direction;
            if(p.scale.x > 0) {
              direction = 1;
            } else {
              direction = -1;
            }
            bullet.anchor.setTo(.5,.5);
            switch(p.projDirection) {
              case "up":
                bullet.reset(p.x, p.y - 35);
                bullet.angle = 270;
                bullet.body.velocity.y = -300;
                bullet.body.velocity.x = 0;
                break;
              case "angled":
                bullet.reset(p.x,p.y);
                if(direction>0) {
                  bullet.angle = 315;
                } else {
                  bullet.angle = 45;
                }
                bullet.body.velocity.y = -190;
                bullet.body.velocity.x = 230*direction;
                bullet.scale.x = direction;
                break;
              case "straight":
                bullet.reset(p.x + 35*direction, p.y);
                bullet.angle = 0;
                bullet.body.velocity.y = 0;
                bullet.body.velocity.x = 300*direction;
                bullet.scale.x = direction;
                break;
            }
            bulletTime = game.time.now + 250;
        }
    }

}


//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
    bullet.kill();
}