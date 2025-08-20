const chambers = document.querySelectorAll(".chamber");
const feedback = document.getElementById("feedback");
let bullets = 0; // 当前子弹数量

function updateChambers() {
    chambers.forEach((c, i) => {
        c.classList.toggle("active", i < bullets);
        c.classList.remove("flash");
    });
}

function showFeedback(msg) {
    feedback.textContent = msg;
    feedback.style.fontSize = "36px";
    feedback.classList.add("blink");
    setTimeout(() => feedback.classList.remove("blink"), 1000);
}

// 加子弹
document.getElementById("loadBtn").addEventListener("click", () => {
    if (bullets < 8) {
        bullets++;
        updateChambers();
        if (bullets === 8) {
            showFeedback(`8/8，满满的！这是All in！`);
        } else {
            showFeedback(`当前子弹：${bullets}/8`);
        }
    } else {
        showFeedback(`子弹已加满，你这是All in！`);
    }
});

// 开火（带减速停转效果）
document.getElementById("shootBtn").addEventListener("click", () => {
    if (bullets === 0) {
        showFeedback("哟，运气不错嘛");
        return;
    }

    let successProbability = bullets / 8;
    let cardProbability = 0.08;

    // 最终结果随机索引
    let finalIndex = Math.floor(Math.random() * 8);
    
    // 随机决定结果类型
    let r = Math.random();
    let resultType = "empty"; // 默认空弹
    if (r < cardProbability) resultType = "jam";       // 卡弹
    else if (r < cardProbability + successProbability) resultType = "success"; // 成功

    // 闪烁减速模拟转轮
    let totalFlashes = 20 + Math.floor(Math.random() * 10); // 闪烁次数
    let flashIndex = 0;
    let intervalTime = 50;

    function flashStep() {
        chambers.forEach(c => c.classList.remove("flash"));
        chambers[flashIndex].classList.add("flash");

        // 渐渐减速
        intervalTime += 15;
        flashIndex = (flashIndex + 1) % 8;
        totalFlashes--;

        if (totalFlashes > 0) {
            setTimeout(flashStep, intervalTime);
        } else {
            // 最终停转
            chambers.forEach(c => c.classList.remove("flash"));
            updateChambers();

            if (resultType === "success") {
                chambers[bullets - 1].classList.add("active");
                showFeedback("抱歉，你好像有点鼠了");
            } else if (resultType === "jam") {
                showFeedback("这才是！运气王！");
            } else {
                showFeedback("哟，运气不错嘛");
            }

            bullets = 0; // 开火后清空子弹
        }
    }

    flashStep();
});

// All in
document.getElementById("allInBtn").addEventListener("click", () => {
    bullets = 8;
    updateChambers();
    showFeedback("8/8，满满的！");
});

// 退弹
document.getElementById("reloadBtn").addEventListener("click", () => {
    bullets = 0;
    updateChambers();
    showFeedback("弹巢已清空");
});

// 刷新
document.getElementById("resetBtn").addEventListener("click", () => {
    bullets = 0;
    updateChambers();
    showFeedback("已刷新");
});
