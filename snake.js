const board = {
  height: 400,
  width: 400,
  size: 20
}

var snake = {
  x: board.width / 2,
  y: board.height / 2,
  xVel: 0,
  yVel: -1,
  tail: [],
  tailLength: 5,
  sizeX: board.width / board.size,
  sizeY: board.height / board.size,
  score: 0,
  moveRecord: []
}

var apple = {
  x: Math.floor(Math.random() * 20) * 20,
  y: Math.floor(Math.random() * 20) * 20
}

var moves = []
var canvas, ctx, game;


window.onload = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  //document.addEventListener("keydown",keyPush);
  game = setInterval(game,100);
  console.log(window.innerHeight);
}

function game() {

  // Change snake velocity based on current move
  if ( moves.length > 0) {
    snake.xVel = moves[0].xVel;
    snake.yVel = moves[0].yVel;
    moves.shift();
  }
  // Update snake position
  snake.x+=snake.xVel*snake.sizeX;
  snake.y+=snake.yVel*snake.sizeY;

  // Clear board
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,board.width,board.height);
  // Print snake head
  ctx.fillStyle = 'white';
  ctx.fillRect(snake.x, snake.y, snake.sizeX, snake.sizeY);
  snake.tail.forEach((t) => {
    ctx.fillRect(t.x, t.y, snake.sizeX, snake.sizeY);
    if (snake.x == t.x && snake.y == t.y) {
      resetGame();
    }
  });
  // Print apple
  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, snake.sizeX, snake.sizeY);

  // Push to tail at snake position
  snake.tail.push({ x:snake.x , y:snake.y });
  while(snake.tail.length > snake.tailLength) {
    snake.tail.shift();
  }
  // Detect snake collision with apple
  if ( snake.x === apple.x && snake.y === apple.y) {
    // Push to end of tail
    snake.tailLength++;
    apple = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20
    } 
    for ( var i = 0; i < snake.tail.length; i++) {
      if ( apple.x == snake.tail[i].x && apple.y == snake.tail[i].y) {
        apple = {
          x: Math.floor(Math.random() * 20) * 20,
          y: Math.floor(Math.random() * 20) * 20
        } 
        i = 0;
      }
    }
    snake.score += 5;
    document.getElementById('score').innerText = snake.score;
  }
  // Check that snake did not collide with wall
  if ( snake.x < 0 || snake.y < 0 || snake.x > board.width - snake.sizeX || snake.y > board.width - snake.sizeY) {
    resetGame();
  }
  move(makePrediction(getPosArr()));
  console.log(makePrediction(getPosArr()))
  snake.moveRecord.push(getPosArr());
}
/* 
// Set next move based on keypush
function keyPush(e) {
  switch (e.keyCode) {
    case 38:
      moves.push({xVel: 0, yVel: -1})  
      break;
    case 39:
      moves.push({xVel: 1, yVel: 0})
      break;
    case 40:
      moves.push({xVel: 0, yVel: 1})
      break;
    case 37:
      moves.push({xVel: -1, yVel: 0})
      break;
  }
} */

function move(pred) {
  switch (pred) {
    case 'left':
      moves.push({xVel: -1, yVel: 0})  
      break;      
    case 'up':
      moves.push({xVel: 0, yVel: -1})
      break;
    case 'right':
      moves.push({xVel: 1, yVel: 0})
      break;
    case 'down':
      moves.push({xVel: 0, yVel: 1})
      break;
  }
}

function resetGame() {
  fitModel(snake.moveRecord);
  snake = {
    x: board.width / 2,
    y: board.height / 2,
    xVel: 0,
    yVel: -1,
    tail: [],
    tailLength: 5,
    sizeX: board.width / board.size,
    sizeY: board.height / board.size,
    score: 0,
    moveRecord: []
  }
  document.getElementById('score').innerText = 0;
  apple = {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  }
  
  moves = []
}

function getPosArr() {
  var arr = [0,0,0,0,0,0]
  for ( var i = 0; i < snake.tail.length; i++) {
    if ( snake.x - snake.sizeX == snake.tail[i].x || snake.x == 0) {
      arr[0] = 1;
    } 
    if ( snake.x + snake.sizeX == snake.tail[i].x || snake.x == board.width - snake.sizeX) {
      arr[2] = 1;
    } 
    if ( snake.y - snake.sizeY == snake.tail[i].y || snake.y == 0) {
      arr[1] = 1;
    }
    if ( snake.y + snake.sizeY == snake.tail[i].y || snake.y == board.height - snake.sizeY) {
      arr[3] = 1;
    }
  }
/*   if ( snake.x > apple.x) {
    arr[4] = -1
  } else if ( snake.x < apple.x) {
    arr[4] = 1
  }
  if ( snake.y > apple.y) {
    arr[5] = -1;
  } else if (snake.y < apple.y) {
    arr[5] = 1;
  } */
  console.log(arr);
  return arr;
}

function getExpected(arr) {
  var wrong = []
  if (arr[0] == 1) {
    wrong.push('0');
  }
  if (arr[1] == 1) {
    wrong.push('1');
  }
  if (arr[2] == 1) {
    wrong.push('2');
  }
  if (arr[3] == 1) {
    wrong.push('3');
  }
  if ( !wrong.includes('0')) {
    return 0;
  } else if ( !wrong.includes('1')) {
    return 1;
  } else if ( !wrong.includes('2')) {
    return 2;
  } else {
    return 3;
  }
}