let bullets = 0;
let maxBullets = 8;
let chambers = document.querySelectorAll(".chamber");
let feedback = document.getElementById("feedback");
let heartsContainer = document.getElementById("hearts");
let life = 8;

function updateHearts() {
  heartsContainer.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    let h = document.createElement("div");
    h.className = "heart";
    if (i >= life) h.classList.add("gray");
    heartsContainer.appendChild(h);
  }
}

updateHearts();

document.getElementById("addBulletBtn").addEventListener("click", () => {
  if (bullets < maxBullets) {
    bullets++;
    showFeedback(`子弹已添加: ${bullets}/${maxBullets}`, "#fff");
  }
  if (bullets === maxBullets) {
    showFeedback(`8/8，满满的！`, "#ff69b4");
  }
});

document.getElementById("allInBtn").addEventListener("click", () => {
  bullets = maxBullets;
  showFeedback(`8/8，满满的！`, "#ff69b4");
});

document.getElementById("ejectBtn").addEventListener("click", () => {
  bullets = 0;
  chambers.forEach(c => c.style.backgroundColor = "#555");
  showFeedback("已退弹", "#fff");
});

document.getElementById("healBtn").addEventListener("click", () => {
  life = 8;
  updateHearts();
  showFeedback("生命值已恢复满", "#ff0000");
});

function showFeedback(text, color) {
  feedback.textContent = text;
  feedback.style.color = color;
  feedback.classList.add("flash");
  setTimeout(() => feedback.classList.remove("flash"), 800);
}

function loseLife() {
  if (life > 0) life--;
  updateHearts();
  if (life === 0) showFeedback("生命值已清零！游戏结束！", "#ff0000");
}

function ejectBullets() {
  bullets = 0;
  chambers.forEach(c => c.style.backgroundColor = "#555");
}

document.getElementById("fireBtn").addEventListener("click", () => {
  if (bullets === 0) {
    showFeedback("哟，运气不错嘛", "#00ff00");
    return;
  }

  let idx = bullets - 1;
  let startTime = Date.now();
  let flashDuration = 1500;

  let flashInterval = setInterval(() => {
    chambers[idx].classList.toggle("flash");
    if (Date.now() - startTime > flashDuration) {
      clearInterval(flashInterval);
      chambers[idx].classList.remove("flash");

      let fireProb = bullets / 8;
      let success = Math.random() < fireProb;
      let jam = Math.random() < 0.08;

      if (success && !jam) {
        chambers[idx].style.backgroundColor = "red";
        showFeedback("爆炸💥 抱歉，你好像有点鼠了", "#ff0000");
        loseLife();
        setTimeout(() => ejectBullets(), 1000);
      } else if (!success && !jam) {
        chambers[idx].style.backgroundColor = "gray";
        showFeedback("空弹 哟，运气不错嘛", "#00ff00");
      } else if (jam) {
        chambers[idx].style.backgroundColor = "yellow";
        showFeedback("卡壳 这才是！运气王！", "#ffff00");
        setTimeout(() => ejectBullets(), 1000);
      }
    }
  }, 150);
});
