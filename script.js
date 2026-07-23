document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Navigation & Hamburger Menu Toggle
  // ==========================================================================
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle Mobile Menu Open/Close
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isExpanded = nav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close Menu When clicking on nav links (Mobile View)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight active link on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 2. Sticky Header Scroll Effect
  // ==========================================================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately in case page loads scrolled

  // ==========================================================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 4. Stat Counter Animation
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats-section');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // Animation duration in ms
      const stepTime = 30; // Step update interval in ms
      const stepCount = duration / stepTime;
      const increment = target / stepCount;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          stat.textContent = target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(currentVal) + suffix;
        }
      }, stepTime);
    });
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 5. AI Neural Network Particle Constellation Trail (Background Layer)
  // ==========================================================================
  const canvas = document.getElementById('cursor-trail-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isAnimating = false;
    let mousePos = { x: -100, y: -100 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      // Spawn vibrant data node particles on movement
      if (Math.random() < 0.75) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9 - 0.2,
          radius: Math.random() * 2.5 + 2.0,
          life: 1.0,
          decay: Math.random() * 0.018 + 0.012 // Fades smoothly over ~900ms
        });
      }

      if (particles.length > 45) {
        particles.shift();
      }

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(renderConstellation);
      }
    });

    const renderConstellation = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Vibrant Mouse Cursor Glow Halo in Background
      if (mousePos.x > 0 && mousePos.y > 0) {
        const haloGradient = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, 35
        );
        haloGradient.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
        haloGradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.12)');
        haloGradient.addColorStop(1, 'rgba(0, 242, 254, 0)');

        ctx.fillStyle = haloGradient;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 35, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
      }

      particles = particles.filter(p => p.life > 0);

      if (particles.length > 0) {
        const maxConnectDist = 85;

        // 2. High-Opacity Neural Connection Lines
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];

          // Connect to nearby cursor position
          const distToMouse = Math.hypot(mousePos.x - p1.x, mousePos.y - p1.y);
          if (distToMouse < maxConnectDist) {
            const lineAlpha = (1 - distToMouse / maxConnectDist) * p1.life * 0.55; // High vibrant opacity
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f2fe';
            ctx.stroke();
          }

          // Connect to other nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < maxConnectDist) {
              const lineAlpha = (1 - dist / maxConnectDist) * Math.min(p1.life, p2.life) * 0.40;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(79, 172, 254, ${lineAlpha})`;
              ctx.lineWidth = 1.0;
              ctx.shadowBlur = 6;
              ctx.shadowColor = '#4facfe';
              ctx.stroke();
            }
          }
        }

        // 3. High-Opacity Glowing Data Nodes
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const nodeAlpha = p.life * 0.85; // High opacity node glow

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 242, 254, ${nodeAlpha})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#00f2fe';
          ctx.fill();

          // Bright inner core point
          ctx.beginPath();
          ctx.arc(p.x, p.y, (p.radius * 0.55) * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha * 1.1})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ffffff';
          ctx.fill();
        }

        requestAnimationFrame(renderConstellation);
      } else {
        isAnimating = false;
      }
    };
  }
});
