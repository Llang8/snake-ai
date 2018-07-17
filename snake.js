var xPos = 10;
var yPos = 10;
var gameSize = 20;
var xAccel = 15;
var yAccel = 15;
var xVel = 0;
var yVel = 0;
var trail=[];
var setTail = 5;
var tail = setTail;
var score = 0;
var highScore = 0;
var speedDifficulty = 75;
var gameSpeed;
var moveRecord = [];
var currGen = 0;
var gameRunning = true;
var direction = ['left', 'forward', 'right'];

window.onload=function() {
    canv = document.getElementById("canvas");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    gameSpeed = setInterval(game,speedDifficulty);
}

function game() {
    xPos += xVel;
    yPos += yVel;

    if (xVel != 0 || yVel != 0) {
      gameRunning = true;
    }
    moveRecord.push(getPosArr());
    keyPush(makePrediction(getPosArr()));;
    //console.log(predictedInput);

    if(xPos<0 || xPos > gameSize - 1 || yPos < 0 || yPos > gameSize - 1) {
        resetGame();
    }

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);

    ctx.fillStyle="white";
    for(var i=0;i<trail.length;i++) {
      ctx.fillRect(trail[i].x*gameSize,trail[i].y*gameSize,gameSize-2,gameSize-2);
      if ( gameRunning) {
        if(trail[i].x==xPos && trail[i].y==yPos) {
          resetGame();
          break;
        }
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
    //ctx.fillRect(Math.getRandomInt(20)*gameSize,Math.getRandomInt(20)*gameSize,gameSize-2,gameSize-2);
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("genCount").innerHTML = "Current Generation: " + currGen;
    //console.log(getPosArr());
}
function keyPush(input) {

    console.log(input);
    if ( input == 'left') {
      //console.log("in loop");
      if (yVel == -1) { // If snake is moving up
        xVel = -1;
        yVel = 0;
      } else if ( yVel == 1) { // If snake is moving down
        xVel = 1;
        yVel = 0;
      } else if ( xVel == -1) { // If snake is moving left
        xVel = 0;
        yVel = 1;
      } else { // If snake is moving right
        xVel = 0;
        yVel = -1;
      }

    } else if ( input == 'right'){
      if (yVel == -1) { // If snake is moving up
        xVel = 1;
        yVel = 0;
      } else if ( yVel == 1) { // If snake is moving down
        xVel = -1;
        yVel = 0;
      } else if ( xVel == -1) { // If snake is moving left
        xVel = 0;
        yVel = -1;
      } else { // If snake is moving right
        xVel = 0;
        yVel = 1;
      }
    } else {
      if ( yVel == 0 && xVel == 0) {
        yVel = -1;
      }
    }
}
function resetGame() {
   gameRunning = false;
   if ( score > highScore) {
     highScore = score;
     document.getElementById("highScore").innerHTML = "Personal Best: " + highScore;
   }
   tail = setTail;
   score = 0;
   xVel = 0;
   yVel = 0;
   xPos = 10;
   yPos = 10;
   currGen++;
   fitModel(moveRecord);

   moveRecord = [];
}

function getPosArr() {
  // Array pos:
  // 0: left of snake
  // 1: front of snake
  // 2: right of snake
  // 3: suggested movement
  //    if arr[3] =
  //    -1: turn left
  //     0: go forward
  //     1: turn right
  var arr = [0,0,0,0];
  if ( yVel == -1 ) { // If snake is moving up

    if ( xPos == 0) {
      arr[0] = 1;
    }
    if ( yPos == 0) {
      arr[1] = 1;

    }
    if ( xPos == gameSize - 1) {
      arr[2] = 1;
    }
    for ( var i = 0; i < trail.length; i++) {
      // If trail cell xPos is to the left and yPos is equal there is cell left
      if ( trail[i].x == xPos - 1 && trail[i].y == yPos) {
        arr[0] = 1;
      }
      // If trail cell ypos is -1  than x is equal there is cell forward
      if ( trail[i].x == xPos && trail[i].y == yPos - 1) {
        arr[1] = 1;
      }
      // If xpos is +1 than ypos is equal there is cell right
      if ( trail[i].x == xPos + 1 && trail[i].y == yPos) {
        arr[2] = 1;
      }
    }

  } else if ( yVel == 1) { // If snake is moving down

    if ( xPos == gameSize - 1) {
      arr[0] = 1;
    }
    if ( yPos == gameSize - 1) {
      arr[1] = 1;
    }
    if ( xPos == 0) {
      arr[2] = 1;
    }
    for ( var i = 0; i < trail.length; i++) {
      // If trail cell xPos is 1 greater and y is equal there is cell left
      if ( trail[i].x == xPos + 1 && trail[i].y == yPos) {
        arr[0] = 1;
      }
      // If trail cell yPos is 1 greater and x is equal there is cell forward
      if ( trail[i].x == xPos && trail[i].y == yPos + 1) {
        arr[1] = 1;
      }
      // If trail cell xPos is to the left and yPos is equal there is cell right
      if ( trail[i].x == xPos - 1 && trail[i].y == yPos) {
        arr[2] = 1;
      }
    }

  } else if ( xVel == -1) { // If snake is moving left
    if ( yPos == gameSize - 1) {
      arr[0] = 1;
    }
    if ( xPos == 0) {
      arr[1] = 1;
    }
    if ( yPos == 0) {
      arr[2] = 1;
    }
    for ( var i = 0; i < trail.length; i++) {
      // If trail cell xPos is equal and yPos is +1 there is cell left
      if ( trail[i].x == xPos && trail[i].y == yPos + 1) {
        arr[0] = 1;
      }
      // If trail cell xPos is -1 and y is equal there is cell forward
      if ( trail[i].x == xPos - 1 && trail[i].y == yPos) {
        arr[1] = 1;
      }
      // If trail cell yPos is 1 less than and x is equal there is cell right
      if ( trail[i].x == xPos && trail[i].y == yPos - 1) {
        arr[2] = 1;
      }
    }
  } else { // If snake is moving right
    if ( yPos == 0) {
      arr[0] = 1;
    }
    if ( xPos == gameSize - 1) {
      arr[1] = 1;
    }
    if ( yPos == gameSize - 1) {
      arr[2] = 1;
    }
    for ( var i = 0; i < trail.length; i++) {
      // If trail cell xPos is equal and yPos is is -1 there is cell left
      if ( trail[i].x == xPos && trail[i].y == yPos - 1) {
        arr[0] = 1;
      }
      // If trail cell xPos is +1 and y is equal there is cell forward
      if ( trail[i].x == xPos + 1 && trail[i].y == yPos) {
        arr[1] = 1;
      }
      // If trail cell yPos is 1 greater and x is equal there is cell right
      if ( trail[i].x == xPos && trail[i].y == yPos + 1) {
        arr[2] = 1;
      }
    }
  }
  if ( arr[0] == 1 && arr[1] == 1) {
    arr[3] = 1;
  } else if (arr[0] == 1 && arr[2] == 1) {
    arr[3] = 0;
  } else if (arr[1] == 1 && arr[2] == 1) {
    arr[3] = 1;
  } else if (arr[0] == 1) {
    arr[3] = 2;
  } else if (arr[1] == 1) {
    arr[3] = 0;
  } else if (arr[2] == 1) {
    arr[3] = 1;
  } else {
    arr[3] = 1;
  }


  return arr;
}
