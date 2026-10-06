let sequence = [];
let playerStep = 0;
let isPlayingSequence = false;
let isGameActive = false;
let currentRunId = 0;

let audioCtx = null;
const frequencies = [261.63, 329.63, 392.00, 523.25];

const sectors = document.querySelectorAll('.sector');
const startBtn = document.getElementById('start-btn');
const levelDisplay = document.getElementById('level-display');
const statusMessage = document.getElementById('status-message');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(index) {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequencies[index];
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {}
}

async function flashSector(index) {
  const sector = sectors[index];
  if (!sector) return;
  sector.classList.add('active');
  playSound(index);
  await sleep(400);
  sector.classList.remove('active');
}

function startGame() {
  initAudio();
  currentRunId++;
  sequence = [];
  playerStep = 0;
  isGameActive = true;
  startBtn.textContent = 'Заново';
  nextRound();
}

async function nextRound() {
  playerStep = 0;
  levelDisplay.textContent = sequence.length + 1;
  statusMessage.textContent = 'Слушайте последовательность...';
  
  const nextColor = Math.floor(Math.random() * 4);
  sequence.push(nextColor);

  await playSequence();
}

async function playSequence() {
  isPlayingSequence = true;
  const runId = currentRunId;

  await sleep(600);

  for (let i = 0; i < sequence.length; i++) {
    if (runId !== currentRunId) return;

    await flashSector(sequence[i]);
    await sleep(200);
  }

  if (runId !== currentRunId) return;

  isPlayingSequence = false;
  statusMessage.textContent = 'Ваш ход! Повторите последовательность.';
}

async function handleSectorClick(e) {
  if (!isGameActive || isPlayingSequence) return;

  const clickedIndex = parseInt(e.target.dataset.color);
  if (isNaN(clickedIndex)) return;

  flashSector(clickedIndex);

  if (clickedIndex === sequence[playerStep]) {
    playerStep++;

    if (playerStep === sequence.length) {
      statusMessage.textContent = 'Отлично!';
      isPlayingSequence = true;
      await sleep(1000);
      nextRound();
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  isGameActive = false;
  statusMessage.textContent = `Игра окончена! Вы дошли до уровня ${sequence.length}.`;
  levelDisplay.textContent = sequence.length;
  startBtn.textContent = 'Играть снова';
}

startBtn.addEventListener('click', startGame);

sectors.forEach(sector => {
  sector.addEventListener('click', handleSectorClick);
});
