const chambers = document.querySelectorAll(".chamber");
const roulette = document.getElementById("roulette");
const feedback = document.getElementById("feedback");
let bullets = 0;

// 缓动函数
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// 更新弹巢显示
function updateChambers() {
    chambers.forEach((c, i) => {
        c.classList.toggle("active", i < bullets);
        c.classList.remove("flash");
    });
}

// 提示显示
function showFeedback(msg) {
    feedback.textContent = msg;
    feedback.style.fontSize = "36px";
}

// 轮盘闪烁动画
function flashChambers(times, callback) {
    let count = 0;
    let interval = setInterval(() => {
        let idx = Math.floor(Math.random() * 8);
        chambers.forEach(c => c.classList.remove("flash"));
        chambers[idx].classList.add("flash");
        count++;
        if (count >= times) {
            clearInterval(interval);
            callback();
        }
    }, 150);
}

// 开火动画 + 概率停靠
function fireBullet() {
    if (bullets === 0) { showFeedback("😎 哟，运气不错嘛"); return; }

    let successProb = bullets / 8;
    let jamProb = 0.08;

    // 先随机闪烁 1~2 次
    flashChambers(2, () => {
        let r = Math.random();
        let resultType = "empty";
        if (r < jamProb) resultType = "jam";
        else if (r < jamProb + successProb) resultType = "success";

        // 根据结果计算停靠弹巢
        let targetIndex;
        if (resultType === "success") targetIndex = bullets - 1;
        else targetIndex = Math.floor(Math.random() * 8);

        let duration = 1800; // 动画时长
        let spins = 3; // 旋转圈数
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            let elapsed = timestamp - start;
            let progress = Math.min(elapsed / duration, 1);
            let eased = easeOutCubic(progress);
            let rotation = 360 * spins * eased + (360 / 8) * targetIndex;
            roulette.style.transform = `rotate(${rotation}deg)`;

            // 中途随机闪烁
            if (progress < 1) {
                let flashIdx = Math.floor(Math.random() * 8);
                chambers.forEach(c => c.classList.remove("flash"));
                chambers[flashIdx].classList.add("flash");
                requestAnimationFrame(step);
            } else {
                chambers.forEach(c => c.classList.remove("flash"));
                chambers[targetIndex].classList.add("flash");

                // 提示与动画
                if (resultType === "success") {
                    showFeedback("💥 爆炸！抱歉，你好像有点鼠了");
                    bullets = 0;
                    ejectAnimation();
                } else if (resultType === "jam") showFeedback("⚠️ 这才是！运气王！");
                else showFeedback("😎 哟，运气不错嘛");

                updateChambers();
            }
        }
        requestAnimationFrame(step);
    });
}

// 退弹动画
function ejectAnimation() {
    feedback.textContent = "退弹中...";
    setTimeout(() => { feedback.textContent = ""; }, 600);
}

// 按钮事件
document.getElementById("shootBtn").addEventListener("click", fireBullet);

document.getElementById("loadBtn").addEventListener("click", () => {
    if (bullets < 8) {
        bullets++;
        updateChambers();
        showFeedback(`当前子弹：${bullets}/8`);
        if (bullets === 8) showFeedback("8/8，满满的！这是All in！");
    } else showFeedback("子弹已加满，你这是All in！");
});

document.getElementById("allInBtn").addEventListener("click", () => {
    bullets = 8;
    updateChambers();
    showFeedback("8/8，满满的！");
});

document.getElementById("reloadBtn").addEventListener("click", () => {
    if (bullets > 0) {
        bullets = 0;
        updateChambers();
        ejectAnimation();
    } else showFeedback("弹巢已空，无需退弹");
});

document.getElementById("resetBtn").addEventListener("click", () => {
    bullets = 0;
    updateChambers();
    showFeedback("已刷新");
});
