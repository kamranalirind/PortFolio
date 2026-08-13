document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Mobile Nav Toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('header nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute(
        'aria-expanded',
        nav.classList.contains('open') ? 'true' : 'false'
      );
    });

    // Close mobile menu after a link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2. Sticky Header Shadow on Scroll ---------- */
  const header = document.querySelector('header');
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow);
  }

  /* ---------- 3. Active Link Highlight (Scrollspy) ---------- */
  const sections = document.querySelectorAll('main section[id], section[id]');
  const navLinks = document.querySelectorAll('header nav a');

  if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const linkId = href.includes('#') ? href.split('#')[1] : null;
            link.classList.toggle('active', linkId === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  /* ---------- 4. Scroll-Reveal Animations ---------- */
  const revealTargets = document.querySelectorAll(
    '.card, .project, .about, .hero-text, .hero-img, .contact-section form'
  );

  if (revealTargets.length) {
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---------- 5. Back-to-Top Button ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop);

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 6. Dynamic Footer Year ---------- */
  const yearSpan = document.querySelector('.current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------- 7. Contact Form Validation ---------- */
  const contactForm = document.querySelector('.contact-section form');
  if (contactForm) {
    const nameField = contactForm.querySelector('#name');
    const emailField = contactForm.querySelector('#email');
    const subjectField = contactForm.querySelector('#subject');
    const messageField = contactForm.querySelector('#message');

    // Creating a status message element
    let statusMsg = contactForm.querySelector('.form-status');
    if (!statusMsg) {
      statusMsg = document.createElement('p');
      statusMsg.className = 'form-status';
      contactForm.appendChild(statusMsg);
    }

    const showFieldError = (field, message) => {
      field.classList.add('input-error');
      let errorEl = field.parentElement.querySelector('.field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        field.insertAdjacentElement('afterend', errorEl);
      }
      errorEl.textContent = message;
    };

    const clearFieldError = (field) => {
      field.classList.remove('input-error');
      const errorEl = field.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.remove();
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    [nameField, emailField, subjectField, messageField].forEach(field => {
      if (!field) return;
      field.addEventListener('input', () => clearFieldError(field));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      statusMsg.textContent = '';
      statusMsg.className = 'form-status';

      if (!nameField.value.trim()) {
        showFieldError(nameField, 'Please enter your name.');
        isValid = false;
      } else {
        clearFieldError(nameField);
      }

      if (!emailField.value.trim() || !isValidEmail(emailField.value.trim())) {
        showFieldError(emailField, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailField);
      }

      if (!subjectField.value.trim()) {
        showFieldError(subjectField, 'Please enter a subject.');
        isValid = false;
      } else {
        clearFieldError(subjectField);
      }

      if (!messageField.value.trim()) {
        showFieldError(messageField, 'Please write a message.');
        isValid = false;
      } else {
        clearFieldError(messageField);
      }

      if (!isValid) {
        statusMsg.textContent = 'Please fix the highlighted fields.';
        statusMsg.classList.add('form-status-error');
        return;
      }

      // No backend is connected , so we simulate a successful send.
      statusMsg.textContent = `Thanks, ${nameField.value.trim()}! Your message has been noted. I'll get back to you soon.`;
      statusMsg.classList.add('form-status-success');
      contactForm.reset();
    });
  }

});
