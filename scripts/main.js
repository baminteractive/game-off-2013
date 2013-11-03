var map;
var tileset;
var floorLayer;
var platformLayer;
var player;
var cursors;
var gamepad;
var jumpKey;
var enemies;

var enableControls;

var updateGamepad = function() {
  gamepad = navigator.webkitGetGamepads()[0];
  if(!gamepad) {
    gamepad = {};
    gamepad.buttons = [];
    gamepad.axes = [];
  }
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
  game.load.image('flyingSkull','assets/entities/flyingSkull.png');

}

function create() {
    
    //Setup keys
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shootKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    sprintKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = '#06e0f4';

    //Set main map and tileset
    map = game.add.tilemap('test');
    tileset = game.add.tileset('tiles');

    //Setup tile map layers so that Phaser has access to them
    floorLayer = game.add.tilemapLayer(0, 0, map.layers[0].width*tileset.tileWidth, map.layers[0].height*tileset.tileHeight, tileset, map, 0);

    platformLayer = game.add.tilemapLayer(0,0, map.layers[1].width*tileset.tileWidth, map.layers[1].height*tileset.tileHeight, tileset, map, 1);

    //Makes sure that the world is the size of the tilemap
    floorLayer.resizeWorld();

    //Create, add, and setup camera for the player
    player = new Player(game);
    game.add.existing(player);
    game.camera.follow(player);

    //Adding enemy group
    enemies = game.add.group();
    var flyingSkull = new FlyingSkull(game);
    flyingSkull.setCoords(500,100);
    enemies.add(flyingSkull);

    //Make sure that layers aren't locked to the camera as gui layers
    floorLayer.fixedToCamera = false;
    platformLayer.fixedToCamera = false;

    //  floor
    tileset.setCollisionRange(3, 4, true, true, true, true);

    //  platform
    tileset.setCollisionRange(5, 6, false, false, true , false);

}


function update() {
  //Get up to date gamepad info
  updateGamepad();

  game.physics.collide(player.bullets, enemies, collisionHandler, null, this);
}

function collisionHandler(bullet,enemy) {
    bullet.kill();
    enemy.kill();
}

function render() {

}