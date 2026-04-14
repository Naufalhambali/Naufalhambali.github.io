/* ═══════════════════════════════════════════════════════
   script.js — Personal Bio Website
   Berisi: Loading, Canvas Particles, Typing Animation,
           Navbar, Scroll Reveal, Skill Bars,
           Dark/Light Toggle, Mobile Menu
═══════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────
   1. LOADING SCREEN
─────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Sembunyikan loader setelah halaman siap (~1.8 detik)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Mulai animasi hero setelah loader menghilang
      startHeroAnimations();
    }, 1800);
  });
})();


/* ───────────────────────────────────────────
   2. CANVAS PARTICLE BACKGROUND
─────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles, animFrame;

  // Warna partikel sesuai tema
  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark
      ? ['rgba(167,139,250,0.5)', 'rgba(56,189,248,0.5)', 'rgba(196,181,253,0.4)']
      : ['rgba(139,92,246,0.35)', 'rgba(14,165,233,0.35)', 'rgba(99,102,241,0.3)'];
  }

  // Buat satu partikel
  function createParticle() {
    const colors = getColors();
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.4,
      dx:   (Math.random() - 0.5) * 0.35,
      dy:   (Math.random() - 0.5) * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2   // fase awal pulse
    };
  }

  // Inisialisasi semua partikel
  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count  = Math.min(Math.floor((W * H) / 8000), 150);
    particles = Array.from({ length: count }, createParticle);
  }

  // Gambar garis koneksi antar partikel yang berdekatan
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167,139,250,${opacity})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop animasi
  function draw(timestamp) {
    ctx.clearRect(0, 0, W, H);

    // Gambar gradasi latar belakang bergerak (subtle)
    const t = timestamp * 0.0004;
    const gx = W * (0.5 + 0.25 * Math.sin(t));
    const gy = H * (0.5 + 0.2  * Math.cos(t * 0.7));
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(W, H) * 0.65);
    grad.addColorStop(0,   'rgba(167,139,250,0.06)');
    grad.addColorStop(0.5, 'rgba(56,189,248,0.03)');
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Gambar koneksi
    drawConnections();

    // Update & gambar tiap partikel
    particles.forEach(p => {
      p.pulse += 0.02;
      const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${dynamicAlpha})`);
      ctx.fill();

      // Gerak
      p.x += p.dx;
      p.y += p.dy;

      // Bounce di batas
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    animFrame = requestAnimationFrame(draw);
  }

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animFrame);
      init();
      animFrame = requestAnimationFrame(draw);
    }, 200);
  });

  // Mulai
  init();
  animFrame = requestAnimationFrame(draw);

  // Expose untuk theme toggle
  window._refreshParticleColors = () => {
    const colors = getColors();
    particles.forEach(p => {
      p.color = colors[Math.floor(Math.random() * colors.length)];
    });
  };
})();


/* ───────────────────────────────────────────
   3. TYPING ANIMATION (Hero Name)
─────────────────────────────────────────── */
function startHeroAnimations() {
  const el   = document.getElementById('typed-name');
  if (!el) return;

  const name      = 'ALEX RIZKY';
  let   charIndex = 0;

  function type() {
    if (charIndex < name.length) {
      el.textContent += name[charIndex];
      charIndex++;
      setTimeout(type, 100 + Math.random() * 60);
    }
  }

  // Sedikit jeda sebelum mulai mengetik
  setTimeout(type, 300);

  // Trigger reveal-up items di hero
  document.querySelectorAll('.hero .reveal-up').forEach(el => {
    el.classList.add('visible');
  });
}


/* ───────────────────────────────────────────
   4. NAVBAR — Scroll & Active Link
─────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Tambah class 'scrolled' saat di-scroll
  function handleScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Update active link berdasarkan section yang terlihat
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) currentId = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // jalankan sekali saat load
})();


/* ───────────────────────────────────────────
   5. HAMBURGER MENU (Mobile)
─────────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Tutup menu saat link diklik
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Tutup menu saat klik di luar
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
})();


/* ───────────────────────────────────────────
   6. SCROLL REVEAL ANIMATION
─────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('[class*="reveal-"]');

  // Hero section langsung visible (ditangani oleh startHeroAnimations)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Hentikan observasi setelah terlihat
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => {
    // Skip elemen hero (akan dihandle setelah loader)
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
})();


/* ───────────────────────────────────────────
   7. SKILL BAR ANIMATION
─────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar    = entry.target;
        const target = bar.getAttribute('data-width');
        // Trigger animasi dengan sedikit jeda agar CSS transition berjalan
        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.style.width = target + '%';
          }, 200);
        });
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ───────────────────────────────────────────
   8. DARK / LIGHT THEME TOGGLE
─────────────────────────────────────────── */
(function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (!btn) return;

  // Baca preferensi tersimpan atau default dark
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // Refresh warna partikel
    if (window._refreshParticleColors) {
      window._refreshParticleColors();
    }
  });
})();


/* ───────────────────────────────────────────
   9. SMOOTH SCROLL untuk anchor links
─────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH   = document.getElementById('navbar')?.offsetHeight || 64;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ───────────────────────────────────────────
   10. NAVBAR LINK — Update active saat klik
─────────────────────────────────────────── */
(function initActiveLinks() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
})();
