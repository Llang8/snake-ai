var xPos = 10;
var yPos = 10;
var gameSize = 20;
var xAccel = 15;
var yAccel = 15;
var xVel = 0;
var yVel = 0;
var trail=[];
var tail = 5;
var score = 0;
var highScore = 0;
var speedDifficulty = 75;
var gameSpeed;

window.onload=function() {
    canv = document.getElementById("canvas");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    gameSpeed = setInterval(game,speedDifficulty);
}

function game() {
    xPos += xVel;
    yPos += yVel;
  
    if(xPos<0 || xPos > gameSize - 1 || yPos < 0 || yPos > gameSize - 1) {
        resetGame();
    }
  
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
 
    ctx.fillStyle="white";
    for(var i=0;i<trail.length;i++) {
        ctx.fillRect(trail[i].x*gameSize,trail[i].y*gameSize,gameSize-2,gameSize-2);
        if(trail[i].x==xPos && trail[i].y==yPos) {
          resetGame();
        }
    }
    trail.push({ x:xPos , y:yPos });
    while(trail.length>tail) {
    trail.shift();
    }
 
    if(xAccel == xPos && yAccel == yPos) {
        tail++;
        score+=5;
        xAccel = Math.floor(Math.random()*gameSize);
        yAccel = Math.floor(Math.random()*gameSize);
    }
    ctx.fillStyle="red";
    ctx.fillRect(xAccel*gameSize,yAccel*gameSize,gameSize-2,gameSize-2);
    document.getElementById("score").innerHTML = "Score: " + score;
}
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37:
            if (xVel != 1) {
              xVel = -1;
              yVel = 0;
            }
            break;
        case 38:
            if ( yVel != 1 ) {
              xVel = 0;
              yVel = -1;
            }
            break;
        case 39:
            if ( xVel != -1) {
              xVel = 1;
              yVel = 0;
            }
            break;
        case 40:
            if ( yVel != -1) {
              xVel = 0;
              yVel = 1;
            }
            break;
    }
}
function resetGame() {
   if ( score > highScore) {
     highScore = score;
     document.getElementById("highScore").innerHTML = "Personal Best: " + highScore;
   }
   tail = 5;
   score = 0;
   xVel = 0;
   yVel = 0;
   xPos = 10;
   yPos = 10;
   
}
