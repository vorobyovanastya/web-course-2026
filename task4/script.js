let number = '';
let cout = 0;

const userInput = document.getElementById('user-input');
const proverkaBt = document.getElementById('guess-btn');
const newGame = document.getElementById('new-game');
const counter = document.getElementById('counter');
const list = document.getElementById('history-list');

function secretNomber() {
    number = '';
    while (number.length < 4) {
        let num = Math.floor(Math.random() * 10).toString();
        if ((number.length > 0 || num !== '0') && number.indexOf(num) === -1) {
            number += num;
        }
    }
}

secretNomber();


function checkGuess() {
    let numUser = userInput.value;

    if (numUser.length !== 4) {
        alert("Введите 4 цифры!");
        return;
    }

    if (isNaN(numUser)) {
        alert("Можно вводить только цифры!");
        return;
    }

    for (let i = 0; i < numUser.length; i++) {
        if (numUser.indexOf(numUser[i]) !== numUser.lastIndexOf(numUser[i])) {
            alert("Цифры не должны повторяться!");
            return;
        }
    }

    cout++;
    counter.textContent = "Попыток: " + cout;

    
}

    let bulls = 0; // быки
    let cows = 0;  // коровы

    for (let i = 0; i < 4; i++) {
        if (numUser[i] === number[i]) {
            bulls++;
        } else if (number.indexOf(numUser[i]) !== -1) {
            cows++;
        }
    }

    let listItem = document.createElement("li");

    if (bulls === 4) {
        listItem.textContent = "Победа! Число " + number + " за " + cout + " поп.";
        userInput.disabled = true;
        proverkaBt.disabled = true;
    } else {
        listItem.textContent = numUser + " — Быков: " + bulls + ", Коров: " + cows;
    }

    list.prepend(listItem);
    userInput.value = "";
}


function newwwGame() {
    secretNomber();
    cout = 0;
    counter.textContent = "Попыток: " + cout;
    list.innerHTML = "";
    userInput.value = "";
    userInput.disabled = false;
    proverkaBt.disabled = false;
}



proverkaBt.onclick = checkGuess;
newGame.onclick = newwwGame;
