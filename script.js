document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Switchable Warm Editorial Light & Forest Dark Theme System
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const THEME_STORAGE_KEY = 'editorial-portfolio-theme';

  // Default to the warm cream editorial theme (#F5F0E8) unless user toggled
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';

  const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  // Initialize theme
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // ==========================================================================
  // 2. Navigation & Hamburger Menu Toggle
  // ==========================================================================
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isExpanded = nav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active Link Scroll Spy
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 160) {
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
  // 3. Sticky Header Scroll Effect
  // ==========================================================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ==========================================================================
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 5. Stat Counter Animation
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats-section');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0 || stat.getAttribute('data-target').includes('.');
      const duration = 1400;
      const stepTime = 30;
      const stepCount = duration / stepTime;
      const increment = target / stepCount;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          stat.textContent = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;
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
  // 6. Interactive Project Detail Modal Data & Handler
  // ==========================================================================
  const projectDetailsMap = {
    prompt2plan: {
      title: "Prompt2Plan – AI Requirement to Project Planner",
      badge: "AI & Vector Search System Architecture Planner",
      tech: ["Python", "FastAPI", "React", "SQLite", "RAG Pipeline", "Knowledge Graph", "FAISS", "LLM NLP"],
      liveDemo: "https://prompt2plan.onrender.com",
      overview: "Prompt2Plan converts unstructured user project ideas into technically grounded system architectures, task dependencies, effort estimations, and milestone timelines.",
      architecture: [
        "<strong>RAG &amp; Knowledge Graph Pipeline:</strong> Built a RAG and knowledge graph pipeline using LLM-based NLP, FAISS vector search and dependency mapping to generate technically grounded system architectures from free-text project ideas.",
        "<strong>Automated Scheduling:</strong> Automated task breakdown, effort estimation and milestone scheduling into structured, time-bound project plans.",
        "<strong>Full-Stack Interactive Interface:</strong> Developed a full-stack application (FastAPI, React, SQLite) that renders live architecture diagrams, task boards and timelines from generated plans."
      ],
      github: "https://github.com/krishna0712-hub/Prompt2Plan"
    },
    leavetrack: {
      title: "LeaveTrack – Employee Leave Management System",
      badge: "Full-Stack Enterprise Web Application",
      tech: ["Python", "Flask", "React", "REST APIs", "SQL", "Tailwind CSS", "Pytest"],
      liveDemo: "https://leavetracker-mu.vercel.app",
      overview: "LeaveTrack is an employee leave management platform built with a layered Python Flask backend and an interactive React frontend dashboard.",
      architecture: [
        "<strong>Employee &amp; Manager Workflows:</strong> Developed a full-stack leave management system using Python, Flask, React, REST APIs and SQL, implementing employee and manager workflows for leave application, approval, rejection, cancellation and team calendar management.",
        "<strong>Layered Backend Architecture:</strong> Implemented a layered backend architecture with a dedicated service layer for leave validation, including leave-balance checks, overlapping-date detection, role-based authorization, state transitions, audit trails, centralized error handling and structured logging.",
        "<strong>React Dashboard &amp; Pytest QA:</strong> Built a responsive React and Tailwind CSS dashboard with leave-balance charts, approval queues, status tracking and team calendar views; wrote Pytest unit and integration tests covering business rules and REST API endpoints."
      ],
      github: "https://github.com/krishna0712-hub"
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const openModal = (projectId) => {
    const data = projectDetailsMap[projectId];
    if (!data || !modalBody || !modalOverlay) return;

    modalBody.innerHTML = `
      <span class="featured-badge" style="margin-bottom: 0.5rem;">${data.badge}</span>
      <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">${data.title}</h2>
      
      <div class="project-tags" style="margin-bottom: 1.25rem;">
        ${data.tech.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>

      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.7;">${data.overview}</p>

      <div class="project-highlights-box" style="margin-bottom: 1.75rem;">
        <h4>Architectural Details &amp; Key Features:</h4>
        <ul style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${data.architecture.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="project-links" style="margin-top: 1.5rem;">
        ${data.liveDemo ? `
          <a href="${data.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" title="Open Live Demo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Live Demo ↗
          </a>` : ''}
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="View GitHub Repository">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub Repository ↗
        </a>
      </div>
    `;

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================================================================
  // 7. Interactive Copy Email & Toast Notification
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailLinks = document.querySelectorAll('#contact-email-link, #hero-email, #contact-email-icon');
  const emailAddress = 'krishnaprasath@gmail.com';

  const showToast = (message) => {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B86F50" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(() => {
          showToast(`Copied ${emailAddress} to clipboard!`);
        }).catch(() => {
          showToast(`Email: ${emailAddress}`);
        });
      } else {
        showToast(`Email: ${emailAddress}`);
      }
    });
  }

  emailLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).catch(() => {});
      }
      showToast(`Opening Gmail for ${emailAddress}...`);
    });
  });

  // ==========================================================================
  // 8. Restrained Warm Editorial Ink Constellation Canvas (No Glows/Neon)
  // ==========================================================================
  const canvas = document.getElementById('cursor-trail-canvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isAnimating = false;
    let mousePos = { x: -100, y: -100 };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      if (Math.random() < 0.45) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.15,
          radius: Math.random() * 1.4 + 1.2,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015
        });
      }

      if (particles.length > 26) {
        particles.shift();
      }

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(renderConstellation);
      }
    });

    const getThemeColors = () => {
      const isDark = htmlElement.getAttribute('data-theme') === 'dark';
      return {
        particleColor: isDark ? '201, 125, 93' : '184, 111, 80',
        lineColor: isDark ? '138, 146, 120' : '138, 146, 120'
      };
    };

    const renderConstellation = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const colors = getThemeColors();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
      }

      particles = particles.filter(p => p.life > 0);

      if (particles.length > 0) {
        const maxConnectDist = 72;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < maxConnectDist) {
              const lineAlpha = (1 - dist / maxConnectDist) * Math.min(p1.life, p2.life) * 0.18;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${colors.lineColor}, ${lineAlpha})`;
              ctx.lineWidth = 0.85;
              ctx.stroke();
            }
          }
        }

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const nodeAlpha = p.life * 0.28;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.particleColor}, ${nodeAlpha})`;
          ctx.fill();
        }

        requestAnimationFrame(renderConstellation);
      } else {
        isAnimating = false;
      }
    };
  }
});
