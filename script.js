const chambers = document.querySelectorAll(".chamber");
const feedback = document.getElementById("feedback");
let bullets = 0; // 当前子弹数量

// 更新弹巢显示
function updateChambers() {
    chambers.forEach((c, i) => {
        c.classList.toggle("active", i < bullets);
    });
}

// 显示提示信息并闪烁
function showFeedback(msg) {
    feedback.textContent = msg;
    feedback.style.fontSize = "36px";
    feedback.classList.add("blink");
    setTimeout(() => feedback.classList.remove("blink"), 1000);
}

// 加子弹按钮
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

// 开火按钮
document.getElementById("shootBtn").addEventListener("click", () => {
    if (bullets === 0) {
        showFeedback("哟，运气不错嘛");
        return;
    }
    // 新一局，退掉所有子弹
    bullets = 0;
    updateChambers();

    // 8%概率卡弹
    if (Math.random() < 0.08) {
        showFeedback("这才是！运气王！");
        return;
    }

    // 成功开火
    showFeedback("抱歉，你好像有点鼠了");
});

// All in按钮
document.getElementById("allInBtn").addEventListener("click", () => {
    bullets = 8;
    updateChambers();
    showFeedback("8/8，满满的！");
});

// 退弹按钮
document.getElementById("reloadBtn").addEventListener("click", () => {
    bullets = 0;
    updateChambers();
    showFeedback("弹巢已清空");
});

// 刷新按钮
document.getElementById("resetBtn").addEventListener("click", () => {
    bullets = 0;
    updateChambers();
    showFeedback("已刷新");
});
