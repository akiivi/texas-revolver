const chambers = document.querySelectorAll(".chamber");
const feedback = document.getElementById("feedback");
let bullets = 0;

// 更新弹巢状态
function updateChambers() {
  chambers.forEach((ch, idx) => {
    if (idx < bullets) ch.classList.add("loaded");
    else ch.classList.remove("loaded");
  });
}

// 弹巢闪烁
function flashChamber(index) {
  const ch = chambers[index];
  ch.classList.add("flash");
  setTimeout(() => ch.classList.remove("flash"), 800);
}

// 提示文字闪烁
function showFeedback(msg) {
  feedback.textContent = msg;
  feedback.classList.add("flash");
  setTimeout(() => feedback.classList.remove("flash"), 500);
}

// 加子弹
document.getElementById("loadBtn").addEventListener("click", () => {
  if (bullets < 8) {
    bullets++;
    updateChambers();
    flashChamber(bullets - 1);
    showFeedback(`当前子弹：${bullets}/8`);
    if (bullets === 8) showFeedback("8/8，满满的！这是All in！");
  } else showFeedback("子弹已加满，你这是All in！");
});

// All in
document.getElementById("allInBtn").addEventListener("click", () => {
  bullets = 8;
  updateChambers();
  chambers.forEach((ch, idx) => {
    setTimeout(() => flashChamber(idx), idx * 100);
  });
  showFeedback("8/8，满满的！");
});

// 开火逻辑
document.getElementById("fireBtn").addEventListener("click", () => {
  if (bullets === 0) {
    showFeedback("哟，运气不错嘛");
    return;
  }

  // 轮盘随机高亮闪烁
  let flashTimes = Math.floor(Math.random() * 2) + 1; // 1~2次
  let idx = bullets - 1;
  let count = 0;
  let flashInterval = setInterval(() => {
    chambers[idx].classList.toggle("flash");
    count++;
    if (count >= flashTimes * 2) {
      clearInterval(flashInterval);
      chambers[idx].classList.remove("flash");
      // 计算开火成功概率
      let fireProb = bullets / 8;
      let success = Math.random() < fireProb;
      let jam = Math.random() < 0.08;
      if (success && !jam) {
        showFeedback("爆炸💥 抱歉，你好像有点鼠了");
        ejectBullets();
      } else if (!success && !jam) {
        showFeedback("空弹 哟，运气不错嘛");
      } else if (jam) {
        showFeedback("卡壳 这才是！运气王！");
        ejectBullets();
      }
    }
  }, 200);
});

// 退弹
document.getElementById("ejectBtn").addEventListener("click", ejectBullets);

function ejectBullets() {
  // 退弹动画
  chambers.forEach((ch, idx) => {
    if (ch.classList.contains("loaded")) {
      ch.classList.add("flash");
      setTimeout(() => ch.classList.remove("flash"), 200);
    }
  });
  bullets = 0;
  updateChambers();
  showFeedback("已退弹");
}
