/* ══════════════════════════════════════════════════════════════
   Graciela VANCE — PREMIUM LANDING PAGE SCRIPT
   Vanilla JS | No dependencies
   ══════════════════════════════════════════════════════════════ */

'use strict';

// ─── UTILITY ──────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ─── DOM READY ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initSmoothScroll();
  initRevealAnimations();
  initCalendar();
  initTestimonialsSlider();
  initFAQ();
  initBookingForm();
  initGalleryModal();
  initStickyElements();
  initHeroParallax();
});

/* ══════════════════════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════════════════════ */
function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const delay = Math.random() * 8;
    const duration = 5 + Math.random() * 8;
    const opacity = 0.1 + Math.random() * 0.4;

    Object.assign(p.style, {
      left: x + '%',
      top: y + '%',
      width: size + 'px',
      height: size + 'px',
      animationDelay: delay + 's',
      animationDuration: duration + 's',
      opacity,
    });

    container.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar  = $('#navbar');
  const toggle  = $('#navToggle');
  const links   = $('#navLinks');
  const navLinkEls = $$('.nav-link');

  if (!navbar) return;

  // Scroll state
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  // Toggle menu
  on(toggle, 'click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  navLinkEls.forEach(link => {
    on(link, 'click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  on(document, 'click', (e) => {
    if (!navbar.contains(e.target) && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });

  // Active link on scroll
  const sections = $$('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = $(`a[href="#${entry.target.id}"]`, navbar);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  on(document, 'click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   REVEAL ANIMATIONS
══════════════════════════════════════════════════════════════ */
function initRevealAnimations() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');

  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ══════════════════════════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════════════════════════ */
function initHeroParallax() {
  const gradient = $('.hero-gradient');
  if (!gradient || window.innerWidth < 768) return;

  on(document, 'mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gradient.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  });

  on(window, 'scroll', () => {
    const scrolled = window.scrollY;
    const hero = $('.hero');
    if (hero && scrolled < window.innerHeight) {
      const speed = scrolled * 0.3;
      gradient.style.transform = `translateY(${speed}px)`;
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   CALENDAR
══════════════════════════════════════════════════════════════ */
function initCalendar() {
  const monthYearEl = $('#calMonthYear');
  const calDaysEl   = $('#calDays');
  const slotsGridEl = $('#slotsGrid');
  const prevMonthBtn = $('#prevMonth');
  const nextMonthBtn = $('#nextMonth');
  const fechaInput = $('#fecha');
  const horaInput  = $('#hora');

  if (!calDaysEl) return;

  const today = new Date();
  let current = { year: today.getFullYear(), month: today.getMonth() };

  // Simulated occupied slots per day
  const occupiedSlots = {
    5:  ['10:00', '14:00'],
    8:  ['11:00', '15:00', '18:00'],
    12: ['10:00', '12:00', '16:00', '20:00'],
    15: ['13:00', '17:00'],
    19: ['10:00', '14:00', '19:00'],
    22: ['11:00', '15:00'],
  };

  const allSlots = [
    '10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00',
    '18:00','19:00','20:00','21:00'
  ];

  const monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  let selectedDay = null;
  let selectedSlot = null;

  function renderCalendar() {
    const { year, month } = current;
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust: week starts on Monday
    const startOffset = (firstDay === 0 ? 6 : firstDay - 1);

    calDaysEl.innerHTML = '';

    // Empty cells
    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calDaysEl.appendChild(empty);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('button');
      dayEl.className = 'cal-day';
      dayEl.textContent = d;
      dayEl.setAttribute('role', 'gridcell');

      const date = new Date(year, month, d);
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isPast  = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSun   = date.getDay() === 0;

      if (isToday) dayEl.classList.add('today');
      if (isPast || isSun) {
        dayEl.classList.add(isPast ? 'past' : 'disabled');
        dayEl.disabled = true;
        dayEl.setAttribute('aria-disabled', 'true');
      }
      if (d === selectedDay?.d && month === selectedDay?.m && year === selectedDay?.y) {
        dayEl.classList.add('selected');
      }

      dayEl.setAttribute('aria-label', `${d} de ${monthNames[month]} de ${year}`);

      on(dayEl, 'click', () => {
        if (isPast || isSun) return;
        selectedDay = { d, m: month, y: year };
        selectedSlot = null;
        if (horaInput) horaInput.value = '';
        renderCalendar();
        renderSlots(d);
        if (fechaInput) {
          fechaInput.value = `${d} de ${monthNames[month]} de ${year}`;
          clearError('fecha');
        }
      });

      calDaysEl.appendChild(dayEl);
    }
  }

  function renderSlots(day) {
    if (!slotsGridEl) return;
    slotsGridEl.innerHTML = '';

    const occupied = occupiedSlots[day] || [];

    allSlots.forEach(slot => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot';
      btn.textContent = slot;
      btn.setAttribute('role', 'option');

      const isOcc = occupied.includes(slot);

      if (isOcc) {
        btn.classList.add('occupied');
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.title = 'Horario ocupado';
      }

      if (slot === selectedSlot) {
        btn.classList.add('selected');
        btn.setAttribute('aria-selected', 'true');
      }

      on(btn, 'click', () => {
        if (isOcc) return;
        selectedSlot = slot;
        if (horaInput) {
          horaInput.value = slot;
          clearError('hora');
        }
        renderSlots(day);
      });

      slotsGridEl.appendChild(btn);
    });
  }

  on(prevMonthBtn, 'click', () => {
    current.month--;
    if (current.month < 0) { current.month = 11; current.year--; }
    renderCalendar();
    if (slotsGridEl) slotsGridEl.innerHTML = '';
  });

  on(nextMonthBtn, 'click', () => {
    current.month++;
    if (current.month > 11) { current.month = 0; current.year++; }
    renderCalendar();
    if (slotsGridEl) slotsGridEl.innerHTML = '';
  });

  // Init
  renderCalendar();
  renderSlots(0); // Empty initial
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS SLIDER
══════════════════════════════════════════════════════════════ */
function initTestimonialsSlider() {
  const track   = $('#testimonialsTrack');
  const prevBtn = $('#prevTest');
  const nextBtn = $('#nextTest');
  const dotsEl  = $('#sliderDots');

  if (!track) return;

  const cards = $$('.testimonial-card', track);
  const total = cards.length;
  let current = 0;
  let autoInterval;

  const visibleCount = () => {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  function getMaxIndex() {
    return Math.max(0, total - visibleCount());
  }

  function goTo(idx) {
    const max = getMaxIndex();
    current = Math.max(0, Math.min(idx, max));
    const cardWidth = cards[0]?.offsetWidth + 24 || 0;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  function createDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const count = getMaxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === current ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      on(dot, 'click', () => { goTo(i); resetAuto(); });
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    $$('.slider-dot', dotsEl).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function startAuto() {
    autoInterval = setInterval(() => {
      goTo(current >= getMaxIndex() ? 0 : current + 1);
    }, 4500);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  on(prevBtn, 'click', () => { goTo(current - 1); resetAuto(); });
  on(nextBtn, 'click', () => { goTo(current + 1); resetAuto(); });

  // Touch/swipe
  let startX = 0;
  on(track, 'touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  on(track, 'touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      goTo(dx < 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });

  // Recalc on resize
  on(window, 'resize', debounce(() => {
    createDots();
    goTo(0);
  }, 200));

  createDots();
  startAuto();
}

/* ══════════════════════════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════════════════════════ */
function initFAQ() {
  const items = $$('.faq-item');

  items.forEach(item => {
    const question = $('.faq-question', item);
    const answerId = question?.getAttribute('aria-controls');
    const answer   = answerId ? $(`#${answerId}`) : null;

    if (!question || !answer) return;

    on(question, 'click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        const q = $('.faq-question', i);
        const a = q?.getAttribute('aria-controls');
        const ans = a ? $(`#${a}`) : null;
        if (q) q.setAttribute('aria-expanded', 'false');
        if (ans) ans.classList.remove('open');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   BOOKING FORM
══════════════════════════════════════════════════════════════ */
function initBookingForm() {
  const form = $('#bookingForm');
  if (!form) return;

  const fields = {
    nombre:    { el: $('#nombre'),    err: $('#nombreError'),    validate: v => v.trim().length >= 2 ? '' : 'Por favor ingresá tu nombre.' },
    email:     { el: $('#email'),     err: $('#emailError'),     validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresá un email válido.' },
    whatsapp:  { el: $('#whatsapp'),  err: $('#whatsappError'),  validate: v => v.replace(/\D/g,'').length >= 8 ? '' : 'Ingresá un número de WhatsApp válido.' },
    fecha:     { el: $('#fecha'),     err: $('#fechaError'),     validate: v => v.trim() ? '' : 'Seleccioná una fecha del calendario.' },
    hora:      { el: $('#hora'),      err: $('#horaError'),      validate: v => v.trim() ? '' : 'Seleccioná un horario disponible.' },
    sesion:    { el: $('#sesion'),    err: $('#sesionError'),    validate: v => v ? '' : 'Elegí el tipo de sesión.' },
    privacidad:{ el: $('#privacidad'),err: $('#privacidadError'),validate: v => v ? '' : 'Debes aceptar la política de privacidad.' },
  };

  // Real-time validation
  Object.values(fields).forEach(({ el, err, validate }) => {
    if (!el) return;
    const eventType = el.type === 'checkbox' ? 'change' : 'blur';
    on(el, eventType, () => {
      const val = el.type === 'checkbox' ? el.checked : el.value;
      const msg = validate(val);
      if (err) err.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
  });

  on(form, 'submit', async (e) => {
    e.preventDefault();

    let valid = true;

    // Validate all
    Object.entries(fields).forEach(([, { el, err, validate }]) => {
      if (!el) return;
      const val = el.type === 'checkbox' ? el.checked : el.value;
      const msg = validate(val);
      if (err) err.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) {
      // Scroll to first error
      const firstErr = form.querySelector('.form-input.error, input.error');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Por favor corregí los campos marcados.', 'error');
      return;
    }

    // Simulate submission
    const submitBtn = $('#submitBtn');
    const submitText = $('#submitText');
    const btnLoader  = $('#btnLoader');

    submitBtn?.classList.add('loading');
    if (submitText) submitText.textContent = 'Enviando...';
    if (btnLoader) btnLoader.style.display = 'block';

    await simulateDelay(2000);

    submitBtn?.classList.remove('loading');
    if (submitText) submitText.textContent = 'Confirmar reserva';
    if (btnLoader) btnLoader.style.display = 'none';

    showSuccessState(form);
    showToast('¡Reserva enviada! Te contesto en menos de 2 horas. 🌟', 'success');
  });
}

function showSuccessState(form) {
  const success = document.createElement('div');
  success.className = 'form-success';
  success.innerHTML = `
    <div class="success-icon" aria-hidden="true">✓</div>
    <h3>¡Reserva enviada con éxito!</h3>
    <p>Me comunico con vos a la brevedad para confirmar todos los detalles de tu sesión.</p>
    <p class="success-sub">Revisá tu WhatsApp y email en las próximas 2 horas.</p>
    <button class="btn btn-outline success-reset" onclick="this.closest('.form-success').remove()">Hacer otra reserva</button>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .form-success {
      text-align: center;
      padding: 3rem 2rem;
      animation: fadeUp 0.5s ease;
    }
    .success-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: rgba(76,175,80,0.1); border: 1px solid rgba(76,175,80,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; color: #4CAF50;
      margin: 0 auto 1.5rem;
    }
    .form-success h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.6rem; font-weight: 300;
      color: var(--c-text); margin-bottom: 1rem;
    }
    .form-success p { font-size: 0.88rem; color: var(--c-text-2); margin-bottom: 0.5rem; }
    .success-sub { color: var(--c-text-3) !important; font-size: 0.78rem !important; margin-bottom: 1.5rem !important; }
    .success-reset { margin-top: 0.5rem; }
  `;
  document.head.appendChild(style);

  form.style.animation = 'fadeOut 0.3s ease forwards';
  setTimeout(() => {
    form.parentNode.insertBefore(success, form);
    form.style.display = 'none';
  }, 300);
}

function clearError(fieldId) {
  const err = $(`#${fieldId}Error`);
  const el  = $(`#${fieldId}`);
  if (err) err.textContent = '';
  if (el)  el.classList.remove('error');
}

/* ══════════════════════════════════════════════════════════════
   GALLERY MODAL
══════════════════════════════════════════════════════════════ */
function initGalleryModal() {
  const modal      = $('#galleryModal');
  const unlockBtn  = $('#unlockGallery');
  const closeBtn   = $('#modalClose');
  const modalBook  = $('#modalBookBtn');
  const galleryItems = $$('.gallery-item');

  if (!modal) return;

  function openModal() {
    modal.hidden = false;
    document.body.classList.add('modal-open');
    closeBtn?.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  galleryItems.forEach(item => on(item, 'click', openModal));
  on(unlockBtn, 'click', openModal);
  on(closeBtn,  'click', closeModal);

  on(modalBook, 'click', () => {
    closeModal();
  });

  on(modal, 'click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

/* ══════════════════════════════════════════════════════════════
   STICKY ELEMENTS
══════════════════════════════════════════════════════════════ */
function initStickyElements() {
  const stickyCta = $('#stickyCta');
  const waFloat   = $('#waFloat');

  if (!stickyCta && !waFloat) return;

  let lastScroll = 0;

  const check = () => {
    const scrollY = window.scrollY;
    const heroH   = $('.hero')?.offsetHeight || 600;

    // Sticky CTA: show after hero, hide near booking
    if (stickyCta) {
      const booking  = $('#reservar');
      const bookingTop = booking ? booking.getBoundingClientRect().top + scrollY : Infinity;
      const pastHero  = scrollY > heroH * 0.6;
      const nearBook  = scrollY > bookingTop - 100;
      stickyCta.classList.toggle('visible', pastHero && !nearBook);
    }

    lastScroll = scrollY;
  };

  on(window, 'scroll', check, { passive: true });
  check();
}

/* ══════════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
  const container = $('#toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');

  const icon = type === 'success' ? '✓' : '✕';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${msg}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════ */
function simulateDelay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ══════════════════════════════════════════════════════════════
   PERFORMANCE: Lazy-load images (ready for real images)
══════════════════════════════════════════════════════════════ */
function initLazyLoad() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    });
    imgs.forEach(img => io.observe(img));
  } else {
    imgs.forEach(img => { img.src = img.dataset.src; });
  }
}

// Initialize lazy load
document.addEventListener('DOMContentLoaded', initLazyLoad);

/* ══════════════════════════════════════════════════════════════
   CURSOR EFFECT (subtle premium glow follow)
══════════════════════════════════════════════════════════════ */
(function initCursorGlow() {
  if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    z-index: 0;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  on(document, 'mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ══════════════════════════════════════════════════════════════
   CARD TILT EFFECT (premium hover)
══════════════════════════════════════════════════════════════ */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = $$('.service-card, .testimonial-card');

  cards.forEach(card => {
    on(card, 'mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotateX = dy * -4;
      const rotateY = dx * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    on(card, 'mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   NUMBER COUNT UP ANIMATION
══════════════════════════════════════════════════════════════ */
(function initCountUp() {
  const nums = $$('.trust-num');
  let triggered = false;

  const trigger = () => {
    if (triggered) return;
    const trust = $('.hero-trust');
    if (!trust) return;
    const rect = trust.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      triggered = true;
      // Already shown as text, no numeric animation needed for non-numeric labels
    }
  };

  on(window, 'scroll', trigger, { passive: true });
})();

/* ══════════════════════════════════════════════════════════════
   SECTION ENTRANCE LINES (decorative)
══════════════════════════════════════════════════════════════ */
(function initSectionLines() {
  const style = document.createElement('style');
  style.textContent = `
    .section-label {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
    }
    .section-label::before,
    .section-label::after {
      content: '';
      display: block;
      height: 1px;
      width: 24px;
      background: var(--c-gold);
      opacity: 0.5;
    }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════════════════════════
   GOOGLE ANALYTICS PLACEHOLDER (replace with real ID)
══════════════════════════════════════════════════════════════ */
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'G-XXXXXXXXXX');

/* ══════════════════════════════════════════════════════════════
   WHATSAPP TRACKING (CTA clicks)
══════════════════════════════════════════════════════════════ */
$$('a[href*="wa.me"]').forEach(link => {
  on(link, 'click', () => {
    // gtag('event', 'whatsapp_click', { event_category: 'CTA', event_label: link.closest('section')?.id || 'unknown' });
    console.log('[Analytics] WhatsApp CTA click');
  });
});

/* ══════════════════════════════════════════════════════════════
   PAGE LOAD COMPLETE
══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';

  // Trigger hero reveals immediately
  setTimeout(() => {
    $$('.hero .reveal-up').forEach(el => el.classList.add('visible'));
  }, 100);
});
