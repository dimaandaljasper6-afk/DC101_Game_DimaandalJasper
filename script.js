const screens = {
  start: document.getElementById("start"),
  game: document.getElementById("game"),
  over: document.getElementById("over")
};

const chicken = document.getElementById("chicken");
const scoreEl = document.getElementById("score");
const highEl = document.getElementById("high");

let y = 160;
let velocity = 0;
let gravity = 0.7;
let score = 0;
let highScore = localStorage.getItem("cartoonChickenHigh") || 0;
let running = false;
let obstacleTimer;

highEl.textContent = highScore;

function show(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screen].classList.add("active");
}

function startGame() {
  score = 0;
  y = 160;
  velocity = 0;
  running = true;
  scoreEl.textContent = 0;

  document.querySelectorAll(".obstacle").forEach(o => o.remove());
  show("game");

  obstacleTimer = setInterval(spawnObstacle, 1700);
  requestAnimationFrame(update);
}

function restart() {
  show("start");
}

function jump() {
  if (!running) return;
  velocity = 11;
}

document.addEventListener("click", jump);
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

function update() {
  if (!running) return;

  velocity -= gravity;
  y += velocity;

  if (y <= 120) {
    endGame();
    return;
  }

  chicken.style.bottom = y + "px";
  requestAnimationFrame(update);
}

function spawnObstacle() {
  if (!running) return;

  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";
  obstacle.style.cssText = `
    position:absolute;
    bottom:120px;
    right:-30px;
    width:26px;
    height:60px;
    background:#6b7280;
    border-radius:6px;
  `;
  document.querySelector(".world").appendChild(obstacle);

  let x = 390;
  const move = setInterval(() => {
    if (!running) return clearInterval(move);

    x -= 5;
    obstacle.style.left = x + "px";

    if (x < -40) {
      clearInterval(move);
      obstacle.remove();
      score++;
      scoreEl.textContent = score;
    }

    if (x < 120 && x > 60 && y < 180) {
      endGame();
      clearInterval(move);
    }
  }, 20);
}

function endGame() {
  running = false;
  clearInterval(obstacleTimer);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("cartoonChickenHigh", highScore);
  }

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalHigh").textContent = highScore;
  show("over");
}
