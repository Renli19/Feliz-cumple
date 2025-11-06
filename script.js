const canvas = document.getElementById("saitamaCanvas");
const ctx = canvas.getContext("2d");
const message = document.querySelector(".message");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ---- Variables ----
let punchX = -300;
let punching = true;
let frame = 0;

// ---- Dibujar puño ----
function drawFist() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(punchX, canvas.height / 2);
  ctx.scale(2, 2);

  // Puño
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(40, -20);
  ctx.lineTo(80, -15);
  ctx.lineTo(100, 0);
  ctx.lineTo(80, 15);
  ctx.lineTo(40, 20);
  ctx.closePath();
  ctx.fill();

  // Brazo
  ctx.fillRect(-100, -10, 100, 20);
  ctx.restore();
}

// ---- Animación ----
function animate() {
  if (punching) {
    punchX += 15; // más lento
    if (punchX > canvas.width / 2 - 80 && frame === 0) {
      frame = 1;
      playPunchSound();
      flashScreen();
      setTimeout(() => {
        message.classList.remove("hidden");
      }, 1500);
    }
    if (punchX > canvas.width + 200) {
      punching = false;
    }
  } else if (punchX > -300) {
    punchX -= 5; // regresa despacio
  }

  drawFist();
  requestAnimationFrame(animate);
}
animate();

// ---- Flash de impacto ----
function flashScreen() {
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = 0;
  flash.style.left = 0;
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.background = "white";
  flash.style.opacity = "0.8";
  flash.style.zIndex = "1";
  document.body.appendChild(flash);
  setTimeout(() => {
    flash.style.transition = "opacity 0.6s";
    flash.style.opacity = "0";
    setTimeout(() => flash.remove(), 600);
  }, 150);
}

// ---- Sonido del golpe ----
function playPunchSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}
