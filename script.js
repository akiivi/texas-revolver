// 全局状态
const TOTAL = 8;
let filled = []; // 存放已填的位置索引，按顺序：0..7
let life = 8;

// DOM
const chambers = Array.from(document.querySelectorAll('.chamber'));
const messageEl = document.getElementById('message');
const bulletCountEl = document.getElementById('bulletCount') || document.getElementById('bulletCount');
const bulletCountDisplay = document.getElementById('bulletCount'); // maybe undefined if not present; we use manual update below
const heartsContainer = document.getElementById('hearts');
const flashLayer = document.getElementById('flash') || (() => {
  const f = document.createElement('div'); f.id='flash'; document.body.appendChild(f); return f;
})();
const addBtn = document.getElementById('addBtn');
const allInBtn = document.getElementById('allInBtn');
const fireBtn = document.getElementById('fireBtn');
const ejectBtn = document.getElementById('ejectBtn');
const healBtn = document.getElementById('healBtn');

// Create jumper indicator (red ring) positioned absolutely
const jumper = document.createElement('div');
jumper.className = 'jumper';
document.body.appendChild(jumper);
jumper.style.display = 'none';

// helper: show message for 1.5s (no animation for add/allin/etc.)
let messageTimer = null;
function showMessage(text, big=false, persist=false) {
  clearTimeout(messageTimer);
  messageEl.textContent = text;
  if (big) messageEl.classList.add('big'); else messageEl.classList.remove('big');
  if (!persist) {
    messageTimer = setTimeout(()=> {
      messageEl.textContent = '';
      messageEl.classList.remove('big');
    }, 1500);
  }
}

// helper: update bullet count and UI
function updateUI() {
  // fill classes
  chambers.forEach((c, idx) => {
    c.classList.remove('filled','success-flash','empty-flash','jam-flash');
    if (filled.includes(idx)) c.classList.add('filled');
  });
  // bullet count display top right
  const bc = document.querySelector('.bullet-count');
  if (bc) {
    const span = document.getElementById('bulletCount');
    if (span) span.textContent = filled.length;
    else bc.innerHTML = `子弹：${filled.length}/${TOTAL}`;
  }
  // hearts
  renderHearts();
}

// render hearts
function renderHearts(){
  heartsContainer.innerHTML = '';
  for(let i=0;i<TOTAL;i++){
    const d = document.createElement('div');
    d.className = 'heart' + (i < life ? '' : ' dead');
    heartsContainer.appendChild(d);
  }
}

// add bullet (sequential)
addBtn.addEventListener('click', () => {
  if (filled.length >= TOTAL) {
    // random tip of three
    const tips = ["开火交给运气吧","8/8，你这是All in","已经不能再添加咯"];
    const t = tips[Math.floor(Math.random()*tips.length)];
    showMessage(t);
    return;
  }
  const slot = filled.length; // next sequential
  filled.push(slot);
  // set as filled visually (white)
  chambers[slot].classList.add('filled');
  updateUI();
  showMessage(`已添加 ${filled.length}/${TOTAL}`);
});

// all in
allInBtn.addEventListener('click', () => {
  if (filled.length >= TOTAL) {
    const tips = ["开火交给运气吧","8/8，你这是All in","已经不能再添加咯"];
    showMessage(tips[Math.floor(Math.random()*tips.length)]);
    return;
  }
  for(let i=filled.length;i<TOTAL;i++){
    filled.push(i);
  }
  updateUI();
  showMessage('8/8，满满的！');
});

// eject bullets with sequential animation totalDuration = 1500ms
function ejectBulletsAnimated() {
  if (filled.length === 0) {
    showMessage('没有子弹可退');
    return Promise.resolve();
  }
  const totalDur = 1500;
  const count = filled.length;
  const interval = totalDur / count;
  return new Promise(resolve => {
    let i = 0;
    const copy = filled.slice(); // indices to clear in order
    const timer = setInterval(() => {
      if (i >= copy.length) {
        clearInterval(timer);
        filled = [];
        updateUI();
        showMessage('子弹已全部退出');
        resolve();
        return;
      }
      const idx = copy[i];
      // visual pop: use temporary class
      const el = chambers[idx];
      el.classList.remove('filled');
      el.classList.add('empty-flash');
      setTimeout(() => el.classList.remove('empty-flash'), interval*0.6);
      i++;
    }, interval);
  });
}

// eject direct (used after success/jam with delay)
ejectBtn.addEventListener('click', () => {
  ejectBulletsAnimated();
});

// heal life
healBtn.addEventListener('click', () => {
  life = TOTAL;
  renderHearts();
  showMessage('生命值已恢复');
});

// helper: show full-screen flash color briefly (duration ~1s)
function flashColor(kind, duration=1000) {
  flashLayer.className = 'flash';
  if (kind === 'red') flashLayer.classList.add('red');
  if (kind === 'green') flashLayer.classList.add('green');
  if (kind === 'yellow') flashLayer.classList.add('yellow');
  // show
  flashLayer.style.opacity = '1';
  setTimeout(() => {
    flashLayer.style.opacity = '0';
    flashLayer.className = 'flash'; // remove color classes
  }, duration);
}

// main: fire logic with jumper random hopping for 2000ms then land per result
fireBtn.addEventListener('click', async () => {
  if (filled.length === 0) {
    showMessage('没有子弹，请先装填！');
    return;
  }

  // compute probabilities: first success, then jam
  const successProb = filled.length / TOTAL;
  const r1 = Math.random();
  let resultType = 'empty';
  if (r1 < successProb) {
    resultType = 'success';
  } else {
    const r2 = Math.random();
    if (r2 < 0.08) resultType = 'jam';
    else resultType = 'empty';
  }

  // Decide finalIndex based on resultType
  let finalIndex;
  if (resultType === 'success') {
    // pick a random filled slot
    const candidates = filled.slice();
    finalIndex = candidates[Math.floor(Math.random()*candidates.length)];
  } else if (resultType === 'empty') {
    // choose an empty index; fallback to random if none
    const empties = [];
    for (let i=0;i<TOTAL;i++) if (!filled.includes(i)) empties.push(i);
    finalIndex = empties.length ? empties[Math.floor(Math.random()*empties.length)] : Math.floor(Math.random()*TOTAL);
  } else { // jam
    finalIndex = Math.floor(Math.random()*TOTAL);
  }

  // show jumper and perform random hopping for ~2000ms
  jumper.style.display = 'block';
  const rects = chambers.map(el => el.getBoundingClientRect());
  // compute centers relative to document
  const centers = rects.map(r => ({x: r.left + r.width/2, y: r.top + r.height/2}));
  // place jumper initially off-screen at first center
  let hopTime = 2000; // total ms
  let start = performance.now();
  let lastIdx = -1;

  function hopStep(now) {
    const elapsed = now - start;
    if (elapsed >= hopTime) {
      // land on finalIndex
      const c = centers[finalIndex];
      jumper.style.left = c.x + 'px';
      jumper.style.top = c.y + 'px';
      // apply final highlight visually (do not remove filled state yet)
      highlightFinal(finalIndex, resultType);
      // show page flash and message
      if (resultType === 'success') {
        showMessage('爆炸 💥 抱歉，你好像有点鼠了', true);
        flashColor('red', 1200);
        // decrement life
        life = Math.max(0, life - 1);
        renderHearts();
        // after showing message for 1s delay, start eject animation (1s delay then eject)
        setTimeout(() => {
          ejectBulletsAnimated();
        }, 1000);
      } else if (resultType === 'jam') {
        showMessage('卡弹！这才是！运气王！', true);
        flashColor('yellow', 1200);
        // jam also triggers eject after 1s
        setTimeout(() => {
          ejectBulletsAnimated();
        }, 1000);
      } else {
        showMessage('空弹 哟，运气不错嘛', true);
        flashColor('green', 1200);
        // no auto-eject on empty
      }
      // hide jumper after short delay to leave final highlight visible
      setTimeout(()=> { jumper.style.display='none'; }, 700);
      // message will auto-hide after 1.5s by showMessage default
      return;
    } else {
      // choose a random index different from last
      let idx;
      do { idx = Math.floor(Math.random()*TOTAL); } while (idx === lastIdx && TOTAL>1);
      lastIdx = idx;
      const c = centers[idx];
      jumper.style.left = c.x + 'px';
      jumper.style.top = c.y + 'px';
      // small visual pulse on that chamber
      chambers.forEach(ch => ch.classList.remove('highlight'));
      chambers[idx].classList.add('highlight');
      // schedule next hop
      requestAnimationFrame(hopStep);
    }
  }
  requestAnimationFrame(hopStep);
});

// helper to apply final highlight on chamber based on result
function highlightFinal(idx, resultType) {
  // clear previous highlights
  chambers.forEach(c => c.classList.remove('highlight','success-flash','empty-flash','jam-flash'));
  const el = chambers[idx];
  if (resultType === 'success') {
    el.classList.add('success-flash');
  } else if (resultType === 'empty') {
    el.classList.add('empty-flash');
  } else {
    el.classList.add('jam-flash');
  }
}

// initial UI
updateUI();
renderHearts();
