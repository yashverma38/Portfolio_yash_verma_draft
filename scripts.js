/* ============================================
   YASH VERMA — Portfolio Scripts
   ============================================ */

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('is-open');
  });

  // Close nav when a link is clicked
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !siteNav.contains(e.target)) {
      siteNav.classList.remove('is-open');
    }
  });
}

// Scroll reveal animation using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  // Fallback: just show everything
  revealElements.forEach((el) => el.classList.add('is-visible'));
}
