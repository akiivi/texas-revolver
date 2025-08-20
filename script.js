
let bullets = 0;
let chambers = 8;
let current = 0;

function addBullet(){
  if(bullets < chambers){
    bullets++;
    document.getElementById("message").innerText = `已装入 ${bullets} 发子弹`;
  } else {
    document.getElementById("message").innerText = `弹巢已满`;
  }
}

function removeBullets(){
  bullets = 0;
  document.getElementById("message").innerText = `子弹已清空`;
}

function shoot(){
  if(bullets <= 0){
    document.getElementById("message").innerText = `没有子弹！`;
    return;
  }
  let shot = Math.random() < bullets/chambers;
  if(shot){
    document.getElementById("message").innerText = `爆炸！💥`;
    bullets--;
  } else {
    document.getElementById("message").innerText = `安全...😅`;
    bullets--;
  }
}

function allIn(){
  while(bullets>0){
    shoot();
  }
}

function restart(){
  bullets = 0;
  current = 0;
  document.getElementById("message").innerText = `游戏已重置`;
}
