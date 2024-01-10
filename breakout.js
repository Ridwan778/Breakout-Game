const grid = document.querySelector(".grid");
const tileWidth = 100;
const tileHeight = 20;
const playerStart = [240, 10];
let currentPlayerPosition = [...playerStart];
const ballStart = [250, 30];
let currentBallPosition = [...ballStart];
let timerId;
let movX = 5;
let movY = 4;
let score = 0;

class Tile {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + tileWidth, yAxis];
    this.topLeft = [xAxis, yAxis + tileHeight];
    this.topRight = [xAxis + tileWidth, yAxis + tileHeight];
  }
}

const tilesArray = [
  new Tile(10, 270), new Tile(120, 270), new Tile(230, 270), new Tile(340, 270), new Tile(450, 270),
  new Tile(10, 240), new Tile(120, 240), new Tile(230, 240), new Tile(340, 240), new Tile(450, 240),
  new Tile(10, 210), new Tile(120, 210), new Tile(230, 210), new Tile(340, 210), new Tile(450, 210),
];

addTiles();

const player = createAndAppendElement('div', 'player', grid, currentPlayerPosition[0], currentPlayerPosition[1]);
const ball = createAndAppendElement('div', 'ball', grid, currentBallPosition[0], currentBallPosition[1]);
timerId = setInterval(moveBall, 30);

document.addEventListener('keydown', movePaddle);

function createAndAppendElement(tagName, className, parent, leftPos, bottomPos) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  element.style.left = leftPos + 'px';
  element.style.bottom = bottomPos + 'px';
  parent.appendChild(element);
  return element;
}

function moveBall() {
  currentBallPosition[0] += movX;
  currentBallPosition[1] += movY;
  ball.style.left = currentBallPosition[0] + 'px';
  ball.style.bottom = currentBallPosition[1] + 'px';
  checkCollision();
}

function checkCollision(){
    //collison with the walls
    //rightwall
    if(currentBallPosition[0] >= (560-20)){
        movX = -4;  
    } 
    //leftwall
    else if(currentBallPosition[0] <= 0){
        movX = 4; 
    } 
    //topwall
    else if(currentBallPosition[1]>=300-20){
        movY = -4;
    }
    //bottomwall
    else if(currentBallPosition[1]<=0){
        clearInterval(timerId);
        document.removeEventListener('keydown', movePaddle);
        var header = document.getElementById('score');
        header.textContent = "Game Over. Reload the page to try again";
    }

    //collision with the tiles
    //movY always becomes negative as the ball is going up
    for(let i=0; i<tilesArray.length;i++){
        if((currentBallPosition[0] > tilesArray[i].bottomLeft[0] && currentBallPosition[0] < tilesArray[i].bottomRight[0]) &&
           ((currentBallPosition[1] + 20) > tilesArray[i].bottomLeft[1] && currentBallPosition[1] < tilesArray[i].topLeft[1])){
            score++;
            console.log(score);
            var header = document.getElementById('score');
            header.textContent = `Your Score is: ${score}`;
            var AllCurrenttiles = Array.from(document.querySelectorAll('.tile'));
            AllCurrenttiles[i].classList.remove('tile');
            tilesArray.splice(i,1);

            if(movX >=0 && movY >=0){
                movX= movX;
                movY= -movY;
            }
            else if(movX <=0 && movY >= 0){
                movX= movX;
                movY= -movY;
            }
            else if(movX >= 0 && movY <= 0){
                movX= movX;
                movY=  movY;
            }
            else if(movX >= 0 && movY <= 0){
                movX= movX;
                movY=  movY;
           }
        }
    }

    //collision with player panel
    //movY always becomes positive as the ball is going up
    if((currentBallPosition[0] > currentPlayerPosition[0] && currentBallPosition[0] < currentPlayerPosition[0]+100) &&
           ((currentBallPosition[1]) > currentPlayerPosition[1] && currentBallPosition[1] < currentPlayerPosition[1]+20)){
            

            // hitting the panel of the edge should affect the direction of the ball more severely than at the center
            //this code is for that, would work on it when I can make time
            
            // Calculate impact position on the paddle
            let impactPosition = (currentBallPosition[0] - currentPlayerPosition[0]) / 100;
            dirChangeFactorX = 1
            diagonalMovement = Math.sqrt(Math.sqrt(movX**2)+Math.sqrt(movY**2))
            dirChangeFactorY = 1

            // if (impactPosition <0.3 || impactPosition > 0.7){
            //     dirChangeFactorX = 1.3
            //     dirChangeFactorY = Math.sqrt(Math.sqrt(diagonalMovement*2) - Math.sqrt((movX*dirChangeFactorX)**2))
            // }

            if(movX >=0 && movY <= 0){
                movX = dirChangeFactorX*movX
                movY= -movY;
            }
            else if(movX <=0 && movY <=0){
                movX = dirChangeFactorX*movX
                movY= -movY;
           }          
        }

        if(score >= 15){
            clearInterval(timerId);
            document.removeEventListener('keydown', movePaddle);
            var header = document.getElementById('score');
            header.textContent = "Congratulations! You have completed the game.";
        }

}

function movePaddle(move) {
  const playerMove = 20;
  if (move.key === 'ArrowLeft' && currentPlayerPosition[0] > 0) {
    currentPlayerPosition[0] -= playerMove;
  } else if (move.key === 'ArrowRight' && currentPlayerPosition[0] < 560 - 100) {
    currentPlayerPosition[0] += playerMove;
  }
  player.style.left = currentPlayerPosition[0] + 'px';
}

function addTiles() {
  tilesArray.forEach(tile => {
    const newTile = createAndAppendElement('div', 'tile', grid, tile.bottomLeft[0], tile.bottomLeft[1]);
  });
}