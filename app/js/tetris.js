
function toggleRules() {
    document.querySelector('main').classList.toggle("translucent");
    document.querySelector('aside').classList.toggle("translucent");
    document.querySelector('.rules').classList.toggle("hide");
}
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreSpan = document.querySelector('h2 span');
const resetBtn = document.querySelector('.reset');

const grid = 22; 
const columnCount = 10;
const rowCount = 20;
canvas.width = columnCount * grid;
canvas.height = rowCount * grid;

let tetrominoSequence = [];
let playfield = [];
let score = 0;
let count = 0;
let tetromino = null;
let rAF = null;
let gameOver = false;

const colors = {
    'I': '#FFAE00', 'O': '#00D0FF', 'T': '#00FFAA',
    'S': '#0D00FF', 'Z': '#FF00C8', 'J': '#D4FF00', 'L': '#FF0000'
};

const tetrominos = {
    'I': [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    'J': [[1,0,0],[1,1,1],[0,0,0]],
    'L': [[0,0,1],[1,1,1],[0,0,0]],
    'O': [[1,1],[1,1]],
    'S': [[0,1,1],[1,1,0],[0,0,0]],
    'Z': [[1,1,0],[0,1,1],[0,0,0]],
    'T': [[0,1,0],[1,1,1],[0,0,0]]
};

function generateSequence() {
    const order = ['I', 'Z', 'S', 'O', 'T', 'L', 'J']; 
    tetrominoSequence = [...order];
}

function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === 'I' ? -1 : -2;

    return { name, matrix, row, col };
}

function rotate(matrix) {
    const N = matrix.length - 1;
    return matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
}

function isValidMove(matrix, cellRow, cellCol) {
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] && (
                cellCol + c < 0 || 
                cellCol + c >= playfield[0].length ||
                cellRow + r >= playfield.length ||
                playfield[cellRow + r][cellCol + c])
            ) return false;
        }
    }
    return true;
}

function drawGrid() {
    context.strokeStyle = '#000033'; // Темна сітка (колишній фон)
    context.lineWidth = 1;

    for (let i = 0; i <= canvas.width; i += grid) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }
    for (let j = 0; j <= canvas.height; j += grid) {
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(canvas.width, j);
        context.stroke();
    }
}

function placeTetromino() {
    for (let r = 0; r < tetromino.matrix.length; r++) {
        for (let c = 0; c < tetromino.matrix[r].length; c++) {
            if (tetromino.matrix[r][c]) {
                if (tetromino.row + r < 0) return showGameOver();
                playfield[tetromino.row + r][tetromino.col + c] = tetromino.name;
            }
        }
    }

    let linesCleared = 0;
    for (let r = playfield.length - 1; r >= 0; ) {
        if (playfield[r].every(cell => !!cell)) {
            linesCleared++;
            for (let row = r; row >= 0; row--) {
                for (let col = 0; col < playfield[row].length; col++) {
                    playfield[row][col] = playfield[row-1] ? playfield[row-1][col] : 0;
                }
            }
        } else {
            r--;
        }
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreSpan.innerText = score;
    }

    tetromino = getNextTetromino();
}

function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    context.fillStyle = 'rgba(0,0,0,0.75)';
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.fillStyle = 'white';
    context.font = '18px Arial';
    context.textAlign = 'center';
    context.fillText('ГРА ЗАКІНЧЕНА', canvas.width / 2, canvas.height / 2 + 8);
}

function resetGame() {
    gameOver = false;
    score = 0;
    scoreSpan.innerText = "0";
    playfield = [];
    for (let row = -2; row < rowCount; row++) {
        playfield[row] = Array(columnCount).fill(0);
    }
    tetrominoSequence = [];
    tetromino = getNextTetromino();
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(loop);
}

function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000080'; 
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            if (playfield[r][c]) {
                context.fillStyle = colors[playfield[r][c]];
                context.fillRect(c * grid + 1, r * grid + 1, grid - 2, grid - 2);
            }
        }
    }

    if (tetromino) {
        if (++count > 40) {
            tetromino.row++;
            count = 0;
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        context.fillStyle = colors[tetromino.name];
        for (let r = 0; r < tetromino.matrix.length; r++) {
            for (let c = 0; c < tetromino.matrix[r].length; c++) {
                if (tetromino.matrix[r][c]) {
                    context.fillRect((tetromino.col + c) * grid + 1, (tetromino.row + r) * grid + 1, grid - 2, grid - 2);
                }
            }
        }
    }
}

const actions = {
    left: () => {
        if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col - 1)) tetromino.col--;
    },
    right: () => {
        if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col + 1)) tetromino.col++;
    },
    rotate: () => {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) tetromino.matrix = matrix;
    },
    down: () => {
        const row = tetromino.row + 1;
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            placeTetromino();
        } else {
            tetromino.row = row;
        }
    }
};

document.addEventListener('keydown', e => {
    if (gameOver) return;
    if (e.which === 37) actions.left();
    if (e.which === 39) actions.right();
    if (e.which === 38) actions.rotate();
    if (e.which === 40) actions.down();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ctrl-left').onclick = () => !gameOver && actions.left();
    document.getElementById('ctrl-right').onclick = () => !gameOver && actions.right();
    document.getElementById('ctrl-down').onclick = () => !gameOver && actions.down();
    document.getElementById('ctrl-rotate').onclick = () => !gameOver && actions.rotate();
    resetBtn.onclick = resetGame;

    resetGame();
});