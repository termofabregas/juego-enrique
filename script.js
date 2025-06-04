const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const timerElement = document.getElementById("timer");
const lapsElement = document.getElementById("laps");
const gameOverScreen = document.getElementById("game-over");
const winScreen = document.getElementById("win-screen");
const finalTimeElement = document.getElementById("final-time");

// Configuración del juego
canvas.width = 800;
canvas.height = 600;

// Nave espacial
const ship = {
    x: 100,
    y: 300,
    width: 20,
    height: 30,
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.05,
    rotation: 0,
    color: "#00ff00"
};

// Pista (array de puntos: {x, y})
const track = [
    {x: 100, y: 100}, {x: 700, y: 100}, {x: 700, y: 500}, {x: 100, y: 500}
];

let laps = 0;
let startTime = 0;
let currentTime = 0;
let isGameOver = false;
let isAccelerating = false;

// Iniciar juego
function startGame() {
    laps = 0;
    startTime = Date.now();
    isGameOver = false;
    gameOverScreen.style.display = "none";
    winScreen.style.display = "none";
    update();
}

// Reiniciar juego
function resetGame() {
    ship.x = 100;
    ship.y = 300;
    ship.speed = 0;
    ship.rotation = 0;
    startGame();
}

// Actualizar juego
function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar pista
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(track[0].x, track[0].y);
    for (let i = 1; i < track.length; i++) {
        ctx.lineTo(track[i].x, track[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Actualizar nave
    if (isAccelerating) {
        ship.speed = Math.min(ship.speed + ship.acceleration, ship.maxSpeed);
    } else {
        ship.speed = Math.max(ship.speed - 0.02, 0);
    }

    ship.x += Math.cos(ship.rotation) * ship.speed;
    ship.y += Math.sin(ship.rotation) * ship.speed;

    // Dibujar nave
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.rotation);
    ctx.fillStyle = ship.color;
    ctx.beginPath();
    ctx.moveTo(ship.width / 2, 0);
    ctx.lineTo(-ship.width / 2, -ship.height / 2);
    ctx.lineTo(-ship.width / 2, ship.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Chequear colisión con bordes
    if (
        ship.x < 0 || ship.x > canvas.width ||
        ship.y < 0 || ship.y > canvas.height
    ) {
        gameOver();
    }

    // Chequear vueltas
    if (ship.x < 110 && ship.y > 290 && ship.y < 310 && ship.speed > 1) {
        laps++;
        lapsElement.textContent = `Vueltas: ${laps}/2`;
        if (laps >= 2) {
            win();
        }
    }

    // Actualizar temporizador
    currentTime = (Date.now() - startTime) / 1000;
    timerElement.textContent = `Tiempo: ${currentTime.toFixed(2)}s`;

    requestAnimationFrame(update);
}

// Game Over
function gameOver() {
    isGameOver = true;
    gameOverScreen.style.display = "flex";
}

// Ganar
function win() {
    isGameOver = true;
    finalTimeElement.textContent = `Tiempo final: ${currentTime.toFixed(2)}s`;
    winScreen.style.display = "flex";
}

// Eventos de teclado
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        isAccelerating = true;
    }
    if (e.key === "ArrowLeft") {
        ship.rotation -= 0.1;
    }
    if (e.key === "ArrowRight") {
        ship.rotation += 0.1;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        isAccelerating = false;
    }
});

// Iniciar juego al cargar la página
window.onload = startGame;
