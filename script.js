const chambers = document.querySelectorAll(".chamber");
const feedback = document.getElementById("feedback");
let bulletPos = 0; // 当前子弹位置

// 加子弹
document.getElementById("loadBtn").addEventListener("click", () => {
    bulletPos = 0; // 每次加子弹从0开始
    chambers.forEach((c, i) => c.classList.toggle("active", i === 0));
    feedback.style.fontSize = "36px";
    feedback.textContent = "子弹已上膛";
});

// 开火
document.getElementById("shootBtn").addEventListener("click", () => {
    shoot();
});

// All in
document.getElementById("allInBtn").addEventListener("click", () => {
    for (let i = 0; i < 8; i++) shoot();
});

// 退弹
document.getElementById("reloadBtn").addEventListener("click", () => {
    chambers.forEach(c => c.classList.remove("active"));
    bulletPos = 0;
    feedback.style.fontSize = "36px";
    feedback.textContent = "弹巢已清空";
});

// 刷新
document.getElementById("resetBtn").addEventListener("click", () => {
    chambers.forEach(c => c.classList.remove("active"));
    bulletPos = 0;
    feedback.style.fontSize = "36px";
    feedback.textContent = "已刷新";
});

// 开火逻辑
function shoot() {
    // 卡弹 8% 概率
    if (Math.random() < 0.08) {
        feedback.style.fontSize = "40px";
        feedback.textContent = "卡弹！";
        bulletPos = 0; // 自动退弹
        chambers.forEach(c => c.classList.remove("active"));
        return;
    }

    chambers.forEach(c => c.classList.remove("active"));
    chambers[bulletPos].classList.add("active");

    // 模拟开火
    feedback.style.fontSize = "40px";
    feedback.textContent = "爆炸！";

    bulletPos = (bulletPos + 1) % 8; // 自动循环
}
