function toggleRules() {
    document.querySelector('main').classList.toggle("translucent");
    document.querySelector('aside').classList.toggle("translucent");
    document.querySelector('.rules').classList.toggle("hide");
}

const numRows = 9;
const numCols = 9;
const numMines = 10;

const gameBoard = document.querySelector(".field");
const scoreSpans = document.querySelectorAll(".score span"); // 0 - бомби, 1 - кліки
const resetBtn = document.querySelector(".reset");
let msg = document.querySelector(".status");

let board = [];
let clicks = 0;
let gameOver = false;
let gameWon = false;

function initializeBoard() {
    board = [];
    clicks = 0;
    gameOver = false;
    updateStats();
    msg.textContent = "";
    
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                isFlagged: false,
                count: 0,
            };
        }
    }

    // Розміщення мін
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * numRows);
        const col = Math.floor(Math.random() * numCols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Розрахунок цифр навколо мін
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (ni >= 0 && ni < numRows && nj >= 0 && nj < numCols && board[ni][nj].isMine) {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
    renderBoard();
}

function updateStats() {
    scoreSpans[0].textContent = numMines;
    scoreSpans[1].textContent = clicks;
}

function revealAllMines() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (board[i][j].isMine) {
                board[i][j].revealed = true;
            }
        }
    }
    renderBoard();
}

function checkWin() {
    let unrevealedCount = 0;

    // Рахуємо всі закриті клітинки
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (!board[i][j].revealed) {
                unrevealedCount++;
            }
        }
    }

    // Якщо кількість закритих клітинок дорівнює кількості мін — це перемога
    if (unrevealedCount === numMines) {
        gameOver = true;
        // Можна також позначити всі міни прапорцями для краси
        setTimeout(() => {
            msg.textContent = "Вітаємо! Ви знешкодили всі міни!";
            msg.style.color = "green";
        }, 100);
    }
}

function revealCell(row, col) {
    if (gameOver || row < 0 || row >= numRows || col < 0|| col >= numCols
        || board[row][col].revealed || board[row][col].isFlagged
    ) {
        return;
    }

    board[row][col].revealed = true;

    if (board[row][col].isMine) {
        gameOver = true;
        revealAllMines();
        
        // Використовуємо тайм-аут, щоб браузер встиг відрендерити міни перед алертом
        msg.textContent = "Ви програли";
        msg.style.color = "red";
    } else {
        clicks++;
        updateStats();

        if (board[row][col].count === 0) {
            // Якщо порожня клітинка — відкриваємо сусідні
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    revealCell(row + dx, col + dy);
                }
            }
        }
        checkWin();
    }

    renderBoard();
}

// Функція для встановлення прапорця (ПКМ)
function toggleFlag(e, row, col) {
    e.preventDefault();
    if (gameOver || board[row][col].revealed) return;
    
    board[row][col].isFlagged = !board[row][col].isFlagged;
    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            
            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine"); // Додаємо клас для стилізації
                    cell.innerHTML = '<img src="../../images/bomb.png" alt="bomb">';
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            } else if (board[i][j].isFlagged) {
                cell.innerHTML = '<img src="../../images/red-flag.png" alt="flag">';
            }

            cell.addEventListener("click", () => revealCell(i, j));
            cell.addEventListener("contextmenu", (e) => toggleFlag(e, i, j));
            
            gameBoard.appendChild(cell);
        }
    }
}

function getNumberColor(num) {
    const colors = ["", "blue", "green", "red", "darkblue", "brown", "cyan", "black", "grey"];
    return colors[num] || "black";
}

resetBtn.addEventListener("click", initializeBoard);
initializeBoard();