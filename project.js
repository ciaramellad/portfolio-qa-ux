// Comportamiento compartido por todas las páginas de proyecto (case studies).
function initProjectPage() {
  // Menú móvil (mismo comportamiento que el home)
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Header con fondo al hacer scroll (ya viene "is-scrolled" fijo en proyectos, pero mantenemos consistencia)
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 20 || true);
    }, { passive: true });
  }

  // Revelado en scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Transición de página en pantalla completa al navegar
  const curtain = document.getElementById('pageCurtain');
  if (curtain) {
    requestAnimationFrame(() => curtain.classList.add('is-hidden'));
    document.querySelectorAll('a[data-transition]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || link.target === '_blank') return;
        e.preventDefault();
        curtain.classList.remove('is-hidden');
        setTimeout(() => { window.location.href = href; }, 380);
      });
    });
  }
}
