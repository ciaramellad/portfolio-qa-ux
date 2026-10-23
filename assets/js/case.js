// Comportamiento común de los casos de estudio: menú móvil, cabecera y transición de página.
(function () {
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 20); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var curtain = document.getElementById('pageCurtain');
  if (curtain) {
    requestAnimationFrame(function () { curtain.classList.add('is-hidden'); });
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[data-transition]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || reduce || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        curtain.classList.remove('is-hidden');
        setTimeout(function () { window.location.href = href; }, 380);
      });
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) curtain.classList.add('is-hidden'); });
  }
})();
