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

    moveRecord.push(getPosArr(xPos, yPos, xVel, yVel, xApple, yApple, trail, gameSize));
    var vel = keyPush(makePrediction(getPosArr(xPos, yPos, xVel, yVel, xApple, yApple, trail, gameSize)), xVel, yVel);
    xVel = vel[0];
    yVel = vel[1];
    //console.log(predicted_input);

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
function keyPush(_input, _xVel, _yVel) {

    if ( _input == 'left') {
      //console.log("in loop");
      if (_yVel == -1) { // If snake is moving up
        _xVel = -1;
        _yVel = 0;
      } else if ( _yVel == 1) { // If snake is moving down
        _xVel = 1;
        _yVel = 0;
      } else if ( _xVel == -1) { // If snake is moving left
        _xVel = 0;
        _yVel = 1;
      } else { // If snake is moving right
        _xVel = 0;
        _yVel = -1;
      }

    } else if ( _input == 'right'){
      if (_yVel == -1) { // If snake is moving up
        _xVel = 1;
        _yVel = 0;
      } else if ( _yVel == 1) { // If snake is moving down
        _xVel = -1;
        _yVel = 0;
      } else if ( _xVel == -1) { // If snake is moving left
        _xVel = 0;
        _yVel = -1;
      } else { // If snake is moving right
        _xVel = 0;
        _yVel = 1;
      }
    } else if ( _input == 'forward'){
      if ( _yVel == 0 && _xVel == 0) {
        _yVel = -1;
      }
    }
    return [_xVel, _yVel];
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
function getPosArr(_xPos, _yPos, _xVel, _yVel, _xApple, _yApple, _trail, _gameSize) {
  var _arr = [0,0,0];
  var _relApple = [0,0];
  if ( _yVel == -1 ) { // If snake is moving up

    // GET VALUES FOR RELATIVE APPLE POS
    if ( _xApple < _xPos) {
      _relApple[0] = -1;
    } else if (_xApple == _xPos) {
      _relApple[0] = 0;
    } else {
      _relApple[0] = 1;
    }

    if ( _yApple < _yPos) {
      _relApple[1] = 1;
    } else if ( _yApple == _yPos) {
      _relApple[1] = 0;
    } else {
      _relApple[1] = -1;
    }

    // CHECK FOR OBSTACLES
    if ( _xPos == 0) {
      _arr[0] = 1;
    }
    if ( _yPos == 0) {
      _arr[1] = 1;

    }
    if ( _xPos == _gameSize - 1) {
      _arr[2] = 1;
    }
    for ( var i = 0; i < _trail.length; i++) {
      // If _trail cell _xPos is to the left and _yPos is equal there is cell left
      if ( _trail[i].x == _xPos - 1 && _trail[i].y == _yPos) {
        _arr[0] = 1;
      }
      // If _trail cell _yPos is -1  than x is equal there is cell forward
      if ( _trail[i].x == _xPos && _trail[i].y == _yPos - 1) {
        _arr[1] = 1;
      }
      // If _xPos is +1 than _yPos is equal there is cell right
      if ( _trail[i].x == _xPos + 1 && _trail[i].y == _yPos) {
        _arr[2] = 1;
      }
    }

  } else if ( _yVel == 1) { // If snake is moving down

    // GET VALUES FOR RELATIVE APPLE POS
    if ( _xApple < _xPos) {
      _relApple[0] = 1;
    } else if (_xApple == _xPos) {
      _relApple[0] = 0;
    } else {
      _relApple[0] = -1;
    }

    if ( _yApple < _yPos) {
      _relApple[1] = -1;
    } else if ( _yApple == _yPos) {
      _relApple[1] = 0;
    } else {
      _relApple[1] = 1;
    }

    // CHECK FOR OBSTACLES
    if ( _xPos == _gameSize - 1) {
      _arr[0] = 1;
    }
    if ( _yPos == _gameSize - 1) {
      _arr[1] = 1;
    }
    if ( _xPos == 0) {
      _arr[2] = 1;
    }
    for ( var i = 0; i < _trail.length; i++) {
      // If _trail cell _xPos is 1 greater and y is equal there is cell left
      if ( _trail[i].x == _xPos + 1 && _trail[i].y == _yPos) {
        _arr[0] = 1;
      }
      // If _trail cell _yPos is 1 greater and x is equal there is cell forward
      if ( _trail[i].x == _xPos && _trail[i].y == _yPos + 1) {
        _arr[1] = 1;
      }
      // If _trail cell _xPos is to the left and _yPos is equal there is cell right
      if ( _trail[i].x == _xPos - 1 && _trail[i].y == _yPos) {
        _arr[2] = 1;
      }
    }

  } else if ( _xVel == -1) { // If snake is moving left

    // GET VALUES FOR RELATIVE APPLE POS
    if ( _xApple < _xPos) {
      _relApple[1] = -1;
    } else if (_xApple == _xPos) {
      _relApple[1] = 0;
    } else {
      _relApple[1] = 1;
    }

    if ( _yApple < _yPos) {
      _relApple[0] = 1;
    } else if ( _yApple == _yPos) {
      _relApple[0] = 0;
    } else {
      _relApple[0] = -1;
    }

    // CHECK FOR OBSTACLES
    if ( _yPos == _gameSize - 1) {
      _arr[0] = 1;
    }
    if ( _xPos == 0) {
      _arr[1] = 1;
    }
    if ( _yPos == 0) {
      _arr[2] = 1;
    }
    for ( var i = 0; i < _trail.length; i++) {
      // If _trail cell _xPos is equal and _yPos is +1 there is cell left
      if ( _trail[i].x == _xPos && _trail[i].y == _yPos + 1) {
        _arr[0] = 1;
      }
      // If _trail cell _xPos is -1 and y is equal there is cell forward
      if ( _trail[i].x == _xPos - 1 && _trail[i].y == _yPos) {
        _arr[1] = 1;
      }
      // If _trail cell _yPos is 1 less than and x is equal there is cell right
      if ( _trail[i].x == _xPos && _trail[i].y == _yPos - 1) {
        _arr[2] = 1;
      }
    }
  } else if ( _xVel == 1){ // If snake is moving right

    // GET VALUES FOR RELATIVE APPLE POS
    if ( _xApple < _xPos) {
      _relApple[1] = 1;
    } else if (_xApple == _xPos) {
      _relApple[1] = 0;
    } else {
      _relApple[1] = -1;
    }

    if ( _yApple < _yPos) {
      _relApple[0] = -1;
    } else if ( _yApple == _yPos) {
      _relApple[0] = 0;
    } else {
      _relApple[0] = 1;
    }

    if ( _yPos == 0) {
      _arr[0] = 1;
    }
    if ( _xPos == _gameSize - 1) {
      _arr[1] = 1;
    }
    if ( _yPos == _gameSize - 1) {
      _arr[2] = 1;
    }

    // CHECK FOR OBSTACLES
    for ( var i = 0; i < _trail.length; i++) {
      // If _trail cell _xPos is equal and _yPos is is -1 there is cell left
      if ( _trail[i].x == _xPos && _trail[i].y == _yPos - 1) {
        _arr[0] = 1;
      }
      // If _trail cell _xPos is +1 and y is equal there is cell forward
      if ( _trail[i].x == _xPos + 1 && _trail[i].y == _yPos) {
        _arr[1] = 1;
      }
      // If _trail cell _yPos is 1 greater and x is equal there is cell right
      if ( _trail[i].x == _xPos && _trail[i].y == _yPos + 1) {
        _arr[2] = 1;
      }
    }
  } else {
    // GET VALUES FOR RELATIVE APPLE POS
    if ( _xApple < _xPos) {
      _relApple[0] = -1;
    } else if (_xApple == _xPos) {
      _relApple[0] = 0;
    } else {
      _relApple[0] = 1;
    }

    if ( _yApple < _yPos) {
      _relApple[1] = -1;
    } else if ( _yApple == _yPos) {
      _relApple[1] = 0;
    } else {
      _relApple[1] = 1;
    }
  }

  _arr.push(_relApple[0]);
  _arr.push(_relApple[1]);
  //console.log(_relApple);
  //console.log("(" + _xVel + "," + __yVel + ")");
  return _arr;
}
/*
* Takes in data that is _input into the model during training and returns the
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
function getExpected(_arr) {
  // If there is an object left and forward move right
  if ( _arr[0] == 1 && _arr[1] == 1) {
    return 2;
  // If there is an object left and right move forward
  } else if (_arr[0] == 1 && _arr[2] == 1) {
    return 1;
  // If there is an object forward and right move left
  } else if (_arr[1] == 1 && _arr[2] == 1) {
    return 0;
  // If there is an object left and xApple is -1 or 0
  } else if ( _arr[0] == 1 && (_arr[3] == -1 || _arr[3] == 0)) {
    // If yApple is -1 go right, else forward
    if (_arr[4] == -1) {
      return 2;
    } else {
      return 1;
    }
  // If there is an object left and xApple is 1 go right
  } else if (_arr[0] == 1 && _arr[3] == 1) {
    return 2;
  // If there is an object forward and xApple is -1 or 0 go left
  }  else if (_arr[1] == 1 && (_arr[3] = -1 )|| _arr[3] == 0) {
    return 0;
  // If there is an object forward and xApple is 1 go right
  } else if (_arr[1] == 1 && _arr[3] == 1) {
    return 2;
  // If there is an object right and xApple is -1 go left
  } else if (_arr[2] == 1 && _arr[3] == -1) {
    return 0;
  // If there is an object right and xApple is 0
  } else if (_arr[2] == 1 && _arr[3]== 0){
    // If yApple is -1 go forward else right
    if (_arr[4]== -1){
      return 0;
    } else {
      return 1;
    }
  // If there is an object right and xApple is 1
  } else if (_arr[2] == 1 && _arr[3]== 1) {
    return 1;
    // If there are no objects and xApple is -1 go left
  } else if (_arr[3] == -1) {
    return 0;
  // If there are no objects and xApple is 0
  } else if (_arr[3] == 0) {
    // If yApple is -1 move left to turn around
    if ( _arr[4] == -1) {
      return 0;
    // Else move forward
    } else {
      return 1;
    }
  // If there are no objects and xApple is 1 go right
  } else {
    return 2;
  }

}
