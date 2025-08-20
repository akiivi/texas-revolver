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

// 开火
document.getElementById("shootBtn").addEventListener("click", () => {
    if (bullets === 0) {
        showFeedback("哟，运气不错嘛");
        return;
    }

    // 计算开火概率
    let successProbability = bullets / 8;
    let cardProbability = 0.08;

    // 保存当前子弹索引，退弹为0
    let finalIndex = Math.floor(Math.random() * 8); 

    // 随机闪烁 1~2 秒
    let flashCount = Math.floor(Math.random() * 2) + 2; 
    let flashIndex = 0;
    const flashInterval = setInterval(() => {
        chambers.forEach(c => c.classList.remove("flash"));
        chambers[flashIndex].classList.add("flash");
        flashIndex = (flashIndex + 1) % 8;
        flashCount--;
        if (flashCount <= 0) {
            clearInterval(flashInterval);

            // 判断开火结果
            let r = Math.random();
            if (r < cardProbability) {
                // 卡弹
                updateChambers(); // 全部退弹
                showFeedback("这才是！运气王！");
            } else if (r < cardProbability + successProbability) {
                // 成功开火
                updateChambers(); 
                chambers[bullets - 1].classList.add("active"); // 停留红色
                showFeedback("抱歉，你好像有点鼠了");
            } else {
                // 空弹
                updateChambers(); // 全部退弹
                showFeedback("哟，运气不错嘛");
            }
        }
    }, 250);

    bullets = 0; // 开火后清空子弹
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
