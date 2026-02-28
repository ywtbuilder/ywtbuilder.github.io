/**
 * 杨文通 · 项目作品集导航 — main.js
 * Author : Yang Wentong
 * Updated: 2026-02-28
 *
 * 功能：
 *   1. 标记 JS 已加载（<html> 追加 .js 类），激活基于 CSS 的渐入动效。
 *   2. IntersectionObserver：项目条目进入视口时追加 .visible，触发淡入上移效果。
 *   3. 自动更新 Footer 版权年份。
 */

(function () {
  'use strict';

  /* ── 1. 标记 JS 已就绪，解锁渐入 CSS ── */
  document.documentElement.classList.replace('no-js', 'js');


  /* ── 2. 项目条目进入视口渐入 ── */
  function observeItems() {
    var items = document.querySelectorAll('.project-item');
    if (!items.length) return;

    // 不支持 IntersectionObserver 时直接显示
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // 只触发一次
          }
        });
      },
      {
        threshold: 0.08,   // 条目露出 8% 即触发
        rootMargin: '0px 0px -24px 0px'
      }
    );

    // 按序错开入场时间，营造节奏感
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i * 60) + 'ms';
      observer.observe(el);
    });
  }


  /* ── 3. 自动更新版权年份 ── */
  function updateYear() {
    var el = document.getElementById('footer-year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }


  /* ── 入口：DOM 就绪后执行 ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      observeItems();
      updateYear();
    });
  } else {
    observeItems();
    updateYear();
  }

}());
