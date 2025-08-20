const chambers = document.querySelectorAll(".chamber");
const roulette = document.getElementById("roulette");
const feedback = document.getElementById("feedback");
let bullets = 0;
let currentRotation = 0;

// 缓动函数
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// 更新弹巢状态
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

// 开火动画
function fireAnimation(targetIndex, callback) {
    let start = null;
    let duration = 1800;
    let spins = 3; // 旋转圈数

    function step(timestamp) {
        if (!start) start = timestamp;
        let elapsed = timestamp - start;
        let progress = Math.min(elapsed / duration, 1);
        let eased = easeOutCubic(progress);

        let rotation = 360 * spins * eased + (360/8)*targetIndex;
        roulette.style.transform = `rotate(${rotation}deg)`;

        // 高亮闪烁随机
        let highlightIndex = Math.floor(Math.random() * 8);
        chambers.forEach(c => c.classList.remove("flash"));
        chambers[highlightIndex].classList.add("flash");

        if (progress < 1) requestAnimationFrame(step);
        else {
            chambers.forEach(c => c.classList.remove("flash"));
            chambers[targetIndex].classList.add("flash");
            callback();
        }
    }
    requestAnimationFrame(step);
}

// 退弹动画
function ejectAnimation() {
    feedback.textContent = "退弹中...";
    setTimeout(() => { feedback.textContent = ""; }, 600);
}

// 开火逻辑
document.getElementById("shootBtn").addEventListener("click", () => {
    if (bullets === 0) { showFeedback("哟，运气不错嘛"); return; }

    let successProbability = bullets / 8;
    let jamProbability = 0.08;
    let r = Math.random();
    let resultType = "empty";
    if (r < jamProbability) resultType = "jam";
    else if (r < jamProbability + successProbability) resultType = "success";

    let resultIndex = bullets - 1;
    fireAnimation(resultIndex, () => {
        if (resultType === "success") {
            showFeedback("💥 爆炸！抱歉，你好像有点鼠了");
            bullets = 0;
            ejectAnimation();
        } else if (resultType === "jam") showFeedback("⚠️ 这才是！运气王！");
        else showFeedback("😎 哟，运气不错嘛");
        updateChambers();
    });
});

// 加子弹、All in、退弹、刷新
document.getElementById("loadBtn").addEventListener("click", () => {
    if (bullets < 8) {
        bullets++;
        updateChambers();
        if (bullets === 8) showFeedback("8/8，满满的！这是All in！");
        else showFeedback(`当前子弹：${bullets}/8`);
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
