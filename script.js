/* ═══════════════════════════════════════════════════════
   script.js — Muhammad Nouval Hambali Islamic Bio
   Modul: Loader, Canvas (Particle + Geometri Islami),
          Typing, Navbar, Hamburger, Scroll Reveal,
          Theme Toggle, Smooth Scroll
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. LOADING SCREEN
───────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      startHeroReveal();   // Mulai animasi hero
    }, 1900);
  });
})();


/* ─────────────────────────────────────────
   2. CANVAS BACKGROUND
   Menggambar: partikel melayang + garis
   koneksi + bentuk geometri islami (bintang
   8 sudut & lingkaran) + gradient bergerak
───────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, stars, raf;

  /* Ambil warna sesuai tema */
  function themeColors() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      p1: light ? 'rgba(22,163,74,' : 'rgba(74,222,128,',
      p2: light ? 'rgba(217,119,6,' : 'rgba(251,191,36,',
    };
  }

  /* Buat partikel */
  function mkParticle() {
    const c = themeColors();
    const which = Math.random() < 0.6 ? c.p1 : c.p2;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      dx: (Math.random() - 0.5) * 0.28,
      dy: (Math.random() - 0.5) * 0.28,
      a: Math.random() * 0.55 + 0.15,
      phase: Math.random() * Math.PI * 2,
      col: which,
    };
  }

  /* Buat bintang 8-sudut (geometri islami) */
  function mkStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 22 + 10,
      rot: Math.random() * Math.PI * 2,
      dRot: (Math.random() - 0.5) * 0.004,
      a: Math.random() * 0.07 + 0.03,
    };
  }

  /* Gambar bintang 8-sudut */
  function drawStar8(x, y, size, rot, alpha) {
    const c = themeColors();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    const outerR = size;
    const innerR = size * 0.42;
    const pts    = 8;
    for (let i = 0; i < pts * 2; i++) {
      const angle = (i * Math.PI) / pts;
      const r     = i % 2 === 0 ? outerR : innerR;
      if (i === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
      else         ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.strokeStyle = c.p1 + alpha + ')';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  /* Inisialisasi */
  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const n = Math.min(Math.floor((W * H) / 7500), 140);
    particles = Array.from({ length: n }, mkParticle);
    stars     = Array.from({ length: 8 }, mkStar);
  }

  /* Garis koneksi antar partikel */
  function drawConnections() {
    const maxD = 110;
    const c    = themeColors();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxD) {
          const op = (1 - d / maxD) * 0.14;
          ctx.beginPath();
          ctx.strokeStyle = c.p1 + op + ')';
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  /* Loop utama */
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    /* Gradient melayang */
    const t  = ts * 0.0003;
    const gx = W * (0.5 + 0.3 * Math.sin(t));
    const gy = H * (0.5 + 0.22 * Math.cos(t * 0.65));
    const g  = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.6);
    g.addColorStop(0,   'rgba(74,222,128,0.055)');
    g.addColorStop(0.5, 'rgba(251,191,36,0.03)');
    g.addColorStop(1,   'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Bintang geometri islami */
    stars.forEach(s => {
      s.rot += s.dRot;
      drawStar8(s.x, s.y, s.size, s.rot, s.a);
    });

    /* Koneksi partikel */
    drawConnections();

    /* Partikel */
    const c = themeColors();
    particles.forEach(p => {
      p.phase += 0.018;
      const a = p.a * (0.65 + 0.35 * Math.sin(p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + a + ')';
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    raf = requestAnimationFrame(draw);
  }

  /* Resize */
  let rTimer;
  window.addEventListener('resize', () => {
    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      cancelAnimationFrame(raf);
      init();
      raf = requestAnimationFrame(draw);
    }, 200);
  });

  init();
  raf = requestAnimationFrame(draw);

  /* Expose untuk theme toggle */
  window._refreshCanvas = () => {
    particles.forEach(p => {
      const c = themeColors();
      p.col = Math.random() < 0.6 ? c.p1 : c.p2;
    });
  };
})();


/* ─────────────────────────────────────────
   3. TYPING ANIMATION (Hero Name)
───────────────────────────────────────── */
function startHeroReveal() {
  // Reveal semua elemen hero
  document.querySelectorAll('.hero [class*="reveal-"]').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });

  // Typing effect nama
  const el   = document.getElementById('typed-name');
  if (!el) return;

  const full = 'Muhammad Nouval Hambali';
  let i = 0;

  function type() {
    if (i < full.length) {
      el.textContent += full[i];
      i++;
      // Variasikan kecepatan untuk efek manusiawi
      const delay = full[i - 1] === ' ' ? 120 : 65 + Math.random() * 55;
      setTimeout(type, delay);
    }
  }

  setTimeout(type, 400);
}


/* ─────────────────────────────────────────
   4. NAVBAR — Scroll State & Active Link
───────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (!navbar) return;

    // Scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active link tracking
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 80) current = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─────────────────────────────────────────
   5. HAMBURGER MENU (Mobile)
───────────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // Tutup saat klik link
  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  // Tutup saat klik luar
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();


/* ─────────────────────────────────────────
   6. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('[class*="reveal-"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  els.forEach(el => {
    // Hero dihandle terpisah oleh startHeroReveal()
    if (!el.closest('.hero')) {
      io.observe(el);
    }
  });
})();


/* ─────────────────────────────────────────
   7. DARK / LIGHT TOGGLE
───────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (!btn) return;

  // Baca preferensi tersimpan
  const saved = localStorage.getItem('theme-nh') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme-nh', next);

    // Perbarui warna partikel canvas
    if (window._refreshCanvas) window._refreshCanvas();
  });
})();


/* ─────────────────────────────────────────
   8. SMOOTH SCROLL (Custom — lebih halus
      di Android & desktop)
───────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_H = 70; // tinggi navbar

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const id     = this.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;

      // Gunakan scrollTo native (sudah smooth via CSS html)
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   9. HADITH CARD — subtle hover glow
      (dijalankan setelah DOM siap)
───────────────────────────────────────── */
(function initCardEffects() {
  document.querySelectorAll('.hadith-card, .motivasi-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-5px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
