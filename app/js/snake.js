function toggleRules() {
    document.querySelector('main').classList.toggle("translucent");
    document.querySelector('aside').classList.toggle("translucent");
    document.querySelector('.rules').classList.toggle("hide");
}

let blockSize = 30; 
let total_row = 15;
let total_col = 17;
let field;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let speedX = 0;
let speedY = 0;

let snakeBody = []; 
let foodX;
let foodY;

let score = 0;
let gameOver = false;

window.onload = function () {
    field = document.querySelector("#field");
    field.style.width = (total_col * blockSize) + "px";
    field.style.height = (total_row * blockSize) + "px";

    placeFood();
    document.addEventListener("keyup", changeDirection);
    
    setInterval(update, 1000 / 10);
    document.querySelector(".reset").onclick = () => location.reload();
}

function update() {
    if (gameOver) return;
    field.innerHTML = "";
    let foodElement = document.createElement("img");
    foodElement.src = "../../images/apple.png";
    foodElement.alt = "apple";
    foodElement.className = "apple-img";
    foodElement.style.left = foodX + "px";
    foodElement.style.top = foodY + "px";
    field.appendChild(foodElement);

    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        document.querySelector("h2 span").innerText = score;
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    let head = document.createElement("div");
    head.className = "snake-head";
    head.style.left = snakeX + "px";
    head.style.top = snakeY + "px";
    head.innerHTML = `<div class="snake-eye"></div><div class="snake-eye"></div>`;
    field.appendChild(head);

    snakeBody.forEach((part, index) => {
        let bodyPart = document.createElement("div");
        bodyPart.className = "snake-body";
        bodyPart.style.left = part[0] + "px";
        bodyPart.style.top = part[1] + "px";

        let prev = (index === 0) ? [snakeX, snakeY] : snakeBody[index - 1];
        bodyPart.style.border = "none";

        if (prev[0] > part[0]) { // Рух вправо
            bodyPart.style.borderRight = "1px solid #000";
        } else if (prev[0] < part[0]) { // Рух вліво
            bodyPart.style.borderLeft = "1px solid #000";
        } else if (prev[1] > part[1]) { // Рух вниз
            bodyPart.style.borderBottom = "1px solid #000";
        } else if (prev[1] < part[1]) { // Рух вгору
            bodyPart.style.borderTop = "1px solid #000";
        }

        field.appendChild(bodyPart);
    });

    if (snakeX < 0 || snakeX >= total_col * blockSize || snakeY < 0 || snakeY >= total_row * blockSize) {
        endGame();
    }
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            endGame();
        }
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
    for (let i = 0; i < snakeBody.length; i++) {
        if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
            placeFood();
            return;
        }
    }
}

function endGame() {
    gameOver = true;
    congrats = document.querySelector(".gameOver");
    congrats.textContent = "Гра закінчена!";
    if(snakeBody.length < 254){
        congrats.style.color = "red";
    }else{
        congrats.style.color = "green";
    }
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && speedY !== 1) {
        speedX = 0; speedY = -1;
    } else if (e.code === "ArrowDown" && speedY !== -1) {
        speedX = 0; speedY = 1;
    } else if (e.code === "ArrowLeft" && speedX !== 1) {
        speedX = -1; speedY = 0;
    } else if (e.code === "ArrowRight" && speedX !== -1) {
        speedX = 1; speedY = 0;
    }
}