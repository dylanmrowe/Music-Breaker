
var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {preload: preload, create: create, update: update}, true);

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var playing = false;
var startButton;
var speeder = 0;
var bricksAlive;

function preload() {
	handleRemoteImagesOnJSFiddle();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.zIndex = 500;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = 'rgba(0, 0, 255, 0.8)';
    game.load.image('paddle', 'paddle3.png');
    game.load.image('brick3', 'brick3.png');
	game.load.image('brick4', 'brick4.png');
	game.load.image('brick5', 'brick5.png');
	game.load.image('brick6', 'brick6.png');
	game.load.image('brick7', 'brick7.png');
    game.load.spritesheet('ball', 'wobble2.png', 20, 20);
    game.load.spritesheet('button', 'button2.png', 120, 40);
	alert('Try out FullScreen! (Bottom Right Icon)');
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
    //ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

	textStyle = { font: '18px Arial', fill: '#00feDD' };
    textStyle2 = { font: '18px Arial', fill: '#FF0000' };
    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
    livesText = game.add.text(game.world.width-5, 5, 'Lives: '+lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'FAIL. Click to continue...', textStyle2);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
}
function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    if(playing) {
        paddle.x = game.input.x || game.world.width*0.5;
    }
}
function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    }
	bricksAlive = 0;
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
			var rand = Math.floor((Math.random() * 5) + 1);
			if(rand == 1){
				newBrick = game.add.sprite(brickX, brickY, 'brick3');
			}
			else if(rand == 2){
				newBrick = game.add.sprite(brickX, brickY, 'brick4');
			}
			else if(rand == 3){
				newBrick = game.add.sprite(brickX, brickY, 'brick5');
			}
			else if(rand == 4){
				newBrick = game.add.sprite(brickX, brickY, 'brick6');
			}
			else{
				newBrick = game.add.sprite(brickX, brickY, 'brick7');
			}
            
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
			bricksAlive += 1;
        }
    }
}
function ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();
    score += 10;
	bricksAlive -= 1;
	if(brick.texture == 'brick3.png'){
		alert('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n'+
				'░░░░░░░░░░░░░▄▄▄▄▄▄▄░░░░░░░░░\n'+
				'░░░░░░░░░▄▀▀▀░░░░░░░▀▄░░░░░░░\n'+
				'░░░░░░░▄▀░░░░░░░░░░░░▀▄░░░░░░\n'+
				'░░░░░░▄▀░░░░░░░░░░▄▀▀▄▀▄░░░░░\n'+
				'░░░░▄▀░░░░░░░░░░▄▀░░██▄▀▄░░░░\n'+
				'░░░▄▀░░▄▀▀▀▄░░░░█░░░▀▀░█▀▄░░░\n'+
				'░░░█░░█▄▄░░░█░░░▀▄░░░░░▐░█░░░\n'+
				'░░▐▌░░█▀▀░░▄▀░░░░░▀▄▄▄▄▀░░█░░\n'+
				'░░▐▌░░█░░░▄▀░░░░░░░░░░░░░░█░░\n'+
				'░░▐▌░░░▀▀▀░░░░░░░░░░░░░░░░▐▌░\n'+
				'░░▐▌░░░░░░░░░░░░░░░▄░░░░░░▐▌░\n'+
				'░░▐▌░░░░░░░░░▄░░░░░█░░░░░░▐▌░\n'+
				'░░░█░░░░░░░░░▀█▄░░▄█░░░░░░▐▌░\n'+
				'░░░▐▌░░░░░░░░░░▀▀▀▀░░░░░░░▐▌░\n'+
				'░░░░█░░░░░░░░░░░░░░░░░░░░░█░░\n'+
				'░░░░▐▌▀▄░░░░░░░░░░░░░░░░░▐▌░░\n'+
				'░░░░░█░░▀░░░░░░░░░░░░░░░░▀░░░\n'+
				'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n');
	}
    scoreText.setText('Points: '+score);
    //if(score === brickInfo.count.row*brickInfo.count.col*10) {
	if(bricksAlive == 0){
		alert('FASTER\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n'+
		'░░░░░░░░░░░░░▄▄▄▄▄▄▄░░░░░░░░░\n'+
		'░░░░░░░░░▄▀▀▀░░░░░░░▀▄░░░░░░░\n'+
		'░░░░░░░▄▀░░░░░░░░░░░░▀▄░░░░░░\n'+
		'░░░░░░▄▀░░░░░░░░░░▄▀▀▄▀▄░░░░░\n'+
		'░░░░▄▀░░░░░░░░░░▄▀░░██▄▀▄░░░░\n'+
		'░░░▄▀░░▄▀▀▀▄░░░░█░░░▀▀░█▀▄░░░\n'+
		'░░░█░░█▄▄░░░█░░░▀▄░░░░░▐░█░░░\n'+
		'░░▐▌░░█▀▀░░▄▀░░░░░▀▄▄▄▄▀░░█░░\n'+
		'░░▐▌░░█░░░▄▀░░░░░░░░░░░░░░█░░\n'+
		'░░▐▌░░░▀▀▀░░░░░░░░░░░░░░░░▐▌░\n'+
		'░░▐▌░░░░░░░░░░░░░░░▄░░░░░░▐▌░\n'+
		'░░▐▌░░░░░░░░░▄░░░░░█░░░░░░▐▌░\n'+
		'░░░█░░░░░░░░░▀█▄░░▄█░░░░░░▐▌░\n'+
		'░░░▐▌░░░░░░░░░░▀▀▀▀░░░░░░░▐▌░\n'+
		'░░░░█░░░░░░░░░░░░░░░░░░░░░█░░\n'+
		'░░░░▐▌▀▄░░░░░░░░░░░░░░░░░▐▌░░\n'+
		'░░░░░█░░▀░░░░░░░░░░░░░░░░▀░░░\n'+
		'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n');
		
		//bricks.destroy(true, true);
		initBricks();
		
		speeder += 100;
		ball.reset(game.world.width*0.5, game.world.height-25);
		ball.body.velocity.set(200+speeder, -200-speeder);
        //location.reload();
    }
}
function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Lives: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(200+speeder, -200-speeder);
        }, this);
    }
    else {
        alert('Dead. Score = ' + score);
		score = 0;
		speeder = 0;
		lives = 3;
		scoreText.setText('Points: '+score);
		livesText.setText('Lives: '+lives);
		startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    	startButton.anchor.set(0.5);
		ball.reset(game.world.width*0.5, game.world.height-25);
		/*for (var i = 0, len = bricks.children.length; i < len; i++) 
		{  		
				//console.log(bricks.children[i]);
			if(bricks.children[i] != undefined){
				var killTween = game.add.tween(bricks.children[i].scale);
				killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
				killTween.onComplete.addOnce(function(){
					bricks.children[i].kill();
				}, this);
				killTween.start();
			}
			
		}*/
		bricks.destroy(true, true);
        //location.reload();
    }
}
function ballHitPaddle(ball, paddle) {
    //ball.animations.play('wobble');
    ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}
function startGame() {
	initBricks();
    startButton.destroy();
    ball.body.velocity.set(200+speeder, -200-speeder);
    playing = true;
}

// this function (needed only on JSFiddle) take care of loading the images from the remote server
function handleRemoteImagesOnJSFiddle() {
	game.load.baseURL = './pictures/';
	game.load.crossOrigin = 'anonymous';
}