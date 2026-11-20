// Progressive enhancement only — the page is fully usable with this disabled.
(function () {
  var prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (prefersMotion) document.documentElement.classList.add('motion-ok');

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open', !open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
      });
    });
  }

  // Scroll progress + back-to-top visibility (single rAF-throttled scroll handler)
  var bar = document.querySelector('.progress-bar');
  var toTop = document.querySelector('.to-top');
  var ticking = false;
  function onScroll() {
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('visible', scrolled > 500);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersMotion ? 'smooth' : 'auto' });
  });

  // Scroll-reveal
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObserver.observe(el); });

    // Scrollspy
    var navLinks = document.querySelectorAll('.nav a[href^="#"]');
    if (navLinks.length) {
      var sections = Array.prototype.map.call(navLinks, function (a) {
        return document.querySelector(a.getAttribute('href'));
      }).filter(Boolean);
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove('active'); });
            var match = document.querySelector('.nav a[href="#' + entry.target.id + '"]');
            if (match) match.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { spy.observe(s); });
    }
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in-view'); });
  }
})();
