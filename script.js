/* ============================================
   VALENTINE'S DAY — LOVE LETTER WEBSITE
   Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. FLOATING HEARTS / PETALS PARTICLE SYSTEM
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20 + Math.random() * 100;
      this.size = Math.random() * 14 + 8;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.type = Math.random() > 0.5 ? 'heart' : 'petal';
      this.color = this.type === 'heart'
        ? `rgba(${200 + Math.random() * 55}, ${80 + Math.random() * 60}, ${100 + Math.random() * 50}, ${this.opacity})`
        : `rgba(${240 + Math.random() * 15}, ${180 + Math.random() * 40}, ${190 + Math.random() * 30}, ${this.opacity})`;
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.3;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.type === 'heart') {
        this.drawHeart();
      } else {
        this.drawPetal();
      }

      ctx.restore();
    }

    drawHeart() {
      const s = this.size / 16;
      ctx.beginPath();
      ctx.moveTo(0, s * 3);
      ctx.bezierCurveTo(0, s * 0, -s * 9, -s * 2, -s * 5, -s * 7);
      ctx.bezierCurveTo(-s * 2, -s * 11, 0, -s * 9, 0, -s * 6);
      ctx.bezierCurveTo(0, -s * 9, s * 2, -s * 11, s * 5, -s * 7);
      ctx.bezierCurveTo(s * 9, -s * 2, 0, s * 0, 0, s * 3);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    drawPetal() {
      const s = this.size;
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.3, s * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = window.innerWidth < 768 ? 20 : 40;
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ==========================================
  // 2. SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation slightly for grouped elements
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el, i) => {
    // Add stagger delays for grid items
    if (el.classList.contains('reason-card')) {
      el.dataset.delay = i * 80;
    }
    revealObserver.observe(el);
  });

  // ==========================================
  // 3. MUSIC CONTROL
  // ==========================================
  const musicBtn = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  const musicOn = musicBtn.querySelector('.music-on');
  const musicOff = musicBtn.querySelector('.music-off');
  let isPlaying = false;

  bgMusic.volume = 0.3; // Soft background volume

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      musicOn.style.display = 'none';
      musicOff.style.display = 'inline';
    } else {
      bgMusic.play().catch(() => {});
      musicBtn.classList.add('playing');
      musicOn.style.display = 'inline';
      musicOff.style.display = 'none';
    }
    isPlaying = !isPlaying;
  });

  // Try to autoplay on first user interaction
  const tryAutoplay = () => {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicOn.style.display = 'inline';
        musicOff.style.display = 'none';
      }).catch(() => {});
    }
    document.removeEventListener('click', tryAutoplay);
    document.removeEventListener('scroll', tryAutoplay);
    document.removeEventListener('touchstart', tryAutoplay);
  };

  document.addEventListener('click', tryAutoplay);
  document.addEventListener('scroll', tryAutoplay);
  document.addEventListener('touchstart', tryAutoplay);

  // ==========================================
  // 4. VALENTINE TRICK — "No" makes "Yes" bigger!
  // ==========================================
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const valentineSuccess = document.getElementById('valentine-success');
  const valentineButtons = document.querySelector('.valentine-buttons');
  const valentineTitle = document.querySelector('.valentine-title');
  const valentineSubtitle = document.querySelector('.valentine-subtitle');
  const bigHeartContainer = document.querySelector('.big-heart-container');

  let yesScale = 1;
  let noClickCount = 0;

  const noResponses = [
    "No 😢",
    "Are you sure? 🥺",
    "Really sure? 💔",
    "Think again! 😭",
    "Pls? 🥹",
    "Don't break my heart 💕",
    "I'll be sad 😿",
    "You're breaking my heart! 💗",
    "I'll cry! 😢",
    "Last chance! 🌹",
    "Pretty please? 🥺💖",
    "I won't give up! 💝",
  ];

  btnNo.addEventListener('click', () => {
    noClickCount++;
    yesScale += 0.25;

    // Make Yes button bigger
    btnYes.style.fontSize = `${1.2 + (noClickCount * 0.15)}rem`;
    btnYes.style.padding = `${16 + (noClickCount * 4)}px ${48 + (noClickCount * 10)}px`;

    // Update No button text
    const responseIndex = Math.min(noClickCount, noResponses.length - 1);
    btnNo.textContent = noResponses[responseIndex];

    // Shrink No button slightly
    const noScale = Math.max(0.6, 1 - noClickCount * 0.05);
    btnNo.style.transform = `scale(${noScale})`;

    // Add a little shake to the Yes button
    btnYes.style.animation = 'none';
    btnYes.offsetHeight; // Trigger reflow
    btnYes.style.animation = 'jiggle 0.4s ease';
  });

  // Add jiggle keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes jiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-3deg); }
      75% { transform: rotate(3deg); }
    }
    @keyframes celebrationFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.1); }
    }
  `;
  document.head.appendChild(style);

  // YES button click — celebration!
  btnYes.addEventListener('click', () => {
    // Hide buttons and question
    valentineButtons.style.display = 'none';
    valentineTitle.style.display = 'none';
    valentineSubtitle.style.display = 'none';

    // Animate heart
    bigHeartContainer.querySelector('.big-heart').style.animation = 'celebrationFloat 1.5s ease-in-out infinite';
    bigHeartContainer.querySelector('.big-heart').style.fontSize = '7rem';

    // Show success message
    valentineSuccess.style.display = 'block';

    // Launch confetti
    launchConfetti();

    // Extra burst of particles
    for (let i = 0; i < 20; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      p.speedY = -(Math.random() * 1.5 + 0.5);
      p.opacity = Math.random() * 0.6 + 0.2;
      particles.push(p);
    }
  });

  // ==========================================
  // 5. CONFETTI BURST
  // ==========================================
  function launchConfetti() {
    const confettiCount = 120;
    const emojis = ['💕', '💖', '💗', '💝', '❤️', '🌹', '✨', '💘', '♥️', '🥰'];

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `-20px`;
        confetti.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.3}s`;
        document.body.appendChild(confetti);

        // Clean up after animation
        setTimeout(() => confetti.remove(), 5500);
      }, i * 30);
    }
  }

  // ==========================================
  // 6. SMOOTH PARALLAX ON HERO
  // ==========================================
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = window.innerHeight;

    if (scrolled < heroHeight) {
      const parallax = scrolled * 0.4;
      const opacity = 1 - (scrolled / heroHeight) * 1.2;
      heroContent.style.transform = `translateY(${parallax}px)`;
      heroContent.style.opacity = Math.max(0, opacity);
    }
  }, { passive: true });

  // ==========================================
  // 7. GENTLE CURSOR GLOW EFFECT (desktop only)
  // ==========================================
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(248, 200, 212, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: left 0.3s ease, top 0.3s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

});
