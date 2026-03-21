/* ── PARTICLES ── */
(function () {
  const wrap = document.getElementById('particles');
  const cols = ['#ffb3d9', '#ff69b4', '#ffd700', '#ff1493', '#ffcce0', '#fff3b0'];
  const em   = ['🌸', '✨', '⭐', '🌙', '🌺', '💫', '🌟'];

  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const s = 6 + Math.random() * 12;
    el.style.cssText = `
      width:${s}px; height:${s}px;
      left:${Math.random() * 100}%;
      background:${cols[Math.floor(Math.random() * cols.length)]};
      border-radius:${Math.random() > .5 ? '50%' : '4px'};
      animation-duration:${6 + Math.random() * 10}s;
      animation-delay:${Math.random() * 8}s;
    `;
    wrap.appendChild(el);
  }

  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = em[Math.floor(Math.random() * em.length)];
    el.style.cssText = `
      background:none;
      left:${Math.random() * 100}%;
      font-size:${1 + Math.random() * 1.1}rem;
      animation-duration:${8 + Math.random() * 12}s;
      animation-delay:${Math.random() * 6}s;
    `;
    wrap.appendChild(el);
  }
})();

/* ── SCREEN SWITCHER ── */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ── SVG ENVELOPE ── */
const SVG_NS = 'http://www.w3.org/2000/svg';

function buildEnvelope() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Reserve space for header + hint + padding
  const reserved = 194;
  const availH = vh - reserved;
  const availW = vw - 32;

  // 10:7 aspect ratio
  const ratio = 10 / 7;
  let W = Math.min(availW, 320);
  let H = W / ratio;
  if (H > availH) { H = availH; W = H * ratio; }
  W = Math.floor(W);
  H = Math.floor(H);

  const wrap = document.getElementById('envSvgWrap');
  wrap.style.width  = W + 'px';
  wrap.style.height = H + 'px';

  const svg = document.getElementById('envSvg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  svg.innerHTML = '';

  const cx = W / 2;

  // Defs
  const defs = document.createElementNS(SVG_NS, 'defs');

  const gBody = document.createElementNS(SVG_NS, 'linearGradient');
  gBody.setAttribute('id', 'gBody');
  gBody.setAttribute('x1', '0%'); gBody.setAttribute('y1', '0%');
  gBody.setAttribute('x2', '100%'); gBody.setAttribute('y2', '100%');
  [['0%', '#c2005a'], ['50%', '#e0005c'], ['100%', '#b5003a']].forEach(([off, col]) => {
    const s = document.createElementNS(SVG_NS, 'stop');
    s.setAttribute('offset', off); s.setAttribute('stop-color', col);
    gBody.appendChild(s);
  });

  const gFlap = document.createElementNS(SVG_NS, 'linearGradient');
  gFlap.setAttribute('id', 'gFlap');
  gFlap.setAttribute('x1', '0%'); gFlap.setAttribute('y1', '0%');
  gFlap.setAttribute('x2', '0%'); gFlap.setAttribute('y2', '100%');
  [['0%', '#d4004e'], ['100%', '#a8003c']].forEach(([off, col]) => {
    const s = document.createElementNS(SVG_NS, 'stop');
    s.setAttribute('offset', off); s.setAttribute('stop-color', col);
    gFlap.appendChild(s);
  });

  const gSeal = document.createElementNS(SVG_NS, 'radialGradient');
  gSeal.setAttribute('id', 'gSeal');
  [['0%', '#fff3b0'], ['60%', '#ffd700'], ['100%', '#b8860b']].forEach(([off, col]) => {
    const s = document.createElementNS(SVG_NS, 'stop');
    s.setAttribute('offset', off); s.setAttribute('stop-color', col);
    gSeal.appendChild(s);
  });

  defs.appendChild(gBody);
  defs.appendChild(gFlap);
  defs.appendChild(gSeal);
  svg.appendChild(defs);

  // 1. Body
  const body = document.createElementNS(SVG_NS, 'rect');
  body.setAttribute('x', 0); body.setAttribute('y', 0);
  body.setAttribute('width', W); body.setAttribute('height', H);
  body.setAttribute('rx', 8); body.setAttribute('fill', 'url(#gBody)');
  svg.appendChild(body);

  // 2. Side creases
  const triL = document.createElementNS(SVG_NS, 'polygon');
  triL.setAttribute('points', `0,${H} ${cx},${H * 0.58} 0,${H * 0.42}`);
  triL.setAttribute('fill', 'rgba(130,0,45,0.55)');
  svg.appendChild(triL);

  const triR = document.createElementNS(SVG_NS, 'polygon');
  triR.setAttribute('points', `${W},${H} ${cx},${H * 0.58} ${W},${H * 0.42}`);
  triR.setAttribute('fill', 'rgba(100,0,35,0.5)');
  svg.appendChild(triR);

  // 3. Bottom triangle
  const triBot = document.createElementNS(SVG_NS, 'polygon');
  triBot.setAttribute('points', `0,${H} ${W},${H} ${cx},${H * 0.58}`);
  triBot.setAttribute('fill', 'rgba(110,0,38,0.65)');
  svg.appendChild(triBot);

  // 4. Top flap
  const flapG = document.createElementNS(SVG_NS, 'g');
  flapG.setAttribute('id', 'envFlap');
  flapG.style.transformOrigin = `${cx}px 0px`;

  const flapTri = document.createElementNS(SVG_NS, 'polygon');
  flapTri.setAttribute('points', `0,0 ${W},0 ${cx},${H * 0.54}`);
  flapTri.setAttribute('fill', 'url(#gFlap)');
  flapTri.setAttribute('filter', 'drop-shadow(0 6px 8px rgba(0,0,0,.22))');
  flapG.appendChild(flapTri);
  svg.appendChild(flapG);

  // 5. Seal
  const sr = Math.min(W, H) * 0.1;

  const seal = document.createElementNS(SVG_NS, 'circle');
  seal.setAttribute('id', 'envSeal');
  seal.setAttribute('cx', cx); seal.setAttribute('cy', H * 0.54);
  seal.setAttribute('r', sr);
  seal.setAttribute('fill', 'url(#gSeal)');
  seal.setAttribute('stroke', 'rgba(255,215,0,.5)');
  seal.setAttribute('stroke-width', '2');
  seal.style.transition = 'opacity .3s ease';
  svg.appendChild(seal);

  const sealTxt = document.createElementNS(SVG_NS, 'text');
  sealTxt.setAttribute('id', 'envSealTxt');
  sealTxt.setAttribute('x', cx);
  sealTxt.setAttribute('y', H * 0.54 + sr * 0.38);
  sealTxt.setAttribute('text-anchor', 'middle');
  sealTxt.setAttribute('font-size', sr * 1.1);
  sealTxt.textContent = '🌙';
  sealTxt.style.transition = 'opacity .3s ease';
  svg.appendChild(sealTxt);
}

buildEnvelope();
window.addEventListener('resize', buildEnvelope);

/* ── OPEN ENVELOPE ── */
let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;

  const flap = document.getElementById('envFlap');
  flap.style.transition = 'transform .85s cubic-bezier(.4,0,.2,1)';
  flap.style.transform  = 'rotateX(-175deg)';

  ['envSeal', 'envSealTxt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.opacity = '0';
  });

  document.getElementById('envWrap').classList.add('opening');
  setTimeout(() => goTo('s2'), 1700);
}

/* ── SHOW SPIN SCREEN ── */
function showSpin() {
  goTo('s3');
  requestAnimationFrame(() => { sizeWheel(); drawWheel(0); });
}

/* ── WHEEL ── */
const SEGS = [
  { label: 'Rs. 1000', value: 1000, color: '#e0007a', tc: '#fff',    emoji: '🤑' },
  { label: 'Rs. 500',  value: 500,  color: '#9b0030', tc: '#ffd700', emoji: '💸' },
  { label: 'Rs. 10',   value: 10,   color: '#ff4499', tc: '#fff',    emoji: '😅' },
  { label: 'Rs. 0',    value: 0,    color: '#ff85c1', tc: '#800040', emoji: '😂' },
];

const N   = SEGS.length;
const ARC = (2 * Math.PI) / N;

function sizeWheel() {
  const ww  = document.getElementById('wheelWrap');
  const sz  = Math.floor(Math.min(ww.clientWidth || 220, window.innerHeight * 0.32, 240));
  const c   = document.getElementById('wheel');
  c.width   = sz;
  c.height  = sz;
  ww.style.width  = sz + 'px';
  ww.style.height = sz + 'px';
}

function drawWheel(rot) {
  const c = document.getElementById('wheel');
  if (!c.width) return;

  const sz  = c.width;
  const ctx = c.getContext('2d');
  const cx  = sz / 2, cy = sz / 2, r = sz / 2 - 4;

  ctx.clearRect(0, 0, sz, sz);

  for (let i = 0; i < N; i++) {
    const s   = rot + i * ARC;
    const e   = s + ARC;
    const seg = SEGS[i];

    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, s, e); ctx.closePath();
    ctx.fillStyle = seg.color; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx, cy, r, s, e);
    ctx.strokeStyle = 'rgba(255,215,0,.45)'; ctx.lineWidth = 3; ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(s + ARC / 2);
    ctx.textAlign  = 'right';
    ctx.fillStyle  = seg.tc;
    ctx.font       = `bold ${sz * .078}px 'Playfair Display', serif`;
    ctx.fillText(seg.label, r - 8, 4);
    ctx.font = `${sz * .095}px serif`;
    ctx.fillText(seg.emoji, r - 8, -sz * .05);
    ctx.restore();
  }

  // Center knob
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
  g.addColorStop(0, '#fff3b0'); g.addColorStop(1, '#ffd700');
  ctx.fillStyle   = g; ctx.fill();
  ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle   = '#5a0000';
  ctx.font        = `bold ${sz * .058}px serif`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('☪️', cx, cy);
}

function pickSeg() {
  const w = [.0, .100, .0, .0];
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < w.length; i++) {
    sum += w[i];
    if (r < sum) return i;
  }
  return N - 1;
}

let spun = false, curAngle = 0;

function spinWheel() {
  if (spun) return;
  spun = true;
  
  const btn = document.getElementById('spinBtn');
  btn.disabled    = true;
  btn.textContent = '🌀 Spinning...';
  document.getElementById('attemptNote').textContent = '🎯 No more spins — this is your destiny!';

  const wi     = pickSeg();
  const target = -Math.PI / 2 - (wi * ARC + ARC / 2) + 5 * 2 * Math.PI;
  const init   = curAngle;
  const dur    = 4600;
  let t0       = null;

  function ease(t) {
    return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function frame(ts) {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / dur, 1);
    curAngle = init + (target - init) * ease(p);
    drawWheel(curAngle);
    p < 1 ? requestAnimationFrame(frame) : setTimeout(() => showResult(SEGS[wi]), 420);
  }

  requestAnimationFrame(frame);
}

/* ── RESULT ── */
const WA_NUMBER = '923103392998';

function setWaLink(amount) {
  const msg = encodeURIComponent(
    `Assalam o Alaikum! 🌙 Eid Mubarak!\n\nMaine aapka Eidi Wheel spin kiya aur mujhe *${amount}* mili! 🎉\n\nKripya meri Eidi claim kar dein! 🎁`
  );
  document.getElementById('waBtn').href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function showResult(seg) {
  const wa = document.getElementById('waBox');
  wa.style.display = '';

  document.getElementById('resEmoji').textContent  = seg.emoji;
  document.getElementById('resAmount').textContent = seg.value === 0 ? 'Rs. 0' : seg.label;

  if (seg.value === 1000) {
    document.getElementById('resLabel').textContent = 'JACKPOT! Mubarak ho! 🎉🎊';
    document.getElementById('resMsg').textContent   = 'Wow! Rs. 1000 ki Eidi! Allah ne itni barkat di! 🌹';
    document.getElementById('waMsg').textContent    = 'Apni Rs. 1000 Eidi claim karo! 🎁';
    setWaLink('Rs. 1000');
    confetti(65);
  } else if (seg.value === 500) {
    document.getElementById('resLabel').textContent = 'Masha Allah! 🌸';
    document.getElementById('resMsg').textContent   = 'Rs. 500 ki Eidi! Khoob kharch karo iss Eid par! 😄';
    document.getElementById('waMsg').textContent    = 'Apni Rs. 500 Eidi claim karo! 🎁';
    setWaLink('Rs. 500');
    confetti(35);
  } else if (seg.value === 10) {
    document.getElementById('resLabel').textContent = 'Chhoti Eidi! 😅';
    document.getElementById('resMsg').textContent   = 'Rs. 10 mili! Chai bhi nahi aayegi 😂 Eid mubarak phir bhi! ☪️';
    document.getElementById('waMsg').textContent    = 'Apni Rs. 10 Eidi claim karo! 😄';
    setWaLink('Rs. 10');
  } else {
    document.getElementById('resLabel').textContent = 'Better luck next time! 😂';
    document.getElementById('resMsg').innerHTML     = 'Afsos! Eidi nahi mili par dua zaroor hai! 🤲<br><span class="zero-msg">Pyaar hi asli Eidi hai! 💕</span>';
    wa.style.display = 'none';
  }

  document.getElementById('result-overlay').classList.add('show');
}

/* ── CONFETTI ── */
function confetti(n = 60) {
  const cols = ['#ff69b4', '#ffd700', '#ff1493', '#fff3b0', '#e0007a', '#25D366', '#ff85c1'];
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'cp';
      el.style.cssText = `
        left:${Math.random() * 100}%;
        background:${cols[Math.floor(Math.random() * cols.length)]};
        width:${6 + Math.random() * 10}px;
        height:${6 + Math.random() * 10}px;
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
        animation-duration:${2 + Math.random() * 3}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5500);
    }, i * 28);
  }
}
