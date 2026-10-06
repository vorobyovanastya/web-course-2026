let secretCode = '';   // Загаданное число
let history = [];      // Массив попыток
let isGameOver = false;

const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const winMessage = document.getElementById('win-message');
const historyList = document.getElementById('history-list');
const attemptsCount = document.getElementById('attempts-count');

function generateSecretCode() {
  let result = '';
  while (result.length < 4) {
    const randomDigit = Math.floor(Math.random() * 10).toString();
    // Если цифры ещё нет в числе — добавляем её
    if (!result.includes(randomDigit)) {
      result += randomDigit;
    }
  }
  return result;
}

function validateInput(input) {
  // Проверка длины
  if (input.length !== 4) {
    return 'Нужно ввести ровно 4 цифры!';
  }
  
  // Проверка все ли символы — цифры
  for (let i = 0; i < input.length; i++) {
    if (isNaN(input[i]) || input[i] === ' ') {
      return 'Вводите только цифры!';
    }
  }

  // Проверка на повторяющиеся цифры
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (input[i] === input[j]) {
        return 'Все цифры должны быть разными!';
      }
    }
  }

  return null; 
}

function calculateBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      bulls++;
    } else if (secret.includes(guess[i])) {
      cows++;
    }
  }

  return { bulls, cows };
}

function render() {
  attemptsCount.textContent = history.length;
  historyList.innerHTML = '';

  history.forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <span class="guess-val">${item.guess}</span>
      <span class="result-val">${item.bulls} бык(а), ${item.cows} коров(ы)</span>
    `;
    historyList.appendChild(li);
  });

  if (isGameOver) {
    guessInput.disabled = true;
    submitBtn.disabled = true;
    winMessage.classList.remove('hidden');
    winMessage.textContent = `Победа! Угадано за ${history.length} попыток!`;
  } else {
    guessInput.disabled = false;
    submitBtn.disabled = false;
    winMessage.classList.add('hidden');
  }
}

// Запуск новой игры
function initGame() {
  secretCode = generateSecretCode();
  history = [];
  isGameOver = false;

  console.log('Загаданное число:', secretCode);

  errorMessage.classList.add('hidden');
  guessInput.value = '';
  render();
}

document.getElementById('guess-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const userGuess = guessInput.value.trim();
  const error = validateInput(userGuess);

  if (error) {
    errorMessage.textContent = error;
    errorMessage.classList.remove('hidden');
    return;
  }

  errorMessage.classList.add('hidden');

  const result = calculateBullsAndCows(secretCode, userGuess);

  history.push({
    guess: userGuess,
    bulls: result.bulls,
    cows: result.cows
  });

  if (result.bulls === 4) {
    isGameOver = true;
  }

  guessInput.value = '';
  render();
});

document.getElementById('new-game-btn').addEventListener('click', initGame);

initGame();
