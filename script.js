// 获取元素
const ammoRow1 = document.getElementById("ammo-row1");
const ammoRow2 = document.getElementById("ammo-row2");
const message = document.getElementById("message");
const bulletCountText = document.getElementById("bullet-count");
const lifeContainer = document.getElementById("life");

let bullets = 0;
const maxBullets = 8;
let lives = 8;

// 初始化子弹槽
function initAmmo() {
  ammoRow1.innerHTML = "";
  ammoRow2.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    ammoRow1.innerHTML += `<div class="ammo-slot" id="slot${i}"></div>`;
    ammoRow2.innerHTML += `<div class="ammo-slot" id="slot${i+4}"></div>`;
  }
}
initAmmo();

// 初始化生命值
function renderLife() {
  lifeContainer.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    if (i < lives) {
      lifeContainer.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="red heart">`;
    } else {
      lifeContainer.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/833/833379.png" alt="gray heart">`;
    }
  }
}
renderLife();

// 更新子弹槽显示
function updateAmmo() {
  for (let i = 0; i < 8; i++) {
    const slot = document.getElementById(`slot${i}`);
    if (i < bullets) slot.classList.add("active");
    else slot.classList.remove("active");
  }
  bulletCountText.textContent = `当前子弹：${bullets}/8`;
}

// 提示信息
function showMessage(text, color="white") {
  message.style.color = color;
  message.textContent = text;
  setTimeout(() => { message.textContent = ""; }, 1500);
}

// 小彩蛋恢复生命
function tryRestoreLife() {
  if (Math.random() < 0.01 && lives < 8) {
    lives++;
    renderLife();
    showMessage("恭喜触发小彩蛋，恢复一点生命值", "lightgreen");
  }
}

// 退弹动画
function ejectAnimation() {
  let current = bullets;
  if (current === 0) return;
  const step = 1500 / current;
  for (let i = 0; i < current; i++) {
    setTimeout(() => {
      bullets--;
      updateAmmo();
    }, i * step);
  }
}

// 添加子弹
document.getElementById("addBullet").onclick = () => {
  tryRestoreLife();
  if (bullets < maxBullets) {
    bullets++;
    updateAmmo();
    showMessage(`子弹+1，当前：${bullets}/8`, "lightblue");
  } else {
    const tips = ["开火交给运气吧", "8/8，你这是All in", "已经不能再添加咯"];
    showMessage(tips[Math.floor(Math.random() * tips.length)], "orange");
  }
};

// All In
document.getElementById("allIn").onclick = () => {
  tryRestoreLife();
  bullets = maxBullets;
  updateAmmo();
  showMessage("8/8，满满的！", "orange");
};

// 开火逻辑
document.getElementById("fire").onclick = () => {
  tryRestoreLife();
  if (bullets === 0) {
    showMessage("没有子弹！", "gray");
    return;
  }

  const slots = Array.from({length: 8}, (_, i) => document.getElementById(`slot${i}`));
  
  // 开火闪烁动画 1.5秒随机跳跃
  const flashTimes = 6; // 6次高亮闪烁
  let flashCount = 0;
  const flashInterval = setInterval(() => {
    slots.forEach(s => s.classList.remove("highlight"));
    const idx = Math.floor(Math.random() * 8);
    slots[idx].classList.add("highlight");
    flashCount++;
    if (flashCount >= flashTimes) clearInterval(flashInterval);
  }, 250);

  // 延迟 1.5秒后决定结果
  setTimeout(() => {
    slots.forEach(s => s.classList.remove("highlight"));
    let hitChance = bullets / 8;
    let roll = Math.random();

    if (roll < hitChance) {
      // 成功开火
      lives--;
      renderLife();
      showMessage("💥 爆炸！抱歉，你好像有点鼠了", "red");
      setTimeout(ejectAnimation, 1000);
    } else if (Math.random() < 0.08) {
      // 卡弹
      showMessage("🔧 卡弹！这才是！运气王！", "yellow");
      setTimeout(() => { bullets = 0; updateAmmo(); }, 1000);
    } else {
      // 空枪
      showMessage("😎 哟，运气不错嘛", "lightgreen");
    }

    if (lives <= 0) {
      showMessage("生命值清零！游戏结束", "red");
    }
  }, 1500);
};

// 退弹按钮
document.getElementById("eject").onclick = () => {
  tryRestoreLife();
  if (bullets > 0) {
    ejectAnimation();
    showMessage("退弹完成", "lightblue");
  } else {
    showMessage("没有子弹可退", "gray");
  }
};

// 恢复生命值
document.getElementById("restoreLife").onclick = () => {
  lives = 8;
  renderLife();
  showMessage("生命值已恢复满", "lightgreen");
};
