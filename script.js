const chambers = document.querySelectorAll(".chamber");
const message = document.getElementById("message");

let bullets = []; // 保存子弹位置

// 加子弹
document.getElementById("addBullet").addEventListener("click", () => {
  if (bullets.length >= 8) {
    const tips = [
      "开火吧，交给运气",
      "8/8，你这是All in",
      "已经不能再添加咯"
    ];
    showMessage(tips[Math.floor(Math.random() * tips.length)]);
    return;
  }
  const nextSlot = bullets.length;
  bullets.push(nextSlot);
  chambers[nextSlot].classList.add("active");
  showMessage(`子弹已添加：${bullets.length}/8`);
});

// All in
document.getElementById("allIn").addEventListener("click", () => {
  if (bullets.length >= 8) {
    const tips = [
      "开火吧，交给运气",
      "8/8，你这是All in",
      "已经不能再添加咯"
    ];
    showMessage(tips[Math.floor(Math.random() * tips.length)]);
    return;
  }
  for (let i = bullets.length; i < 8; i++) {
    bullets.push(i);
    chambers[i].classList.add("active");
  }
  showMessage("8/8，满满的！");
});

// 开火
document.getElementById("fire").addEventListener("click", () => {
  if (bullets.length === 0) {
    showMessage("空仓，什么都没有发生！");
    return;
  }
  // 计算概率
  const successProb = bullets.length / 8;
  const rand = Math.random();
  if (rand < successProb * 0.92) {
    // 开火成功
    showMessage("💥 爆炸！抱歉，你好像有点鼠了");
    setTimeout(ejectBullets, 1000); // 延迟退弹
  } else if (rand < successProb) {
    // 卡弹
    showMessage("🔧 卡弹！这才是！运气王！");
    setTimeout(ejectBullets, 1000);
  } else {
    // 空弹
    showMessage("哟，运气不错嘛！");
  }
});

// 退弹
document.getElementById("eject").addEventListener("click", ejectBullets);

function ejectBullets() {
  if (bullets.length === 0) {
    showMessage("已经没有子弹了！");
    return;
  }
  let duration = 1500; // 总时长 1.5秒
  let interval = duration / bullets.length;
  let i = 0;

  const ejectInterval = setInterval(() => {
    if (i < bullets.length) {
      chambers[bullets[i]].classList.remove("active");
      chambers[bullets[i]].classList.add("emptying");
      setTimeout(() => chambers[bullets[i]].classList.remove("emptying"), 500);
      i++;
    } else {
      clearInterval(ejectInterval);
      bullets = [];
      showMessage("子弹已全部退出！");
    }
  }, interval);
}

function showMessage(text) {
  message.innerText = text;
}
