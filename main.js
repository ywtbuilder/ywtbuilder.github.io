/**
 * YANG WENTONG — Portfolio Index
 * main.js · 2026-02-28
 *
 * Responsibilities
 *   1. Scroll-reveal  — IntersectionObserver to fade-in project cards.
 *   2. Keyboard nav   — Arrow keys to move focus between cards; Enter/Space
 *                       activates the "查看仓库" link inside the focused card.
 *   3. Reduced motion — respects prefers-reduced-motion: all animation skipped.
 *
 * Rules
 *   - Does NOT create any new DOM elements (no buttons, no links, no overlays).
 *   - Does NOT modify href / text of any existing link.
 *   - IIFE — no global pollution.
 */
(function () {
  'use strict';

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll-reveal ─────────────────────────────── */
  function initReveal() {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll('.card')
    );
    if (!cards.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      /* Skip animation — make all visible instantly */
      cards.forEach(function (c) {
        c.classList.remove('card--hidden');
        c.classList.add('card--visible');
      });
      return;
    }

    /* Stagger delay: each card enters 70 ms after the previous */
    cards.forEach(function (c) { c.classList.add('card--hidden'); });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el    = entry.target;
          var index = cards.indexOf(el);
          var delay = Math.max(0, index * 70);
          setTimeout(function () {
            el.classList.remove('card--hidden');
            el.classList.add('card--visible');
          }, delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );

    cards.forEach(function (c) { observer.observe(c); });
  }

  /* ── 2. Keyboard navigation between cards ─────────── */
  function initKeyboardNav() {
    var list = document.querySelector('.project-list');
    if (!list) return;

    /*
     * Make each card focusable so screen-reader / keyboard users
     * can navigate the list with Tab naturally.
     * We additionally support Up/Down arrows for faster traversal.
     */
    var cards = Array.prototype.slice.call(list.querySelectorAll('.card'));

    cards.forEach(function (card, i) {
      /* Cards themselves are focusable landmarks */
      if (!card.getAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      card.setAttribute('role', 'article');

      card.addEventListener('keydown', function (e) {
        var key = e.key;

        /* Enter or Space → activate the "查看仓库" link inside */
        if (key === 'Enter' || key === ' ') {
          var link = card.querySelector('.card__link');
          if (link) {
            e.preventDefault();
            link.click();
          }
          return;
        }

        /* Arrow Down / Arrow Up → move to sibling card */
        if (key === 'ArrowDown' || key === 'ArrowUp') {
          e.preventDefault();
          var next = key === 'ArrowDown' ? cards[i + 1] : cards[i - 1];
          if (next) next.focus();
        }
      });
    });
  }

  /* ── Boot ─────────────────────────────────────────── */
  function boot() {
    initReveal();
    initKeyboardNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
