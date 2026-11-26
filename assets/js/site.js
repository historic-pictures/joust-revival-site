/* Joust Revival site: small progressive enhancements. The pages work without this file. */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var doc = document.documentElement;
  doc.classList.add('js');

  // ---------------------------------------------------------------- mobile menu
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A' && nav.classList.contains('open')) btn.click(); });
  }

  // ---------------------------------------------------------------- configurable links
  // <a data-cfg="donateUrl" data-soon="Donations open soon">  ->  the configured URL, or a disabled "coming" button
  function cfg(path) { return path.split('.').reduce(function (o, k) { return o && o[k]; }, C); }
  Array.prototype.forEach.call(document.querySelectorAll('[data-cfg]'), function (a) {
    var url = cfg(a.getAttribute('data-cfg'));
    if (url) {
      a.href = url;
      if (/^https?:/.test(url) && url.indexOf(location.host) < 0) { a.target = '_blank'; a.rel = 'noopener'; }
      a.removeAttribute('aria-disabled');
      var live = a.getAttribute('data-live'); if (live) a.querySelector('.lbl') ? (a.querySelector('.lbl').textContent = live) : (a.textContent = live);
    } else {
      a.setAttribute('aria-disabled', 'true');
      a.removeAttribute('href');
      a.setAttribute('role', 'link');
      var soon = a.getAttribute('data-soon'); if (soon) a.title = soon;
    }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-cfg-mail]'), function (el) {
    if (C.contactEmail) { el.innerHTML = ''; var a = document.createElement('a'); a.href = 'mailto:' + C.contactEmail; a.textContent = C.contactEmail; el.appendChild(a); }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

  // ---------------------------------------------------------------- newsletter (no third-party script; endpoint from config.js)
  Array.prototype.forEach.call(document.querySelectorAll('form.signup'), function (f) {
    var msg = f.querySelector('.form-msg'), N = C.newsletter || {};
    if (!N.endpoint) { if (msg) msg.textContent = 'Sign-ups open soon. Until then, play the game and check back here.'; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = f.querySelector('input[type=email]');
      if (!input || !input.value || !input.checkValidity()) { if (msg) msg.textContent = 'Please enter a valid e-mail address.'; return; }
      if (!N.endpoint) { if (msg) msg.textContent = 'Sign-ups are not open yet: nothing was sent. Please check back soon.'; return; }
      var body = new FormData(); body.append(N.field || 'email', input.value);
      if (msg) msg.textContent = 'Sending…';
      fetch(N.endpoint, { method: N.method || 'POST', body: body, mode: N.mode || 'no-cors' })
        .then(function () { if (msg) msg.textContent = 'Thank you. Check your inbox to confirm.'; f.reset(); })
        .catch(function () { if (msg) msg.textContent = 'That did not go through. Please try again later.'; });
    });
  });

  // ---------------------------------------------------------------- videos: load only when useful
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save = navigator.connection && (navigator.connection.saveData || /(^|-)2g$/.test(navigator.connection.effectiveType || ''));
  function startVideo(v) {
    if (v.dataset.started) return; v.dataset.started = '1';
    var small = v.getAttribute('data-src-small'), src = small && Math.min(screen.width, innerWidth) < 760 ? small : v.getAttribute('data-src'); if (!src) return;
    var s = document.createElement('source'); s.src = src; s.type = 'video/mp4'; v.appendChild(s);
    v.load(); var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  var vids = document.querySelectorAll('video[data-src]');
  // posters of videos further down the page load only when they come near
  var posters = document.querySelectorAll('video[data-poster]');
  if ('IntersectionObserver' in window) {
    var po = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.poster = e.target.getAttribute('data-poster'); po.unobserve(e.target); } }); }, { rootMargin: '600px' });
    Array.prototype.forEach.call(posters, function (v) { po.observe(v); });
  } else Array.prototype.forEach.call(posters, function (v) { v.poster = v.getAttribute('data-poster'); });
  if (!reduce && !save) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) { startVideo(v); if (v.paused && v.dataset.started && !v.dataset.user) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
          else if (v.dataset.started && !v.paused) v.pause();
        });
      }, { rootMargin: '120px' });
      Array.prototype.forEach.call(vids, function (v) { io.observe(v); });
    } else Array.prototype.forEach.call(vids, startVideo);
  }
  var hv = document.getElementById('heroVideo'), hb = document.getElementById('heroVideoBtn');
  if (hv && hb) {
    if (reduce || save) { hb.textContent = 'Play video'; }
    hb.addEventListener('click', function () {
      startVideo(hv);
      if (hv.paused) { hv.dataset.user = ''; var p = hv.play(); if (p && p.catch) p.catch(function () {}); hb.textContent = 'Pause video'; }
      else { hv.dataset.user = '1'; hv.pause(); hb.textContent = 'Play video'; }
    });
  }

  // ---------------------------------------------------------------- reveal on scroll
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { ro.observe(el); });
  } else Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('in'); });
})();
