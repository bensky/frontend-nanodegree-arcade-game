// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //Start the bug all the way to the left
    this.x = -101;
    //Pick a random row
    home_row = Math.floor((Math.random() * 3) + 1);
    this.y = (home_row * 83) - 20;
    //Pick a random speed
    this.speed = Math.floor((Math.random() * 5) + 1);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    numCols = 5;
    this.x = this.x + this.speed;
    //If the bug has reached the edge, then wrap it and pick a new row
    if(this.x >= (numCols+1)*101) {
        this.x = -101;
        home_row = Math.floor((Math.random() * 3) + 1);
        this.y = (home_row * 83) - 20;      
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(start_col,start_row){
    this.sprite = 'images/char-boy.png';
    this.col = start_col;
    this.row = start_row;
    this.x = this.col * 101;
    this.y = (this.row * 83) - 20;
}

Player.prototype.update = function(dt){
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(input) {
    switch(input) {
        case 'left':
            if(this.col > 0) {
                this.col--;
            }
            break;
        case 'right':
            if(this.col < 4) {
                this.col++;
            }
            break; 
        case 'up':
            if(this.row > 0) {
                this.row--;
            }
            break;    
        case 'down':
            if(this.row < 5) {
                this.row++;
            }
            break;    
        default:
            break;
    }
    this.x = this.col * 101;
    this.y = (this.row * 83) - 20;   
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var bug1 = new Enemy();
var bug2 = new Enemy();
var bug3 = new Enemy();

var allEnemies = [bug1,bug2,bug3];

var player = new Player(2,5)



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
