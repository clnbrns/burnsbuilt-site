/* BurnsBuilt.co — main.js */
(function () {
  'use strict';

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Contact form validation ----------
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = form.querySelector('.form-status');

  function setInvalid(field, invalid) {
    field.classList.toggle('is-invalid', invalid);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    // Optional field — if empty, OK. Otherwise require 10+ digits.
    if (!value) return true;
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  }

  form.addEventListener('submit', function (e) {
    let valid = true;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const service = form.querySelector('#service');
    const message = form.querySelector('#message');

    if (!name.value.trim()) { setInvalid(name, true); valid = false; } else { setInvalid(name, false); }
    if (!validateEmail(email.value.trim())) { setInvalid(email, true); valid = false; } else { setInvalid(email, false); }
    if (!validatePhone(phone.value.trim())) { setInvalid(phone, true); valid = false; } else { setInvalid(phone, false); }
    if (!service.value) { setInvalid(service, true); valid = false; } else { setInvalid(service, false); }
    if (!message.value.trim() || message.value.trim().length < 10) { setInvalid(message, true); valid = false; } else { setInvalid(message, false); }

    var terms = form.querySelector('#terms_accepted');
    if (terms && !terms.checked) {
      var termsGroup = terms.closest('.form-group');
      if (termsGroup) termsGroup.classList.add('is-invalid');
      valid = false;
    } else if (terms) {
      var termsGroup2 = terms.closest('.form-group');
      if (termsGroup2) termsGroup2.classList.remove('is-invalid');
    }

    if (!valid) {
      e.preventDefault();
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Fire a GA4 conversion event for the lead. gtag is loaded async in <head>;
    // guarded in case an ad blocker or offline state nukes it.
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        form_name: 'contact',
        service_type: service.value
      });
    }

    // Valid → let the browser submit to Netlify Forms (redirects to /thanks.html).
  });
})();
