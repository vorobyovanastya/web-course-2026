document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const modal = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [];
    let dx = 1;
    let dy = 0;
    let nextDx = 1;
    let nextDy = 0;
    let apple = { x: 0, y: 0 };
    let score = 0;
    let isGameOver = false;
    let gameStarted = false;

    let lastTime = 0;
    let accumulator = 0;
    const moveInterval = 180; 

    function initGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        dx = 1; dy = 0;
        nextDx = 1; nextDy = 0;
        score = 0;
        isGameOver = false;
        scoreElement.textContent = score;
        spawnApple();
    }

    function spawnApple() {
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);

        if (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
            spawnApple();
        }
    }

    function update() {
        if (isGameOver || !gameStarted) return;

        dx = nextDx;
        dy = nextDy;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === apple.x && head.y === apple.y) {
            score += 10;
            scoreElement.textContent = score;
            spawnApple();
        } else {
            snake.pop();
        }
    }

    function draw() {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(apple.x * gridSize + 2, apple.y * gridSize + 2, gridSize - 4, gridSize - 4);

        
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#3498db' : '#2980b9';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        });
    }

    function endGame() {
        isGameOver = true;
        gameStarted = false;
        finalScore.textContent = `Ваш счёт: ${score}`;
        modal.classList.remove('hidden');
    }

    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        accumulator += deltaTime;

        if (accumulator >= moveInterval) {
            update();
            accumulator = 0;
        }

        draw();

        if (gameStarted) {
            requestAnimationFrame(gameLoop);
        }
    }

    
    window.addEventListener('keydown', e => {
        if (!gameStarted) return;
        if (e.key === 'ArrowUp' && dy === 0) { nextDx = 0; nextDy = -1; }
        if (e.key === 'ArrowDown' && dy === 0) { nextDx = 0; nextDy = 1; }
        if (e.key === 'ArrowLeft' && dx === 0) { nextDx = -1; nextDy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { nextDx = 1; nextDy = 0; }
    });

    
    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        initGame();
        gameStarted = true;
        lastTime = 0;
        accumulator = 0;
        requestAnimationFrame(gameLoop);
    });

    restartBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        initGame();
        gameStarted = true;
        lastTime = 0;
        accumulator = 0;
        requestAnimationFrame(gameLoop);
    });

    
    initGame();
    draw();
});
