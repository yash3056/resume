// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

// ── Animated counters ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1100;
  const start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
// Fire counters immediately — hero is always visible on load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hstat-num').forEach(animateCounter);
});

// ── Abstract toggles ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.abstract-toggle').forEach(btn => {
    const bodyId = btn.id.replace('abs-btn-', 'abs-body-');
    const body = document.getElementById(bodyId);
    btn.addEventListener('click', () => {
      const isOpen = body.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
});

// ── Cite copy ──
window.copyCite = function (paperId) {
  const box = document.getElementById('cite-' + paperId);
  const msg = document.getElementById('cite-' + paperId + '-msg');
  box.classList.toggle('open');
  if (box.classList.contains('open')) {
    const text = box.querySelector('pre').textContent;
    navigator.clipboard.writeText(text).then(() => {
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 2000);
    }).catch(() => {});
  }
};

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── Particle canvas ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  const COLORS = ['168,85,247', '59,130,246', '236,72,153', '34,197,94'];

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

  function init() {
    pts = [];
    const n = Math.min(60, Math.floor(W * H / 20000));
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.4,
        dx: (Math.random() - .5) * .25, dy: (Math.random() - .5) * .25,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: Math.random() * .35 + .08,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
      p.x = (p.x + p.dx + W) % W;
      p.y = (p.y + p.dy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${p.a})`;
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(148,163,184,${(1 - d / 150) * .09})`;
          ctx.lineWidth = .5; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();
