/* Colors: */
var WHITE 	= 0;
var RED 	= 1;
var GREEN 	= 2;
var BLUE 	= 3;

var WHITE_COLOR	  = 0xffffff;
var RED_COLOR	  = 0xcc3333;
var GREEN_COLOR	  = 0xf4d03f;
var BLUE_COLOR 	  = 0x4a90e2;

var backgroundColor = RED;

// The Phaser Game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update});

function preload() {
	// Preload Images
	game.load.spritesheet('player', 'assets/player.png', 64, 64);
	game.load.image('circle', 'assets/circle.png');
	game.load.image('platform', 'assets/platform.png');
	game.load.image('ground', 'assets/ground.png');
}

var ground;
var circles;
var platforms;
var player;


//  Our controls.
var cursors;

function create() {	
	// Physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	// Platforms
	platforms = game.add.group();
	platforms.enableBody = true;
		// Ground
	//var ground = platforms.create(0, game.world.height-16, 'ground');
	ground = game.add.sprite(0, game.world.height-16, 'ground');
	game.physics.enable(ground, Phaser.Physics.ARCADE);
	ground.body.immovable= true;
	ground.color = WHITE;
		//Platforms
	var platform = platforms.create(100, 100, 'platform');
	platform.color = RED;
	platform.body.immovable;
	
	// Player
	player = game.add.sprite(50, game.world.height-100, 'player');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0;
	player.body.gravity.y = 300;
	player.color = WHITE;
	player.body.collideWorldBounds = true;
	player.animations.add('right', [0, 1, 2, 3], 10, true);
	player.animations.add('left', [4, 5, 6, 7], 10, true);
	
	// Circles
	circles = game.add.group();
	circles.enableBody = true;
	
	// Controls
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	// Collisions
	game.physics.arcade.collide(player, ground);
	game.physics.arcade.collide(circles, ground);	
	game.physics.arcade.overlap(player, circles, collideCircle, null, this);
	checkCollisions();
	
	// Player movement
	player.body.velocity.x = 0;
	if (cursors.left.isDown) {
		player.body.velocity.x = -150;
		player.animations.play('left');
	}
	else if (cursors.right.isDown) {
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else {
		player.animations.stop();
		player.frame = 0;
	}
	
	if (cursors.up.isDown && player.body.touching.down) {
		player.body.velocity.y = -350;
	}
	
	// Color Changes
	if ( game.input.keyboard.addKey(Phaser.Keyboard.Z).isDown ) {
		backgroundColor = RED;
	}
	else if ( game.input.keyboard.addKey(Phaser.Keyboard.X).isDown ) {
		backgroundColor = GREEN;
	}
	else if ( game.input.keyboard.addKey(Phaser.Keyboard.C).isDown ) {
		backgroundColor = BLUE;
	}
	
	// Add Circles
	if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown ) {
		addCircle();
	}
	
	// Show colors
	colorGame();
	
	updatePlatforms();
}

// Collsions
function checkCollisions() {
	for (var i=0; i<platforms.length; i++) {
		var platform = platforms.getAt(i);
		if (platform.color == backgroundColor) continue;
		//Circles
		for (var j=0; j<circles.length; j++) {
			var circle = circles.getAt(j);
			if (circle.color != backgroundColor) {
				game.physics.arcade.collide(platform, circle);
			}
		}
		//Player
		game.physics.arcade.collide(platform, player);
	}
}

// Circle Functions
function addCircle() {
	var c = game.rnd.integerInRange(1,3);
	var x = game.rnd.integerInRange(0, game.world.width);
	var circle = circles.create(x, 0, 'circle');
	circle.color = c;
	circle.body.gravity.y = 300;
}

// Platform Functions
function addPlatform() {
	if (platforms.length < 2) {
		var w = game.world.height - 50;
		var y = game.rnd.integerInRange(25, 25+w);
		var c = game.rnd.integerInRange(1,3);
		var platform = platforms.create(game.world.width+256, y, 'platform');
		platform.color = c;
		platform.body.immovable = true;
	}
}
function destroyPlatform(platform) {
	if (platform.body.x < -256) {
		platform.destroy();
	}
}
function updatePlatforms() {
	for (var i=0; i<platforms.length; i++) {
		var platform = platforms.getAt(i);
		platform.body.x -= 1;
		destroyPlatform(platform);
	}
	addPlatform();
}

// Colors the Game
function colorGame() {
	// Circles
	for(var i=0; i<circles.length; i++) {
		var circle = circles.getAt(i);
		tintImage(circle, circle.color);
	}
	
	// Platform
	for(var i=0; i<platforms.length; i++) {
		var platform = platforms.getAt(i);
		tintImage(platform, platform.color);
	}
	
	// BackgroundColor
	var bgColor;
	if (backgroundColor == WHITE) bgColor = WHITE_COLOR;
	else if (backgroundColor == RED) bgColor = RED_COLOR;
	else if (backgroundColor == GREEN) bgColor = GREEN_COLOR;
	else if (backgroundColor == BLUE) bgColor = BLUE_COLOR;
	game.stage.backgroundColor = bgColor;
}
// Tints an image
function tintImage(img, color) {
	if (color == WHITE) { img.tint = WHITE_COLOR; }
	else if (color == RED) { img.tint = RED_COLOR; }
	else if (color == GREEN) { img.tint = GREEN_COLOR; }
	else if (color == BLUE) { img.tint = BLUE_COLOR; }
}
// Physics Methods
function collideCircle (player, circle) {
	if (backgroundColor == circle.color) {
		return;
	}
	
	circle.kill();
	console.log("Circle: " + circle.color);
}