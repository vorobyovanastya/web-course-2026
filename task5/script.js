document.addEventListener('DOMContentLoaded', () => {
    const pads = document.querySelectorAll('.pad');
    const startBtn = document.getElementById('start-btn');
    const statusText = document.getElementById('status-text');
    const levelCounter = document.getElementById('level-counter');
    const modal = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    let sequence = [];
    let playerIndex = 0;
    let isComputerTurn = true;

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        startGame();
    });

    function startGame() {
        sequence = [];
        playerIndex = 0;
        levelCounter.textContent = '0';
        statusText.textContent = 'Игра началась!';
        startBtn.disabled = true;
        nextRound();
    }

    function nextRound() {
        playerIndex = 0;
        isComputerTurn = true;
        levelCounter.textContent = sequence.length + 1;
        statusText.textContent = 'Компьютер показывает...';

        const randomPad = Math.floor(Math.random() * 4);
        sequence.push(randomPad);

        playSequence();
    }

    function playSequence() {
        sequence.forEach((padIndex, i) => {
            setTimeout(() => {
                activatePad(padIndex);
            }, 600 * (i + 1));
        });

        setTimeout(() => {
            isComputerTurn = false;
            statusText.textContent = 'Ваша очередь!';
        }, 600 * (sequence.length + 1));
    }

    function activatePad(index) {
        const pad = pads[index];
        pad.classList.add('active');
        setTimeout(() => {
            pad.classList.remove('active');
        }, 350);
    }

    pads.forEach(pad => {
        pad.addEventListener('click', (e) => {
            if (isComputerTurn) return;

            const clickedIndex = parseInt(e.target.dataset.index);
            activatePad(clickedIndex);

            if (clickedIndex === sequence[playerIndex]) {
                playerIndex++;

                if (playerIndex === sequence.length) {
                    isComputerTurn = true;
                    statusText.textContent = 'Верно! Следующий раунд...';
                    setTimeout(nextRound, 1000);
                }
            } else {
                gameOver();
            }
        });
    });

    function gameOver() {
        statusText.textContent = 'Игра окончена';
        startBtn.disabled = false;
        isComputerTurn = true;
        finalScore.textContent = `Вы дошли до уровня: ${sequence.length}`;
        modal.classList.remove('hidden');
    }
});
