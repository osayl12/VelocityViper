/* =========================
   Car Game – java.js (clean)
   ========================= */

/* --- game state --- */
let fuel = 100;
let health = 100;
let score = 0;

let horizontalSpeed = 0; // in % per frame
let verticalSpeed = 0;   // in % per frame

let carHorizontalPosition = 50; // %
let carVerticalPosition = 0;    // %

let maxHorizontalCarPosition = 96; // will be recalculated dynamically
let maxVerticalCarPosition = 96;   // will be recalculated dynamically
const minCarPosition = 0;
const minVerticalCarPosition = 0;

/* --- dom refs --- */
const scoreDisplay  = document.querySelector('.Score');
const car           = document.querySelector('.car');
const container     = document.querySelector('.max-area');
const fuelDisplay   = document.querySelector('.fuel-percentage');
const healthDisplay = document.querySelector('.health-bar');

const fuelCdEl  = document.getElementById('fuel-cooldown');
const healCdEl  = document.getElementById('heal-cooldown');
const popupEl   = document.getElementById('popup-message');
const mysteryBox = document.getElementById('mystery-box');

const audioEl = document.getElementById('gameMusic');

/* --- helpers (ui text) --- */
function setFuelText()   { fuelDisplay.textContent   = `Fuel: ${Math.floor(fuel)}%`; }
function setHealthText() { healthDisplay.textContent = `Health: ${Math.floor(health)}%`; }
function setScoreText()  { scoreDisplay.textContent  = `Score: ${Math.floor(score)}`; }

/* init text */
setFuelText();
setHealthText();
setScoreText();

/* --- bounds calc: keep the car inside the container --- */
function recalcBounds() {
  const carRect  = car.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();
  if (contRect.width > 0 && contRect.height > 0) {
    maxHorizontalCarPosition = 100 - (carRect.width / contRect.width) * 100;
    maxVerticalCarPosition   = 100 - (carRect.height / contRect.height) * 100;
  }
}
recalcBounds();
window.addEventListener('resize', recalcBounds);

/* --- position --- */
function setCarPosition() {
  car.style.left   = carHorizontalPosition + '%';
  car.style.bottom = carVerticalPosition + '%';
}
setCarPosition();

/* --- cooldowns --- */
let canIncreaseFuel = true;
let canIncreaseHealth = true;
let fuelCooldownTimer = 0;   // seconds
let healthCooldownTimer = 0; // seconds

function resetFuelCooldown()  { fuelCooldownTimer = 0;  fuelCdEl.textContent = 'Fuel'; }
function resetHealthCooldown(){ healthCooldownTimer = 0; healCdEl.textContent = 'Health'; }

function updateCooldownTimers() {
  if (fuelCooldownTimer > 0) {
    fuelCdEl.textContent = `Cooldown: ${fuelCooldownTimer} sec`;
    fuelCooldownTimer--;
  }
  if (healthCooldownTimer > 0) {
    healCdEl.textContent = `Cooldown: ${healthCooldownTimer} sec`;
    healthCooldownTimer--;
  }
}
resetFuelCooldown();
resetHealthCooldown();
setInterval(updateCooldownTimers, 1000);

/* --- fuel/health updates --- */
function updateFuel() {
  fuel -= 0.02; // per frame; ~1.2/sec at 60fps
  if (fuel < 0) fuel = 0;
  setFuelText();
  if (fuel === 0) gameOver();
}

function setHealth(p) {
  health = Math.max(0, Math.min(100, p));
  setHealthText();
}

function handleCollision() {
  setHealth(health - 1);
  if (health <= 0) gameOver();
}

function increaseFuel() {
  if (canIncreaseFuel && fuelCooldownTimer === 0) {
    fuel = Math.min(100, fuel + 20);
    setFuelText();

    canIncreaseFuel = false;
    fuelCooldownTimer = 10; // seconds
    fuelCdEl.textContent = `Cooldown: ${fuelCooldownTimer} sec`;

    setTimeout(() => { canIncreaseFuel = true; resetFuelCooldown(); }, 10000);
  }
}

function increaseHealth() {
  if (canIncreaseHealth && healthCooldownTimer === 0) {
    setHealth(health + 30);

    canIncreaseHealth = false;
    healthCooldownTimer = 10; // seconds
    healCdEl.textContent = `Cooldown: ${healthCooldownTimer} sec`;

    setTimeout(() => { canIncreaseHealth = true; resetHealthCooldown(); }, 10000);
  }
}

/* --- score --- */
function updateBestScore(newScore) {
  const prev = localStorage.getItem('bestScore');
  if (!prev || newScore > +prev) localStorage.setItem('bestScore', newScore);
}
function updateScore() {
  score += 0.5; // per frame (adjust to taste)
  const s = Math.floor(score);
  updateBestScore(s);
  setScoreText();
}

/* --- movement --- */
function updateCarPosition() {
  carHorizontalPosition += horizontalSpeed;
  carVerticalPosition   += verticalSpeed;

  carHorizontalPosition = Math.max(minCarPosition, Math.min(maxHorizontalCarPosition, carHorizontalPosition));
  carVerticalPosition   = Math.max(minVerticalCarPosition, Math.min(maxVerticalCarPosition, carVerticalPosition));

  setCarPosition();
}

/* --- read current car bottom (px) if needed) --- */
function getCurrentCarPosition() {
  const carStyle = getComputedStyle(car);
  return parseFloat(carStyle.bottom); // px
}

/* --- keyboard controls (normalized) --- */
let leftKey=false, rightKey=false, upKey=false, downKey=false;

document.addEventListener('keydown', (event) => {
  const k = event.key.toLowerCase();

  if (k === 'arrowleft')  { leftKey = true;  rightKey = false; horizontalSpeed = -1; }
  else if (k === 'arrowright'){ rightKey = true; leftKey = false; horizontalSpeed =  1; }
  else if (k === 'arrowup')   { upKey = true;   downKey = false; verticalSpeed   =  1; }
  else if (k === 'arrowdown') { downKey = true; upKey   = false; verticalSpeed   = -1; }

  // diagonals
  else if (k === 'u') { upKey=true; downKey=false; leftKey=true;  rightKey=false; horizontalSpeed=-1; verticalSpeed= 1; }
  else if (k === 'o') { upKey=true; downKey=false; leftKey=false; rightKey=true;  horizontalSpeed= 1; verticalSpeed= 1; }
  else if (k === 'l') { upKey=false; downKey=true; leftKey=true;  rightKey=false; horizontalSpeed=-1; verticalSpeed=-1; }
  else if (k === 'j') { upKey=false; downKey=true; leftKey=false; rightKey=true;  horizontalSpeed= 1; verticalSpeed=-1; }

  // mystery box actions
  else if (k === 'q' && mysteryBoxIsVisible()) { increaseHealth(); removeMysteryBox(); }
  else if (k === 'e' && mysteryBoxIsVisible()) { increaseFuel();  removeMysteryBox(); }

  // start/allow music on first interaction (autoplay policies)
  startMusicOnce();
});

document.addEventListener('keyup', (event) => {
  const k = event.key.toLowerCase();
  if (k === 'arrowleft')  { leftKey  = false; horizontalSpeed = rightKey ?  1 : 0; }
  else if (k === 'arrowright'){ rightKey = false; horizontalSpeed = leftKey ? -1 : 0; }
  else if (k === 'arrowup')   { upKey   = false; verticalSpeed   = downKey ? -1 : 0; }
  else if (k === 'arrowdown') { downKey = false; verticalSpeed   = upKey   ?  1 : 0; }
  else if (['u','o','l','j'].includes(k)) {
    upKey = downKey = leftKey = rightKey = false;
    horizontalSpeed = 0; verticalSpeed = 0;
  }
});

/* --- road lines animation (id sequences 1..4) --- */
const lines2Positions   = [200, 0, -200, -400];
const leftLinePositions = [200, 0, -200, -400];
const rightLinePositions= [200, 0, -200, -400];
const linesPositions    = [200, 0, -200, -400];

function moveRoadLines() {
  const h = container.clientHeight || window.innerHeight;

  for (let i=0;i<lines2Positions.length;i++){
    lines2Positions[i] += 5;
    if (lines2Positions[i] > h) lines2Positions[i] = -100;
    const el = document.getElementById(`lines2-${i+1}`);
    if (el) el.style.top = lines2Positions[i] + 'px';
  }
  for (let i=0;i<leftLinePositions.length;i++){
    leftLinePositions[i] += 5;
    if (leftLinePositions[i] > h) leftLinePositions[i] = -100;
    const el = document.getElementById(`leftline-${i+1}`);
    if (el) el.style.top = leftLinePositions[i] + 'px';
  }
  for (let i=0;i<rightLinePositions.length;i++){
    rightLinePositions[i] += 5;
    if (rightLinePositions[i] > h) rightLinePositions[i] = -100;
    const el = document.getElementById(`rightline-${i+1}`);
    if (el) el.style.top = rightLinePositions[i] + 'px';
  }
  for (let i=0;i<linesPositions.length;i++){
    linesPositions[i] += 5;
    if (linesPositions[i] > h) linesPositions[i] = -100;
    const el = document.getElementById(`lines-${i+1}`);
    if (el) el.style.top = linesPositions[i] + 'px';
  }
}

/* --- enemy cars --- */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createEnemyCars() {
  const numberOfEnemies = 10;
  const enemyCarsContainer = document.querySelector('.enemy-cars-container');
  const enemyCarImages = [
    '../gamepics/car1.png',
    '../gamepics/car3.png',
    '../gamepics/car4.png',
    '../gamepics/car5.png'
  ];

  for (let i = 1; i <= numberOfEnemies; i++) {
    const enemyCar = document.createElement('img');
    enemyCar.src = enemyCarImages[Math.floor(Math.random() * enemyCarImages.length)];
    enemyCar.classList.add('EnemyCar');
    enemyCar.id = `enemyCar${i}`;
    enemyCarsContainer.appendChild(enemyCar);

    const enemyCarLeft = getRandomNumber(0, container.clientWidth - 50);
    const enemyCarTop  = -getRandomNumber(100, 500);

    enemyCar.style.left = `${enemyCarLeft}px`;
    enemyCar.style.top  = `${enemyCarTop}px`;

    const enemyCarSpeed = getRandomNumber(1, 4);
    enemyCar.dataset.speed = enemyCarSpeed;
  }
}
createEnemyCars();

const enemyCars = Array.from(document.querySelectorAll('.EnemyCar'));

function moveEnemyCars() {
  enemyCars.forEach((enemyCar) => {
    let enemyCarTop = parseInt(enemyCar.style.top || '-100', 10);

    if (enemyCarTop >= container.clientHeight) {
      enemyCarTop = -getRandomNumber(100, 300);
      const enemyCarLeft = getRandomNumber(0, container.clientWidth - enemyCar.clientWidth);
      enemyCar.style.left = `${enemyCarLeft}px`;
    } else {
      enemyCarTop += parseInt(enemyCar.dataset.speed || '2', 10);
    }

    enemyCar.style.top = `${enemyCarTop}px`;

    if (checkCollision(car, enemyCar)) {
      handleCollision();
    }
  });
}

/* --- trees --- */
const treeImages = [
  '../gamepics/tree1.png',
  '../gamepics/tree2.png',
  '../gamepics/tree3.png',
];

function createTrees(side) {
  const numberOfTrees = 3;
  const treesContainer = document.querySelector(`.${side}-trees`);
  const treeWidth = 100, treeHeight = 100, space = 5;

  for (let i = 1; i <= numberOfTrees; i++) {
    const tree = document.createElement('img');
    tree.src = treeImages[Math.floor(Math.random() * treeImages.length)];
    tree.classList.add('tree');
    tree.style.width = `${treeWidth}px`;
    tree.style.height = `${treeHeight}px`;
    tree.style.position = 'absolute';

    const treeTop = 100 + ((i - 1) % numberOfTrees) * (treeHeight + space);
    if (side === 'left')  tree.style.left  = '0';
    if (side === 'right') tree.style.right = '0';
    tree.style.top = `${treeTop}px`;

    treesContainer.appendChild(tree);
    tree.dataset.speed = 5;
  }
}
createTrees('left');
createTrees('right');

function moveTrees() {
  const trees = document.querySelectorAll('.tree');
  trees.forEach((tree) => {
    let treeTop = parseInt(tree.style.top || '0', 10);
    if (treeTop >= container.clientHeight) {
      treeTop = 10;
      if (tree.style.left === '0')  tree.style.right = '0';
      else if (tree.style.right === '0') tree.style.left = '0';
    } else {
      treeTop += parseInt(tree.dataset.speed || '5', 10);
    }
    tree.style.top = `${treeTop}px`;
  });
}

/* --- collisions --- */
function checkCollision(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
}

/* --- music (autoplay policies) --- */
let musicStarted = false;
function startMusicOnce() {
  if (musicStarted || !audioEl) return;
  try {
    audioEl.muted = false;
    audioEl.loop = true;
    audioEl.play().catch(() => {});
  } catch {}
  musicStarted = true;
}
window.addEventListener('click', startMusicOnce, { once: true });
window.addEventListener('keydown', startMusicOnce, { once: true });

/* --- mystery box --- */
let mysteryBoxHintShown = false;

mysteryBox.addEventListener('mouseover', () => {
  if (mysteryBoxHintShown) return;
  showMysteryBoxMessage();
  mysteryBoxHintShown = true;
});

function showMysteryBoxMessage() {
  alert("Mystery Box! Press 'Q' for health or 'E' for fuel.");
}

function mysteryBoxIsVisible() {
  const carRect = car.getBoundingClientRect();
  const boxRect = mysteryBox.getBoundingClientRect();
  return (
    carRect.left < boxRect.right &&
    carRect.right > boxRect.left &&
    carRect.top < boxRect.bottom &&
    carRect.bottom > boxRect.top
  );
}

function removeMysteryBox() {
  mysteryBox.style.display = 'none';
}

function showMysteryBox() {
  const left = getRandomNumber(0, container.clientWidth  - mysteryBox.offsetWidth);
  const top  = getRandomNumber(0, container.clientHeight - mysteryBox.offsetHeight);
  mysteryBox.style.left = `${left}px`;
  mysteryBox.style.top  = `${top}px`;
  mysteryBox.style.display = 'block';
  mysteryBoxHintShown = false;

  setTimeout(() => {
    mysteryBox.style.display = 'none';
    setTimeout(showMysteryBox, 10000);
  }, 5000);
}
setTimeout(showMysteryBox, 10000);

/* --- popup tip on load --- */
function showPopupMessage() {
  if (!popupEl) return;
  popupEl.style.display = 'block';
  setTimeout(() => { popupEl.style.display = 'none'; }, 5000);
}
showPopupMessage();

/* --- main loop --- */
function animate() {
  updateFuel();
  updateCarPosition();
  moveRoadLines();
  moveEnemyCars();
  moveTrees();
  // read it if you need: const currentY = getCurrentCarPosition();
  updateScore();

  requestAnimationFrame(animate);
}
animate();

/* --- game over --- */
function gameOver() {
  const currentScore = Math.floor(score);
  const url = `../menugame/menu.html?score=${currentScore}`;
  window.location.href = url;
}
