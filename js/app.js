
/* Let's setup some global playing paramters
   Where the player starts, how many rows and columns on the boards, whether or not we've won,
   how many times, we've gone across, how many times we need to go across to win. */

var game = {
    win : false,
    numCols : 5,
    playerStartCol : 2,
    playerStartRow: 5,
    timesAcross: 0,
    winTimes: 3
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //Let's define the corners of our bug image inside the sprite for later use in dteecting collisions
    
    this.top_offset = 76;       //Offset of bug from top of sprite is 62 pixels
    this.left_offset = 3;       //Offset from the left
    this.right_offset = 2;      //Offset from right
    this.bottom_offset = 28;    //Offset from bottom
    this.ht = 64;
    this.wd = 95;

    //Start the bug all the way to the left
    this.x = -101;
    //Pick a random row for this bug between 1 and 3
    home_row = Math.floor((Math.random() * 3) + 1);
    this.y = (home_row * 83) - 20;
    //Pick a random speed between 1 and 5
    //TO DO: Make more speeds as the player progresses
    this.speed = Math.floor((Math.random() * 5) + 1);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // We multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. 
    // NOTE: Also use a fudge factor based on my measurements - may need further tweaking

    //Tweak the speed based on the dt parameter
    adjusted_speed = this.speed * 60 * dt;
    // Set the new bug position based on speed
    this.x = this.x + adjusted_speed;
    //If the bug has reached the edge, then wrap it and pick a new row
    if(this.x >= (game.numCols+1)*101) {
        this.x = -101;
        home_row = Math.floor((Math.random() * 3) + 1);
        this.y = (home_row * 83) - 20;      
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// The function inside is a helper function, used for collision detection.
// It returns true if a passed in x and y point are inside
// a bounding box defined by the upper left and lower right points contained in the corners array.
var inside = function(xpt,ypt,corners) {
    if((xpt > corners[0]) &&
        (xpt < corners[2]) &&
        (ypt > corners[1]) &&
        (ypt < corners[3]))
        return(true);
    else
        return(false);
}

var updateTimesDisplay = function() {
    var times = document.getElementById('timesArea');
 
    var someText = "You've gone across " + game.timesAcross;   
    if(game.timesAcross == 1) {
        someText = someText + " time!";
    } else {
        someText = someText + " times!";
    }
    var timesText = document.createTextNode(someText);
    var textLine = times.childNodes[0];

    if(textLine == null) {
        var para = document.createElement("p");
        para.appendChild(timesText);
        times.appendChild(para);        
    } else {
        textLine.replaceChild(timesText, textLine.childNodes[0]);
    }
}

var addBug = function() {
    // Make a new bug
    aNewBug = new Enemy();
    allEnemies[allEnemies.length] = aNewBug;
}

var resetBugs =function() {
    //Go back to three bugs
    while(allEnemies.length > 3) {
        allEnemies.pop();
    }
}

// This collision function checks each point of the enemy's bounding box and sees if it overlaps
// with the passed in player's box.

Enemy.prototype.collision = function(corners) {
    //Check each enemy corner point and see if it is inside the player corners
    if(inside((this.x + this.left_offset),(this.y + this.top_offset), corners))
        return(true);
    else if(inside((this.x + this.left_offset + this.wd), (this.y + this.top_offset), corners))
        return(true);
    else if(inside((this.x + this.left_offset), (this.y + this.top_offset + this.ht), corners))
        return(true);
    else if(inside((this.x + this.left_offset + this.wd), (this.y + this.top_offset + this.ht), corners))
        return(true);
    else return(false);
}


// Here we write our own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-pink-girl.png';

    this.top_offset = 62; //Offset of boys head from top of sprite is 62 pixels
    this.left_offset = 17; //Offset from the left
    this.right_offset = 16; //Offset from right
    this.bottom_offset = 32; //Offset from bottom
    this.ht = 75;
    this.wd = 64;

    this.col = game.playerStartCol;
    this.row = game.playerStartRow;
    this.x = this.col * 101;
    this.y = (this.row * 83) - 20;
}

// We might use this if we ever wanted the player to move on their own, but right now
// it's just a stub.
Player.prototype.update = function(dt){
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function() {
    this.col = game.playerStartCol;
    this.row = game.playerStartRow;
    this.x = this.col * 101;
    this.y = (this.row * 83) - 20;    

    // Clear the canvas so that top part of players head is covered up
    ctx.clearRect ( 0 , 0 , 505, 606 );  

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
            if(this.row >= 0) {
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
    //If the player got to the end, then increment the times across and make another bug
    // Move the player back to the start. 
    // If we make it across five times, you win
    if(this.row < 0) {
        game.timesAcross++;
        if(game.timesAcross == game.winTimes) {
            // If we win, don't need to move so just return.
            game.win = true;
            doWin();
            return;
        }
        addBug();       
        updateTimesDisplay();            
        // Put the player back to the start
        this.reset();
      
    }

    //Now adjust the x & y position based on new row or column
    this.x = this.col * 101;
    this.y = (this.row * 83) - 20;   
    
    //Let's play a little sound signifying player moved
    var snd = new Audio('sounds/click.wav'); // buffers automatically when created
    snd.play();
}


    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
function reset() {
    player.reset();
    resetBugs();
    game.timesAcross = 0;
    updateTimesDisplay();
}


function doWin() {
    var snd = new Audio('sounds/win.mp3'); // buffers automatically when created
    snd.play();

    setTimeout(function() {
        var r = confirm("You Win!   Play again?");
        if (r == true) {
            game.win = false;
            game.timesAcross = 0;
            reset(); 
        }
    }, 2000);   
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var bug1 = new Enemy();
var bug2 = new Enemy();
var bug3 = new Enemy();

var allEnemies = [bug1,bug2,bug3];

var player = new Player();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // If we've won the game, disallow further movement while we play the win song
    // and ask if player wants to play again.
    if(!game.win)
        player.handleInput(allowedKeys[e.keyCode]);
});
