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
    let activeTimeouts = []; 

    function clearAllTimeouts() {
        activeTimeouts.forEach(t => clearTimeout(t));
        activeTimeouts = [];
    }

    startBtn.addEventListener('click', () => {
        startGame();
    });

    
    restartBtn.addEventListener('click', () => {
        modal.classList.add('hidden'); // Скрываем модалку
        startGame();
    });

    function startGame() {
        clearAllTimeouts();
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
        let delay = 600;

        sequence.forEach((padIndex, i) => {
            let showTimer = setTimeout(() => {
                activatePad(padIndex);
            }, delay * (i + 1));

            activeTimeouts.push(showTimer);
        });

        let finishTimer = setTimeout(() => {
            isComputerTurn = false;
            statusText.textContent = 'Ваша очередь!';
        }, delay * (sequence.length + 1));

        activeTimeouts.push(finishTimer);
    }

    function activatePad(index) {
        const pad = pads[index];
        pad.classList.add('active');
        
        let removeTimer = setTimeout(() => {
            pad.classList.remove('active');
        }, 350);

        activeTimeouts.push(removeTimer);
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
                    
                    let nextTimer = setTimeout(() => {
                        nextRound();
                    }, 1000);
                    activeTimeouts.push(nextTimer);
                }
            } else {
                gameOver();
            }
        });
    });

    function gameOver() {
        clearAllTimeouts();
        statusText.textContent = 'Игра окончена';
        startBtn.disabled = false;
        isComputerTurn = true;

        finalScore.textContent = `Вы дошли до уровня: ${sequence.length}`;
        modal.classList.remove('hidden');
    }
});
