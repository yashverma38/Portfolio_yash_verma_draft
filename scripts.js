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


/* ============================================
   MIXPANEL ANALYTICS
   Event naming: {action}_{element}_{module}_{screen}_{flow}_{product}
   All snake_case. Product = portfolio.
   ============================================ */

(function () {
  // Guard: only run if mixpanel is loaded
  if (typeof mixpanel === 'undefined') return;

  // ==============================
  // LOCAL ACTIVITY TRACKER
  // Logs events to localStorage so the analytics page
  // can show visitors their own activity.
  // ==============================
  var LOCAL_KEY = 'yv_activity';

  function getActivity() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || null;
    } catch (e) { return null; }
  }

  function initActivity() {
    var a = getActivity();
    if (!a) {
      a = {
        firstVisit: new Date().toISOString(),
        totalVisits: 0,
        pages: {},
        events: [],
        maxScroll: {},
        sectionsSeen: []
      };
    }
    a.totalVisits++;
    a.lastVisit = new Date().toISOString();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(a));
    return a;
  }

  var activity = initActivity();

  function logLocal(eventName, page, extra) {
    var a = getActivity() || activity;
    a.events.push({
      name: eventName,
      page: page,
      ts: new Date().toISOString(),
      extra: extra || null
    });
    // Keep only last 200 events to avoid bloating localStorage
    if (a.events.length > 200) a.events = a.events.slice(-200);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(a));
  }

  function logPageView(page) {
    var a = getActivity() || activity;
    a.pages[page] = (a.pages[page] || 0) + 1;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(a));
  }

  function logScroll(page, depth) {
    var a = getActivity() || activity;
    a.maxScroll[page] = Math.max(a.maxScroll[page] || 0, depth);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(a));
  }

  function logSection(sectionName) {
    var a = getActivity() || activity;
    if (a.sectionsSeen.indexOf(sectionName) === -1) {
      a.sectionsSeen.push(sectionName);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(a));
    }
  }

  // --- Screen mapping from URL ---
  var SCREEN_MAP = {
    '/': 'home',
    '/index.html': 'home',
    '/work.html': 'work',
    '/about.html': 'about',
    '/contact.html': 'contact',
    '/case-study-1.html': 'ads_on_speaker',
    '/case-study-2.html': 'credit_line_upi',
    '/case-study-3.html': 'stolo_ux',
    '/case-study-4.html': 'bloc',
    '/analytics.html': 'analytics'
  };

  // --- Flow mapping per screen ---
  var FLOW_MAP = {
    'home': 'discovery',
    'work': 'discovery',
    'about': 'about',
    'contact': 'contact',
    'ads_on_speaker': 'case_study',
    'credit_line_upi': 'case_study',
    'stolo_ux': 'case_study',
    'bloc': 'case_study',
    'analytics': 'analytics'
  };

  // --- Module mapping for page view per screen ---
  var PAGE_MODULE_MAP = {
    'home': 'hero',
    'work': 'page_hero',
    'about': 'page_hero',
    'contact': 'page_hero',
    'ads_on_speaker': 'cs_hero',
    'credit_line_upi': 'cs_hero',
    'stolo_ux': 'cs_hero',
    'bloc': 'cs_hero',
    'analytics': 'page_hero'
  };

  var path = window.location.pathname;
  // Normalize: strip trailing slash, handle bare domain
  if (path === '' || path === '/') path = '/index.html';
  // Handle paths like /portfolio-index.html for deployed version
  if (path === '/portfolio-index.html') path = '/index.html';

  var screen = SCREEN_MAP[path] || 'unknown';
  var flow = FLOW_MAP[screen] || 'unknown';
  var pageModule = PAGE_MODULE_MAP[screen] || 'page_hero';
  var PRODUCT = 'portfolio';

  // Helper: build event name
  function evt(action, element, module, scr, fl) {
    return [action, element, module, scr || screen, fl || flow, PRODUCT].join('_');
  }

  // Helper: get clean text from element
  function cleanText(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 80);
  }

  // ==============================
  // 1. PAGE VIEW
  // ==============================
  var pageViewEvt = evt('view', 'page', pageModule);
  mixpanel.track(pageViewEvt, {
    referrer: document.referrer,
    page_title: document.title,
    path: path
  });
  logPageView(screen);
  logLocal(pageViewEvt, screen);

  // ==============================
  // 2. HEADER NAVIGATION
  // ==============================

  // Logo click
  var logo = document.querySelector('.header .logo');
  if (logo) {
    logo.addEventListener('click', function () {
      var e = evt('tap', 'logo', 'header_nav', screen, 'navigation');
      mixpanel.track(e);
      logLocal(e, screen, { element: 'logo' });
    });
  }

  // Nav links (Home, Work, About, Contact)
  document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      var e = evt('tap', 'link', 'header_nav', screen, 'navigation');
      mixpanel.track(e, {
        destination: link.getAttribute('href'),
        link_text: cleanText(link)
      });
      logLocal(e, screen, { element: 'nav_link', text: cleanText(link) });
    });
  });

  // Resume button in nav
  var resumeNav = document.querySelector('.nav__cta');
  if (resumeNav) {
    resumeNav.addEventListener('click', function () {
      var e = evt('tap', 'button', 'header_nav', screen, 'navigation');
      mixpanel.track(e);
      logLocal(e, screen, { element: 'resume_button' });
    });
  }

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var isOpen = siteNav && siteNav.classList.contains('is-open');
      var e = evt('toggle', 'menu', 'header_nav', screen, 'navigation');
      mixpanel.track(e, { state: isOpen ? 'close' : 'open' });
      logLocal(e, screen, { element: 'menu_toggle' });
    });
  }

  // ==============================
  // 3. FOOTER
  // ==============================
  document.querySelectorAll('.footer__link').forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href') || '';
      var channel = href.includes('linkedin') ? 'linkedin' : href.includes('mailto') ? 'email' : 'other';
      var e = evt('tap', 'link', 'footer', screen, 'navigation');
      mixpanel.track(e, { channel: channel, url: href });
      logLocal(e, screen, { element: 'footer_' + channel });
    });
  });

  // ==============================
  // 4. HOME PAGE
  // ==============================
  if (screen === 'home') {
    // Hero CTAs
    document.querySelectorAll('.hero__actions .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isPrimary = btn.classList.contains('btn--primary');
        var e = evt('tap', isPrimary ? 'button' : 'link', 'hero');
        mixpanel.track(e, { cta_text: cleanText(btn), destination: btn.getAttribute('href') });
        logLocal(e, screen, { element: 'hero_cta', text: cleanText(btn) });
      });
    });

    // Work cards
    document.querySelectorAll('.work-card__link').forEach(function (link) {
      link.addEventListener('click', function () {
        var card = link.closest('.work-card');
        var company = card ? cleanText(card.querySelector('.work-card__company')) : '';
        var metric = card ? cleanText(card.querySelector('.work-card__result')) : '';
        var title = card ? cleanText(card.querySelector('.work-card__title')) : '';
        var e = evt('tap', 'card', 'work_cards');
        mixpanel.track(e, { case_study: title, company: company, metric: metric });
        logLocal(e, screen, { element: 'work_card', text: title });
      });
    });

    // Side project link
    document.querySelectorAll('.side-project__link').forEach(function (link) {
      link.addEventListener('click', function () {
        var project = link.closest('.side-project');
        var name = project ? cleanText(project.querySelector('.side-project__name')) : '';
        var e = evt('tap', 'link', 'side_projects');
        mixpanel.track(e, { project_name: name, url: link.getAttribute('href') });
        logLocal(e, screen, { element: 'side_project', text: name });
      });
    });

    // About teaser link
    var aboutTeaser = document.querySelector('.about-teaser__link');
    if (aboutTeaser) {
      aboutTeaser.addEventListener('click', function () {
        var e = evt('tap', 'link', 'about_teaser', 'home', 'about');
        mixpanel.track(e);
        logLocal(e, screen, { element: 'about_teaser' });
      });
    }

    // CTA section buttons
    document.querySelectorAll('.cta-box__actions .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var e = evt('tap', 'button', 'cta_section', 'home', 'contact');
        mixpanel.track(e, { cta_text: cleanText(btn) });
        logLocal(e, screen, { element: 'cta_button', text: cleanText(btn) });
      });
    });
  }

  // ==============================
  // 5. WORK PAGE
  // ==============================
  if (screen === 'work') {
    // Case study cards
    document.querySelectorAll('.work-card__link').forEach(function (link) {
      link.addEventListener('click', function () {
        var card = link.closest('.work-card');
        var title = card ? cleanText(card.querySelector('.work-card__title')) : '';
        var metric = card ? cleanText(card.querySelector('.work-card__metric')) : '';
        var e = evt('tap', 'card', 'work_cards');
        mixpanel.track(e, { case_study: title, metric: metric });
        logLocal(e, screen, { element: 'work_card', text: title });
      });
    });

    // Side project links
    document.querySelectorAll('.side-project__link').forEach(function (link) {
      link.addEventListener('click', function () {
        var project = link.closest('.side-project');
        var name = project ? cleanText(project.querySelector('.side-project__name')) : '';
        var e = evt('tap', 'link', 'side_projects');
        mixpanel.track(e, { project_name: name, url: link.getAttribute('href') });
        logLocal(e, screen, { element: 'side_project', text: name });
      });
    });

    // CTA section buttons
    document.querySelectorAll('.cta-box__actions .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var e = evt('tap', 'button', 'cta_section', 'work', 'contact');
        mixpanel.track(e, { cta_text: cleanText(btn) });
        logLocal(e, screen, { element: 'cta_button', text: cleanText(btn) });
      });
    });
  }

  // ==============================
  // 6. ABOUT PAGE
  // ==============================
  if (screen === 'about') {
    document.querySelectorAll('.cta-box__actions .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var e = evt('tap', 'button', 'cta_section', 'about', 'contact');
        mixpanel.track(e, { cta_text: cleanText(btn) });
        logLocal(e, screen, { element: 'cta_button', text: cleanText(btn) });
      });
    });
  }

  // ==============================
  // 7. CONTACT PAGE
  // ==============================
  if (screen === 'contact') {
    // Contact channel links
    document.querySelectorAll('.contact__channel-value').forEach(function (link) {
      if (link.tagName === 'A') {
        link.addEventListener('click', function () {
          var href = link.getAttribute('href') || '';
          var label = link.closest('.contact__channel');
          var channel = label ? cleanText(label.querySelector('.contact__channel-label')) : '';
          var e = evt('tap', 'link', 'contact_channels');
          mixpanel.track(e, { channel: channel.toLowerCase(), url: href });
          logLocal(e, screen, { element: 'contact_' + channel.toLowerCase() });
        });
      }
    });

    // Form focus (track first interaction only)
    var formFocused = false;
    var form = document.querySelector('.contact-form');
    if (form) {
      form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('focus', function () {
          if (!formFocused) {
            formFocused = true;
            var e = evt('focus', 'form', 'contact_form');
            mixpanel.track(e, { field: field.getAttribute('name') || field.id });
            logLocal(e, screen, { element: 'form_focus' });
          }
        });
      });

      // Form submission
      form.addEventListener('submit', function () {
        var e = evt('submit', 'form', 'contact_form');
        mixpanel.track(e);
        logLocal(e, screen, { element: 'form_submit' });
      });
    }
  }

  // ==============================
  // 8. CASE STUDY PAGES
  // ==============================
  if (flow === 'case_study') {
    // "← All work" back link
    var backLink = document.querySelector('.cs-hero__back');
    if (backLink) {
      backLink.addEventListener('click', function () {
        var e = evt('tap', 'link', 'cs_hero');
        mixpanel.track(e);
        logLocal(e, screen, { element: 'back_link' });
      });
    }

    // Previous / Next navigation
    document.querySelectorAll('.cs-nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        var isNext = link.classList.contains('cs-nav__link--next');
        var title = cleanText(link.querySelector('.cs-nav__title') || link);
        var e = evt('tap', 'link', 'cs_nav');
        mixpanel.track(e, { direction: isNext ? 'next' : 'previous', destination: link.getAttribute('href'), destination_title: title });
        logLocal(e, screen, { element: 'cs_nav_' + (isNext ? 'next' : 'prev') });
      });
    });

    // TestFlight CTAs (bloc only)
    if (screen === 'bloc') {
      var heroCtaWrapper = document.querySelector('.cs-hero__cta');
      if (heroCtaWrapper) {
        heroCtaWrapper.querySelectorAll('.btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var e = evt('tap', 'button', 'cs_hero');
            mixpanel.track(e, { cta_text: cleanText(btn), url: btn.getAttribute('href') });
            logLocal(e, screen, { element: 'hero_cta', text: cleanText(btn) });
          });
        });
      }

      document.querySelectorAll('.cs-callout .btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var e = evt('tap', 'button', 'cs_content');
          mixpanel.track(e, { cta_text: cleanText(btn), url: btn.getAttribute('href') });
          logLocal(e, screen, { element: 'callout_cta', text: cleanText(btn) });
        });
      });
    }
  }

  // ==============================
  // 9. SCROLL DEPTH TRACKING
  // ==============================
  var depthsFired = {};
  var depthThresholds = [25, 50, 75, 100];

  function checkScrollDepth() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);

    depthThresholds.forEach(function (threshold) {
      if (pct >= threshold && !depthsFired[threshold]) {
        depthsFired[threshold] = true;
        mixpanel.track(evt('scroll', 'page', 'page_content', screen, 'engagement'), {
          depth: threshold
        });
        logScroll(screen, threshold);
      }
    });
  }

  var scrollTimer = null;
  window.addEventListener('scroll', function () {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      checkScrollDepth();
    }, 300);
  }, { passive: true });

  // ==============================
  // 10. SECTION VIEW TRACKING
  // ==============================
  var SECTION_NAMES = {
    '.hero': 'hero',
    '.page-hero': 'page_hero',
    '.cs-hero': 'cs_hero',
    '.cs-meta': 'cs_meta',
    '.cs-content': 'cs_content',
    '.cs-nav': 'cs_nav',
    '.work-grid': 'work_cards',
    '.side-projects__grid': 'side_projects',
    '.about-teaser': 'about_teaser',
    '.cta-section': 'cta_section',
    '.cta-box': 'cta_box',
    '.story__grid': 'story',
    '.skills__grid': 'skills',
    '.timeline': 'experience',
    '.contact-grid': 'contact_form',
    '.cs-metrics': 'metrics',
    '.cs-learnings': 'learnings',
    '.about__group-photo': 'group_photo',
    '.personality': 'personality'
  };

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var sectionName = entry.target.getAttribute('data-section-name');
            if (sectionName) {
              mixpanel.track(evt('view', 'section', sectionName, screen, 'engagement'), {
                section_name: sectionName
              });
              logSection(sectionName);
            }
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.keys(SECTION_NAMES).forEach(function (selector) {
      var el = document.querySelector(selector);
      if (el) {
        el.setAttribute('data-section-name', SECTION_NAMES[selector]);
        sectionObserver.observe(el);
      }
    });
  }

})();
