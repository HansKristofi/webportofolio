// ═══════════════════════════════════════════
//   HANS.DEV — Portfolio Scripts
// ═══════════════════════════════════════════

// ─── PARTICLE CANVAS ───────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT  = 90;
const CONNECTION_DIST = 140;
const PARTICLE_COLOR  = '26,140,255';

const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x:       Math.random() * window.innerWidth,
  y:       Math.random() * window.innerHeight,
  vx:      (Math.random() - 0.5) * 0.35,
  vy:      (Math.random() - 0.5) * 0.35,
  size:    Math.random() * 1.6 + 0.3,
  opacity: Math.random() * 0.55 + 0.1,
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${PARTICLE_COLOR},${0.07 * (1 - dist / CONNECTION_DIST)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${PARTICLE_COLOR},${p.opacity})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0)             p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0)             p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();


// ─── SCROLL REVEAL ─────────────────────────
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
    if (siblings) {
      [...siblings].forEach((el, i) => { el.style.transitionDelay = `${i * 0.1}s`; });
    }
    entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));


// ─── ACTIVE NAVBAR LINK ────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


// ─── LIGHTBOX ──────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Small delay before clearing src so close animation plays cleanly
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

// Attach click to every project image wrapper
document.querySelectorAll('.project-image-wrap[data-lightbox]').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const src     = wrap.getAttribute('data-lightbox');
    const caption = wrap.getAttribute('data-caption') || '';
    openLightbox(src, caption);
  });
});

// Close via button or backdrop
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

// Close with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});
