var xPos = 10;
var yPos = 10;
var gameSize = 20;
var xAccel = 15;
var yAccel = 15;
var xVel = 0;
var yVel = 0;
var trail=[];
var setTail = 10;
var tail = setTail;
var score = 0;
var highScore = 0;
var speedDifficulty = 75;
var moveRecord = [];
var currGen = 0;
var gameRunning = true;
var direction = ['left', 'forward', 'right'];
var xApple = Math.floor(Math.random()*gameSize);
var yApple = Math.floor(Math.random()*gameSize);
var loopsSinceApple = 0;

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

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);

    ctx.fillStyle="white";
    for(var i=0;i<trail.length;i++) {
      ctx.fillRect(trail[i].x*gameSize,trail[i].y*gameSize,gameSize-2,gameSize-2);
      if ( gameRunning) {
        if(trail[i].x==xPos && trail[i].y==yPos) {
          console.log(xVel + "," + yVel);
          resetGame();
          break;
        }
      }
    }
    trail.push({ x:xPos , y:yPos });
    while(trail.length>tail) {
      trail.shift();
    }

    moveRecord.push(getPosArr());
    keyPush(makePrediction(getPosArr()));;
    //console.log(predictedInput);

    if(xPos<0 || xPos > gameSize - 1 || yPos < 0 || yPos > gameSize - 1) {
        resetGame();
    }

    if (loopsSinceApple >= 75 ) {
      resetGame();
    }
    if(xApple == xPos && yApple == yPos) {
        loopsSinceApple = 0;
        tail++;
        score+=5;
        xApple = Math.floor(Math.random()*gameSize);
        yApple = Math.floor(Math.random()*gameSize);
    }
    ctx.fillStyle="red";
    ctx.fillRect(xApple*gameSize,yApple*gameSize,gameSize-2,gameSize-2);
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("genCount").innerHTML = "Current Generation: " + currGen;
    //console.log(getPosArr());
    loopsSinceApple++;
}
function keyPush(input) {

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
    } else if ( input == 'forward'){
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
   loopsSinceApple = 0;
   moveRecord = [];
}

/*
* Gets current position of snake as well as current position of the apple
* and returns an array of the relative x and y position
* NOTE: X AND Y ARE RELATIVE, THEY CHANGE BASED ON SNAKE DIRECTION
* @returns Array
// arr[0]: left of snake
// arr[1]: front of snake
// arr[2]: right of snake
* arr[3] (x) and arr[4] (y) return the following respectively
* -1: apple is negative direction (x or y)
* 0: apple is at same position (x or y)
* 1: apple is positive direction (x or y)
*/
function getPosArr() {
  var arr = [0,0,0];
  var relApple = [0,0];
  if ( yVel == -1 ) { // If snake is moving up

    // GET VALUES FOR RELATIVE APPLE POS
    if ( xApple < xPos) {
      relApple[0] = -1;
    } else if (xApple == xPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = 1;
    }

    if ( yApple < yPos) {
      relApple[1] = 1;
    } else if ( yApple == yPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = -1;
    }

    // CHECK FOR OBSTACLES
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

    // GET VALUES FOR RELATIVE APPLE POS
    if ( xApple < xPos) {
      relApple[0] = 1;
    } else if (xApple == xPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = -1;
    }

    if ( yApple < yPos) {
      relApple[1] = -1;
    } else if ( yApple == yPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = 1;
    }

    // CHECK FOR OBSTACLES
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

    // GET VALUES FOR RELATIVE APPLE POS
    if ( xApple < xPos) {
      relApple[1] = -1;
    } else if (xApple == xPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = 1;
    }

    if ( yApple < yPos) {
      relApple[0] = 1;
    } else if ( yApple == yPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = -1;
    }

    // CHECK FOR OBSTACLES
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
  } else if ( xVel == 1){ // If snake is moving right

    // GET VALUES FOR RELATIVE APPLE POS
    if ( xApple < xPos) {
      relApple[1] = 1;
    } else if (xApple == xPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = -1;
    }

    if ( yApple < yPos) {
      relApple[0] = -1;
    } else if ( yApple == yPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = 1;
    }

    if ( yPos == 0) {
      arr[0] = 1;
    }
    if ( xPos == gameSize - 1) {
      arr[1] = 1;
    }
    if ( yPos == gameSize - 1) {
      arr[2] = 1;
    }

    // CHECK FOR OBSTACLES
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
  } else {
    // GET VALUES FOR RELATIVE APPLE POS
    if ( xApple < xPos) {
      relApple[0] = -1;
    } else if (xApple == xPos) {
      relApple[0] = 0;
    } else {
      relApple[0] = 1;
    }

    if ( yApple < yPos) {
      relApple[1] = -1;
    } else if ( yApple == yPos) {
      relApple[1] = 0;
    } else {
      relApple[1] = 1;
    }
  }

  arr.push(relApple[0]);
  arr.push(relApple[1]);
  //console.log(relApple);
  //console.log("(" + xVel + "," + yVel + ")");
  return arr;
}
/*
* Takes in data that is input into the model during training and returns the
* expected response from a prediction.
* @params arr describing surroundings
* arr[0]: if 1 something is to the left
* arr[1]: if 1 something is forward
* arr[2]: if 1 something is to the right
* NOTE: X AND Y ARE RELATIVE, THEY CHANGE BASED ON SNAKE DIRECTION
* NOTE 2: This function is only for training data, this is not for hardcoding snake behavior
* arr[3]: if -1 apple is in negative x direction, 0 is at same x direction, 1 positive x direction
* arr[4]: if -1 apple is in negative y direction, 0 is at same y direction, 1 positive y direction
* @return direction to move
* 0: Turn left
* 1: Go forward
* 2: Turn Right
*/
function getExpected(arr) {
  // If there is an object left and forward move right
  if ( arr[0] == 1 && arr[1] == 1) {
    return 2;
  // If there is an object left and right move forward
  } else if (arr[0] == 1 && arr[2] == 1) {
    return 1;
  // If there is an object forward and right move left
  } else if (arr[1] == 1 && arr[2] == 1) {
    return 0;
  // If there is an object left and xApple is -1 or 0
  } else if ( arr[0] == 1 && (arr[3] == -1 || arr[3] == 0)) {
    // If yApple is -1 go right, else forward
    if (arr[4] == -1) {
      return 2;
    } else {
      return 1;
    }
  // If there is an object left and xApple is 1 go right
  } else if (arr[0] == 1 && arr[3] == 1) {
    return 2;
  // If there is an object forward and xApple is -1 or 0 go left
  }  else if (arr[1] == 1 && (arr[3] = -1 )|| arr[3] == 0) {
    return 0;
  // If there is an object forward and xApple is 1 go right
  } else if (arr[1] == 1 && arr[3] == 1) {
    return 2;
  // If there is an object right and xApple is -1 go left
  } else if (arr[2] == 1 && arr[3] == -1) {
    return 0;
  // If there is an object right and xApple is 0
  } else if (arr[2] == 1 && arr[3]== 0){
    // If yApple is -1 go forward else right
    if (arr[4]== -1){
      return 0;
    } else {
      return 1;
    }
  // If there is an object right and xApple is 1
  } else if (arr[2] == 1 && arr[3]== 1) {
    return 1;
    // If there are no objects and xApple is -1 go left
  } else if (arr[3] == -1) {
    return 0;
  // If there are no objects and xApple is 0
  } else if (arr[3] == 0) {
    // If yApple is -1 move left to turn around
    if ( arr[4] == -1) {
      return 0;
    // Else move forward
    } else {
      return 1;
    }
  // If there are no objects and xApple is 1 go right
  } else {
    return 2;
  }







  /*
  // If snake has object to left and xApple is -1
} else if (arr[0] == 1 && (arr[3] == -1 || arr[3] == 0)) {
    // Move forward if yApple is left or forward
    if ( arr[4] == 1 || arr[4] == 0) {
      return 1;
    // Move left if yApple is left
    } else {
      return 2;
    }
  // If snake has object to the left and xApple is right
  } else if (arr[0] == 1 && arr[3] == 1) {
      // Move right if yApple is left or forward
      if ( arr[4] == 1 || arr[4] == 0) {
        return 2;
      } else {
        return 1;
      }
  // If snake has object forward and xApple left or foward go left
  } else if (arr[1] == 1 && (arr[3] == -1 || arr[3] == 0)) {
    return 0;
  // If snake has object forward and xApple is right go right
  } else if (arr[1] == 1 && arr[3] == 1) {
    return 2;
  // If snake has object right and xApple is left
  } else if (arr[2] == 1 && arr[3] == -1) {
    // If yApple is left or right move forward
    if ( arr[4] == -1 || arr[4] == 1) {
      return 1;
    // If yApple is forward move left
    } else {
      return 0;
    }
  // If snake has object right and xApple is forward
  } else if (arr[2] == 1 && arr[3] == 0) {
    // If snake has apple to the left move left
    if (arr[4] == -1) {
      return 0;
    // else move forward
    } else {
      return 1;
    }
  // If snake has no objects around it and xApple is left move left
  } else if (arr[3] == -1) {
    return 0;
  // If snake has no objects around it and xApple is forward
  } else if (arr[3] == 0) {
    // If yApple is negative move left (by convention)
    if ( arr[4] == 1) {
      return 0;
    // Else move forward
    } else {
      return 1;
    }
  // If snake has no objects around it and xApple is right move right
  } else {
    return 2;
  }*/
}
