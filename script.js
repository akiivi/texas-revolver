const chambers = document.querySelectorAll(".chamber");
const shootSound = document.getElementById("shootSound");
const reloadSound = document.getElementById("reloadSound");
const jamSound = document.getElementById("jamSound");

let bullets = 0;
const maxBullets = 8;

// 设置弹巢位置（8个均匀排列）
function positionChambers() {
    const radius = 120;
    chambers.forEach((chamber, i) => {
        const angle = (360 / maxBullets) * i;
        chamber.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`;
    });
}
positionChambers();

// 添加单颗子弹
document.getElementById("addBullet").addEventListener("click", () => {
    if (bullets < maxBullets) {
        chambers[bullets].classList.add("active");
        bullets++;
        alert(`子弹数：${bullets}`);
    } else {
        alert("弹巢已满！");
    }
});

// All in
document.getElementById("allIn").addEventListener("click", () => {
    bullets = maxBullets;
    chambers.forEach(ch => ch.classList.add("active"));
    alert("已全部填满8颗子弹！");
});

// 开火
document.getElementById("fire").addEventListener("click", () => {
    if (bullets === 0) {
        alert("没有子弹！");
        return;
    }

    // 8%概率卡弹
    if (Math.random() < 0.08) {
        jamSound.play();
        alert("卡弹！请刷新！");
        return;
    }

    // 开火逻辑
    bullets--;
    shootSound.play();
    chambers[bullets].classList.remove("active");

    spinChambers();

    alert(`开火成功！剩余子弹：${bullets}`);

    // 自动退弹
    if (bullets === 0) {
        setTimeout(() => {
            chambers.forEach(ch => ch.classList.remove("active"));
            reloadSound.play();
            bullets = 0;
            alert("已退弹，重新开始下一轮！");
        }, 500);
    }
});

// 刷新
document.getElementById("reset").addEventListener("click", () => {
    bullets = 0;
    chambers.forEach(ch => ch.classList.remove("active"));
    reloadSound.play();
    alert("已刷新，子弹数重置为0");
});

// 旋转动画
function spinChambers() {
    chambers.forEach(chamber => {
        chamber.style.transition = "transform 0.5s ease";
        const currentTransform = chamber.style.transform;
        chamber.style.transform = currentTransform + " rotate(360deg)";
        setTimeout(() => {
            chamber.style.transform = currentTransform;
        }, 500);
    });
}
