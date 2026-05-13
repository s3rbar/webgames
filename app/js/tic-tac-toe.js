function toggleRules(){
    document.querySelector('main').classList.toggle("translucent");
    document.querySelector('aside').classList.toggle("translucent");
    document.querySelector('.rules').classList.toggle("hide");
}

let boxes = [...document.querySelectorAll('.field__square')];
let resetBtn = document.querySelector('#reset');
let turnO = true;
let msgContainer = document.querySelector('.msg-container');
let msg = document.querySelector('#msg');
let Ocount = 0;
let Xcount = 0;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];


boxes.forEach((box) => {
    box.classList.remove('unclickable')
    box.addEventListener('click', function () {

        if (turnO) {
            let O = document.createElement("div");
            O.className = "circle";
            box.appendChild(O);
            box.style.color = 'green';
            turnO = false;
            box.disabled = true;
            checkWinner();
        } else {
            let X = document.createElement("div")
            X.className = "cross";
            let Xl = document.createElement("div");
            Xl.className = "l";
            let Xr = document.createElement('div');
            Xr.className = "r";
            box.appendChild(X);
            X.appendChild(Xl);
            X.appendChild(Xr);
            turnO = true;
            box.disabled = true;
            checkWinner();
        }
        box.classList.add("unclickable");
    });
});

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.replaceChildren();
        box.classList.remove("unclickable");
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
        box.classList.add("unclickable");
    }
};

const showWinner = (winner) => {
    if (winner == "O"){
        winner = "Нулики";
    }else{
        winner = "Хрестики"; 
    }
    msg.innerText = `Перемогли ${winner}`;
    msg.style.color = "#91fa12";
    msgContainer.classList.remove('hide');
    for (box of boxes){
        box.classList.add("unclickable")
    }
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let box1 = boxes[pattern[0]].firstElementChild;
        let box2 = boxes[pattern[1]].firstElementChild;
        let box3 = boxes[pattern[2]].firstElementChild;
        
        if (box1 && box2 && box3) {
            let val1 = box1.className;
            let val2 = box2.className;
            let val3 = box3.className;
            
            if (val1 === val2 && val2 === val3) {
                const winnerName = val1 === "circle" ? "O" : "X";
                winnerName == "X" ? Xcount += 1 : Ocount += 1;
                document.getElementById("Xcount").textContent = Xcount;
                document.getElementById("Ocount").textContent = Ocount;

                showWinner(winnerName);
                return;
            }
        }
    }

    // Check for a draw: Are all boxes filled?
    const isDraw = boxes.every(box => box.hasChildNodes());
    
    if (isDraw) {
        msgContainer.classList.remove('hide');
        msg.innerText = 'Нічия';
    }
};

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add('hide');
};

resetBtn.addEventListener('click', resetGame);