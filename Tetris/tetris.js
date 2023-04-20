const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scale = 20;

// Board size
const rows = 20;
const cols = 10;

const tetrominoes = [
  // I
  [
    [1, 1, 1, 1]
  ],

  // J
  [
    [2, 0, 0],
    [2, 2, 2]
  ],

  // L
  [
    [0, 0, 3],
    [3, 3, 3]
  ],

  // O
  [
    [4, 4],
    [4, 4]
  ],
  
  // S
  [
    [0, 5, 5],
    [5, 5, 0]
  ],

  // T
  [
    [0, 6, 0],
    [6, 6, 6]
  ],

  // Z
  [
    [7, 7, 0],
    [0, 7, 7]
  ]
];

// Create empty board
const board = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

// ブロックの回転
function rotate(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = new Array(cols).fill(0).map(() => new Array(rows).fill(0));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      result[col][rows - 1 - row] = matrix[row][col];
    }
  }

  return result;
}


// 衝突検出
function isCollision(matrix, x, y) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        (y + row < 0 || y + row >= rows || x + col < 0 || x + col >= cols || board[y + row][x + col])
      ) {
        return true;
      }
    }
  }
  return false;
}

// ブロックの移動と落下
let posX = 0;
let posY = 0;
let currentTetromino = getRandomTetromino();

function moveDown() {
  if (!isCollision(currentTetromino, posX, posY + 1)) {
    posY++;
  } else {
    // Merge current block into the board and reset position
    mergeBlockToBoard();
    posX = 0;
    posY = 0;
    currentTetromino = getRandomTetromino();
  }
}

function moveLeft() {
  if (!isCollision(currentTetromino, posX - 1, posY)) {
    posX--;
  }
}

function moveRight() {
  if (!isCollision(currentTetromino, posX + 1, posY)) {
    posX++;
  }
}

function mergeBlockToBoard() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        board[row + posY][col + posX] = currentTetromino[row][col];
      }
    }
  }
}

// 行のクリア
function clearLines() {
  outer: for (let row = rows - 1; row >= 0; row--) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col]) {
        continue outer;
      }
    }

    // Remove the line
    board.splice(row, 1);

    // Add a new empty line at the top
    board.unshift(new Array(cols).fill(0));
  }
}

function getRandomTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  return tetrominoes[index];
}

// Draw a square
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x * scale, y * scale, scale, scale);
}

// Draw board
function drawBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const color = board[row][col] ? `hsl(${board[row][col] * 35}, 100%, 50%)` : 'white';
      drawSquare(col, row, color);
    }
  }
}

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw board
  drawBoard();

  // Draw tetromino
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        const color = `hsl(${currentTetromino[row][col] * 35}, 100%, 50%)`;
        drawSquare(posX + col, posY + row, color);
      }
    }
  }

  // Check for cleared lines
  clearLines();

  // Call the game loop again
  requestAnimationFrame(gameLoop);
};

// Set interval for moving down the tetromino
setInterval(moveDown, 500);


// Key events
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowUp':
      currentTetromino = rotate(currentTetromino);
      break;
    case 'ArrowDown':
      moveDown();
      break;
  }
});

// Start the game loop
gameLoop();
