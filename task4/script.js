let number = '';
let cout = 0;

const userInpur = document.getElementById('user-input');
const proverkaBt = document.getElementById('guess-btn');
const newGame = document.getElementById('new-game');
const counter = document.getElementById('counter');
const list = document.getElementById('history-list');

// Генерация случайного 4-значного числа с уникальными цифрами
function secretNomber() {
    number = '';
    while (number.length < 4) {
        let num = Math.floor(Math.random() * 10).toString();
        // Чтобы первая цифра не была нулем и цифры не повторялись
        if ((number.length > 0 || num !== '0') && number.indexOf(num) === -1) {
            number += num;
        }
    }
    console.log("Загаданное число: " + number);
}

secretNomber();

// Проверка попытки
function checkGuess() {
    let guess = userInpur.value;

    if (guess.length !== 4) {
        alert("Введите 4 цифры!");
        return;
    }

    // Проверяем, чтобы цифры у пользователя не повторялись
    for (let i = 0; i < guess.length; i++) {
        // Если символ встречается в строке еще где-то (индексы не равны)
        if (guess.indexOf(guess[i]) !== guess.lastIndexOf(guess[i])) {
            alert("Цифры не должны повторяться!");
            return;
        }
    }

    cout++;
    counter.textContent = "Попыток: " + cout;

    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === number[i]) {
            bulls++;
        } else if (number.indexOf(guess[i]) !== -1) {
            cows++;
        }
    }

    let listItem = document.createElement("li");

    if (bulls === 4) {
        listItem.textContent = "Победа! Число " + number + " за " + cout + " поп.";
        userInpur.disabled = true;
        proverkaBt.disabled = true;
    } else {
        listItem.textContent = guess + " — Быков: " + bulls + ", Коров: " + cows;
    }

    list.prepend(listItem);
    userInpur.value = "";
}

// Новая игра
function resetGame() {
    secretNomber();
    cout = 0;
    counter.textContent = "Попыток: " + cout;
    list.innerHTML = "";
    userInpur.value = "";
    userInpur.disabled = false;
    proverkaBt.disabled = false;
}

proverkaBt.onclick = checkGuess;
newGame.onclick = resetGame;
