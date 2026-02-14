/* =========================
   Velocity Viper – FULL FINAL VERSION
   ========================= */

/* ---------- GAME STATE ---------- */
let fuel = 100;
let health = 100;
let score = 0;

let speedBoostActive = false;
let shieldActive = false;

let originalSpeed = 1;
let boostMultiplier = 2;

let gamePaused = false;
let gameStarted = false;

let horizontalSpeed = 0;
let verticalSpeed = 0;

let carHorizontalPosition = 50;
let carVerticalPosition = 0;

let maxHorizontalCarPosition = 96;
let maxVerticalCarPosition = 96;

const minCarPosition = 0;
const minVerticalCarPosition = 0;

/* ---------- DOM ---------- */
const scoreDisplay = document.querySelector(".Score");
const car = document.querySelector(".car");
const container = document.querySelector(".max-area");
const fuelDisplay = document.querySelector(".fuel-percentage");
const healthDisplay = document.querySelector(".health-bar");
const mysteryBox = document.getElementById("mystery-box");
const popupEl = document.getElementById("popup-message");
const audioEl = document.getElementById("gameMusic");

/* ---------- UI TEXT ---------- */

function setFuelText() {
  fuelDisplay.textContent = `Fuel: ${Math.floor(fuel)}%`;
}
function setHealthText() {
  healthDisplay.textContent = `Health: ${Math.floor(health)}%`;
}
function setScoreText() {
  scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
}

setFuelText();
setHealthText();
setScoreText();

/* ---------- BOUNDS ---------- */
function recalcBounds() {
  const carRect = car.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();
  maxHorizontalCarPosition = 100 - (carRect.width / contRect.width) * 100;
  maxVerticalCarPosition = 100 - (carRect.height / contRect.height) * 100;
}
recalcBounds();
window.addEventListener("resize", recalcBounds);

/* ---------- POSITION ---------- */
function setCarPosition() {
  car.style.left = carHorizontalPosition + "%";
  car.style.bottom = carVerticalPosition + "%";
}
setCarPosition();

/* ---------- PAUSE ---------- */
function togglePause() {
  if (!gameStarted) return;

  gamePaused = !gamePaused;
  const overlay = document.getElementById("pause-overlay");

  if (gamePaused) {
    overlay.style.display = "flex";
    document.querySelector(".container").style.filter = "blur(6px)";
  } else {
    overlay.style.display = "none";
    document.querySelector(".container").style.filter = "none";
  }
}

/* ---------- COUNTDOWN ---------- */
function startCountdown() {
  const overlay = document.getElementById("countdown-overlay");
  const text = document.getElementById("countdown-text");

  overlay.style.display = "flex";
  let count = 3;
  text.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      text.textContent = count;
    } else if (count === 0) {
      text.textContent = "GO!";
    } else {
      clearInterval(interval);
      overlay.style.display = "none";
      gameStarted = true;
    }
  }, 1000);
}

/* ---------- FUEL ---------- */
function updateFuel() {
  fuel -= 0.02;
  if (fuel < 0) fuel = 0;
  setFuelText();
  if (fuel === 0) gameOver();
}
function increaseFuel() {
  fuel = Math.min(100, fuel + 20);
  setFuelText();
  animateFuelRefill();
}

function animateFuelRefill() {
  fuelDisplay.style.transform = "scale(1.3)";
  fuelDisplay.style.transition = "0.3s";
  setTimeout(() => (fuelDisplay.style.transform = "scale(1)"), 300);
}

/* ---------- HEALTH ---------- */
function setHealth(p) {
  health = Math.max(0, Math.min(100, p));
  setHealthText();
}

function increaseHealth() {
  setHealth(health + 30);
}

/* ---------- SPARKS ---------- */
function createSparks() {
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    const rect = car.getBoundingClientRect();
    spark.style.left = rect.left + rect.width / 2 + "px";
    spark.style.top = rect.top + rect.height / 2 + "px";
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 500);
  }
}

function handleCollision() {
  if (shieldActive) return;

  createSparks();
  setHealth(health - 1);

  if (health <= 0) gameOver();
}
function activateRandomPowerUp() {
  const powers = ["heal", "boost", "shield", "fuel"];
  const chosen = powers[Math.floor(Math.random() * powers.length)];

  showPowerMessage(chosen);

  if (chosen === "heal") {
    setHealth(health + 30);
  }

  if (chosen === "heal") {
    setHealth(health + 30);
    animateHealEffect();
  }

  if (chosen === "boost") {
    activateSpeedBoost();
  }

  if (chosen === "shield") {
    activateShield();
  }
}
function animateHealEffect() {
  document.body.style.transition = "0.2s";
  document.body.style.backgroundColor = "rgba(0,255,0,0.2)";

  setTimeout(() => {
    document.body.style.backgroundColor = "transparent";
  }, 200);
}

function animateFuelEffect() {
  fuelDisplay.style.transition = "0.3s";
  fuelDisplay.style.transform = "scale(1.3)";
  fuelDisplay.style.boxShadow = "0 0 15px yellow";

  setTimeout(() => {
    fuelDisplay.style.transform = "scale(1)";
    fuelDisplay.style.boxShadow = "none";
  }, 300);
}

function activateSpeedBoost() {
  if (speedBoostActive) return;

  speedBoostActive = true;
  document.body.classList.add("boost-active");

  const boostDuration = 5000;

  const trailInterval = setInterval(() => {
    createBoostTrail();
  }, 100);

  setTimeout(() => {
    speedBoostActive = false;
    document.body.classList.remove("boost-active");
    clearInterval(trailInterval);
  }, boostDuration);
}

function activateShield() {
  if (shieldActive) return;

  shieldActive = true;
  document.body.classList.add("shield-active");

  setTimeout(() => {
    shieldActive = false;
    document.body.classList.remove("shield-active");
  }, 5000);
}

function createBoostTrail() {
  const trail = document.createElement("div");
  trail.className = "boost-trail";

  const rect = car.getBoundingClientRect();
  trail.style.left = rect.left + "px";
  trail.style.top = rect.top + "px";

  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 500);
}

/* ---------- SCORE ---------- */
function updateBestScore(newScore) {
  const prev = localStorage.getItem("bestScore");
  if (!prev || newScore > +prev) localStorage.setItem("bestScore", newScore);
}

function updateScore() {
  score += 0.5;
  const s = Math.floor(score);
  updateBestScore(s);
  setScoreText();
}

/* ---------- MOVEMENT ---------- */
function updateCarPosition() {
  carHorizontalPosition += horizontalSpeed;
  carVerticalPosition += verticalSpeed;

  carHorizontalPosition = Math.max(
    minCarPosition,
    Math.min(maxHorizontalCarPosition, carHorizontalPosition),
  );
  carVerticalPosition = Math.max(
    minVerticalCarPosition,
    Math.min(maxVerticalCarPosition, carVerticalPosition),
  );

  setCarPosition();
}

/* ---------- KEYBOARD ---------- */
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  if (k === "p") {
    togglePause();
    return;
  }
  if (!gameStarted || gamePaused) return;

  if (k === "arrowleft") horizontalSpeed = -1;
  if (k === "arrowright") horizontalSpeed = 1;
  if (k === "arrowup") verticalSpeed = 1;
  if (k === "arrowdown") verticalSpeed = -1;

  if (k === "q" && mysteryBoxIsVisible()) {
    setHealth(health + 30);
    removeMysteryBox();
  } else if (mysteryBoxIsVisible()) {
    activateRandomPowerUp();
    removeMysteryBox();
  }

  if (k === "e" && mysteryBoxIsVisible()) {
    fuel = Math.min(100, fuel + 20);
    animateFuelRefill();
    removeMysteryBox();
  }

  startMusicOnce();
});

document.addEventListener("keyup", () => {
  horizontalSpeed = 0;
  verticalSpeed = 0;
});

const controlsOverlay = document.getElementById("controls-overlay");

if (controlsOverlay) {
  controlsOverlay.addEventListener("click", () => {
    controlsOverlay.style.display = "none";
    startCountdown();
  });
}

/* ---------- ROAD LINES ---------- */
const lines2Positions = [200, 0, -200, -400];
const leftLinePositions = [200, 0, -200, -400];
const rightLinePositions = [200, 0, -200, -400];
const linesPositions = [200, 0, -200, -400];

function moveRoadLines() {
  const h = container.clientHeight;
  for (let i = 0; i < 4; i++) {
    lines2Positions[i] += 5;
    if (lines2Positions[i] > h) lines2Positions[i] = -100;
    document.getElementById(`lines2-${i + 1}`).style.top =
      lines2Positions[i] + "px";

    leftLinePositions[i] += 5;
    if (leftLinePositions[i] > h) leftLinePositions[i] = -100;
    document.getElementById(`leftline-${i + 1}`).style.top =
      leftLinePositions[i] + "px";

    rightLinePositions[i] += 5;
    if (rightLinePositions[i] > h) rightLinePositions[i] = -100;
    document.getElementById(`rightline-${i + 1}`).style.top =
      rightLinePositions[i] + "px";

    linesPositions[i] += 5;
    if (linesPositions[i] > h) linesPositions[i] = -100;
    document.getElementById(`lines-${i + 1}`).style.top =
      linesPositions[i] + "px";
  }
}

/* ---------- ENEMIES ---------- */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createEnemyCars() {
  const containerEl = document.querySelector(".enemy-cars-container");
  const imgs = [
    "../gamepics/car1.png",
    "../gamepics/car3.png",
    "../gamepics/car4.png",
    "../gamepics/car5.png",
  ];

  for (let i = 1; i <= 10; i++) {
    const enemy = document.createElement("img");
    enemy.src = imgs[Math.floor(Math.random() * imgs.length)];
    enemy.classList.add("EnemyCar");
    enemy.style.left = getRandomNumber(0, container.clientWidth - 50) + "px";
    enemy.style.top = -getRandomNumber(100, 500) + "px";
    enemy.dataset.speed = getRandomNumber(1, 4);
    containerEl.appendChild(enemy);
  }
}

createEnemyCars();

function moveEnemyCars() {
  document.querySelectorAll(".EnemyCar").forEach((enemy) => {
    let top = parseInt(enemy.style.top);
    if (top >= container.clientHeight) {
      top = -getRandomNumber(100, 300);
      enemy.style.left = getRandomNumber(0, container.clientWidth - 50) + "px";
    } else {
      top += parseInt(enemy.dataset.speed);
    }
    enemy.style.top = top + "px";
    if (checkCollision(car, enemy)) handleCollision();
  });
}

/* ---------- TREES ---------- */
function createTrees(side) {
  const containerEl = document.querySelector(`.${side}-trees`);
  for (let i = 0; i < 3; i++) {
    const tree = document.createElement("img");
    tree.src = `../gamepics/tree${getRandomNumber(1, 3)}.png`;
    tree.classList.add("tree");
    tree.style.position = "absolute";
    tree.style.width = "100px";
    tree.style.height = "100px";
    tree.style.top = i * 150 + "px";
    if (side === "left") tree.style.left = "0";
    else tree.style.right = "0";
    tree.dataset.speed = 5;
    containerEl.appendChild(tree);
  }
}
createTrees("left");
createTrees("right");

function moveTrees() {
  document.querySelectorAll(".tree").forEach((tree) => {
    let top = parseInt(tree.style.top);
    if (top >= container.clientHeight) top = -100;
    else top += parseInt(tree.dataset.speed);
    tree.style.top = top + "px";
  });
}

/* ---------- COLLISION ---------- */
function checkCollision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
}

/* ---------- MYSTERY BOX ---------- */
function mysteryBoxIsVisible() {
  const r1 = car.getBoundingClientRect();
  const r2 = mysteryBox.getBoundingClientRect();
  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
}

function removeMysteryBox() {
  mysteryBox.style.display = "none";
}
/* ---------- MYSTERY BOX SPAWN SYSTEM ---------- */

function showMysteryBox() {
  const left = getRandomNumber(
    0,
    container.clientWidth - mysteryBox.offsetWidth,
  );

  const top = getRandomNumber(
    0,
    container.clientHeight - mysteryBox.offsetHeight,
  );

  mysteryBox.style.left = `${left}px`;
  mysteryBox.style.top = `${top}px`;
  mysteryBox.style.display = "block";

  // Hide after 5 seconds if not collected
  setTimeout(() => {
    if (mysteryBox.style.display !== "none") {
      mysteryBox.style.display = "none";

      // Respawn after 10 seconds
      setTimeout(showMysteryBox, 10000);
    }
  }, 5000);
}

function removeMysteryBox() {
  mysteryBox.style.display = "none";

  // Respawn after 10 seconds
  setTimeout(showMysteryBox, 10000);
}

function checkMysteryBoxCollision() {
  if (mysteryBox.style.display === "none") return;

  const carRect = car.getBoundingClientRect();
  const boxRect = mysteryBox.getBoundingClientRect();

  const collided =
    carRect.left < boxRect.right &&
    carRect.right > boxRect.left &&
    carRect.top < boxRect.bottom &&
    carRect.bottom > boxRect.top;

  if (collided) {
    activateRandomPowerUp();
    removeMysteryBox();
  }
}

/* ---------- MUSIC ---------- */
let musicStarted = false;
function startMusicOnce() {
  if (musicStarted) return;
  audioEl.muted = false;
  audioEl.loop = true;
  audioEl.play().catch(() => {});
  musicStarted = true;
}
/* ---------- MAIN LOOP ---------- */
function animate() {
  if (gameStarted && !gamePaused) {
    updateFuel();
    updateCarPosition();
    moveRoadLines();
    moveEnemyCars();
    moveTrees();
    updateScore();
    checkMysteryBoxCollision();
  }
  requestAnimationFrame(animate);
}
function setupTouchControls() {
  const controls = document.getElementById("touch-controls");
  if (!controls) return;

  const left = document.getElementById("btn-left");
  const right = document.getElementById("btn-right");
  const up = document.getElementById("btn-up");
  const down = document.getElementById("btn-down");

  left.ontouchstart = () => (horizontalSpeed = -1);
  right.ontouchstart = () => (horizontalSpeed = 1);
  up.ontouchstart = () => (verticalSpeed = 1);
  down.ontouchstart = () => (verticalSpeed = -1);

  [left, right, up, down].forEach((btn) => {
    btn.ontouchend = () => {
      horizontalSpeed = 0;
      verticalSpeed = 0;
    };
  });
}

function showPowerMessage(type) {
  const msg = document.createElement("div");
  msg.className = "power-popup";

  if (type === "heal") msg.textContent = "❤️ HEAL!";
  if (type === "boost") msg.textContent = "⚡ SPEED BOOST!";
  if (type === "shield") msg.textContent = "🛡 SHIELD!";
  if (type === "fuel") msg.textContent = "⛽ FUEL!";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 1500);
}

/* ---------- START ---------- */
setupTouchControls();
animate();

/* ---------- GAME OVER ---------- */
function gameOver() {
  window.location.href = `../menugame/menu.html?score=${Math.floor(score)}`;
}
