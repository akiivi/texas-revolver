const chambers = document.querySelectorAll(".chamber");
const message = document.getElementById("message");
const addBtn = document.getElementById("add");
const allInBtn = document.getElementById("all-in");
const fireBtn = document.getElementById("fire");
const ejectBtn = document.getElementById("eject");
const resetBtn = document.getElementById("reset");
const lifeSpan = document.getElementById("life");
const restoreBtn = document.getElementById("restore-life");

let bullets = [];
let life = 8;

// 初始化生命值
function renderLife() {
  lifeSpan.innerHTML = "❤".repeat(life) + "🤍".repeat(8 - life);
}
renderLife();

// 添加子弹
addBtn.addEventListener("click", () => {
  if (bullets.length < 8) {
    bullets.push(bullets.length);
    chambers[bullets.length - 1].classList.add("bullet");
    message.innerText = `已添加 ${bullets.length} 颗子弹`;
  } else {
    message.innerText = "子弹已加满，你这是All in！";
  }
});

// All in
allInBtn.addEventListener("click", () => {
  bullets = [];
  chambers.forEach(c => c.classList.remove("bullet"));
  for (let i = 0; i < 8; i++) {
    bullets.push(i);
    chambers[i].classList.add("bullet");
  }
  message.innerText = "8/8，满满的！";
});

// 退弹
ejectBtn.addEventListener("click", () => {
  bullets = [];
  chambers.forEach(c => c.classList.remove("bullet"));
  message.innerText = "所有子弹已退弹！";
});

// 恢复生命值
restoreBtn.addEventListener("click", () => {
  life = 8;
  renderLife();
  message.innerText = "生命值已恢复！";
});

// 随机闪烁并停靠
function spinAndStop(resultIndex, callback) {
  let flashes = 12; // 随机闪烁次数
  let current = 0;
  const interval = setInterval(() => {
    chambers.forEach(c => c.classList.remove("highlight"));
    const idx = Math.floor(Math.random() * 8);
    chambers[idx].classList.add("highlight");
    current++;
    if (current >= flashes) {
      clearInterval(interval);
      chambers.forEach(c => c.classList.remove("highlight"));
      chambers[resultIndex].classList.add("highlight");
      callback();
    }
  }, 150);
}

// 开火
fireBtn.addEventListener("click", () => {
  if (bullets.length === 0) {
    message.innerText = "没有子弹，请先装填！";
    return;
  }

  const chance = bullets.length / 8;
  const rand = Math.random();
  let resultIndex = Math.floor(Math.random() * 8);

  if (rand < 0.08) {
    // 卡弹
    spinAndStop(resultIndex, () => {
      document.body.classList.add("flash-yellow");
      message.innerText = "卡弹！这才是！运气王！";
      setTimeout(() => {
        document.body.classList.remove("flash-yellow");
      }, 1000);
    });
  } else if (rand < 0.08 + chance) {
    // 成功开火
    const bulletIndex = bullets[Math.floor(Math.random() * bullets.length)];
    resultIndex = bulletIndex;
    spinAndStop(resultIndex, () => {
      document.body.classList.add("flash-red");
      message.innerText = "爆炸💥 抱歉，你好像有点鼠了";
      life--;
      renderLife();
      setTimeout(() => {
        document.body.classList.remove("flash-red");
        ejectBtn.click(); // 延迟退弹
        if (life <= 0) {
          message.innerText = "生命值清零，游戏结束！";
        }
      }, 1000);
    });
  } else {
    // 空枪
    spinAndStop(resultIndex, () => {
      document.body.classList.add("flash-green");
      message.innerText = "空枪！哟，运气不错嘛";
      setTimeout(() => {
        document.body.classList.remove("flash-green");
      }, 1000);
    });
  }
});

// 刷新
resetBtn.addEventListener("click", () => {
  location.reload();
});
