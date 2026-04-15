/* ============================================
   YASH — CONTENT HUB v2 SCRIPTS
   Data-driven: reads from /data/*.json
   ============================================ */

// --- Constants ---
const ACTIVITIES_URL = 'data/activities.json';
const VIDEO_URL = 'data/video.json';

// --- Mobile nav toggle ---
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => siteNav.classList.toggle('is-open'));
  siteNav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => siteNav.classList.remove('is-open'))
  );
  document.addEventListener('click', e => {
    if (!menuToggle.contains(e.target) && !siteNav.contains(e.target)) {
      siteNav.classList.remove('is-open');
    }
  });
}

// --- Hero entrance animation ---
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-animated');
})();

// --- Scroll reveal ---
function initScrollReveal(root) {
  const els = (root || document).querySelectorAll('.reveal:not(.is-visible)');
  if (els.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    els.forEach(el => observer.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }
}

initScrollReveal();

// --- Mini-game widget toggle ---
const miniGameToggle = document.getElementById('miniGameToggle');
const miniGamePanel = document.getElementById('miniGamePanel');

if (miniGameToggle && miniGamePanel) {
  miniGameToggle.addEventListener('click', e => {
    e.stopPropagation();
    miniGamePanel.classList.toggle('is-open');
  });
  document.addEventListener('click', e => {
    if (!miniGamePanel.contains(e.target) && !miniGameToggle.contains(e.target)) {
      miniGamePanel.classList.remove('is-open');
    }
  });
}

// --- Helpers ---
function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function isToday(dateStr) {
  return dateStr === new Date().toISOString().split('T')[0];
}

const TYPE_META = {
  workout: { icon: '💪', label: 'Workout', class: 'type--workout' },
  learning: { icon: '📚', label: 'Learning', class: 'type--learning' },
  building: { icon: '🛠️', label: 'Building', class: 'type--building' },
  reading: { icon: '📖', label: 'Reading', class: 'type--reading' },
  misc: { icon: '🎲', label: 'Misc', class: 'type--misc' }
};

function getTagClass(type) {
  return 'tag--' + (type || 'misc');
}

// ============================================
// FETCH DATA
// ============================================
async function fetchJSON(url) {
  try {
    const res = await fetch(url + '?t=' + Date.now()); // cache-bust
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

// ============================================
// TODAY'S VIDEO
// ============================================
async function renderVideo() {
  const videoEmbed = document.getElementById('videoEmbed');
  const videoDate = document.getElementById('videoDate');
  const videoFooter = document.getElementById('videoFooter');
  const videoLink = document.getElementById('videoLink');
  if (!videoEmbed) return;

  const today = new Date().toISOString().split('T')[0];
  videoDate.textContent = formatDateLabel(today);

  const video = await fetchJSON(VIDEO_URL);

  if (video && video.url && video.url.trim()) {
    const url = video.url.trim();
    let embedUrl = url;

    // Convert instagram.com/reel/xxx/ to embed
    if (url.includes('instagram.com')) {
      const match = url.match(/instagram\.com\/(reel|p)\/([^/?]+)/);
      if (match) {
        embedUrl = `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
      }
    }

    videoEmbed.innerHTML = `<iframe src="${embedUrl}" allowfullscreen loading="lazy" title="Today's Instagram Reel"></iframe>`;

    if (videoFooter && videoLink) {
      videoLink.href = url;
      videoFooter.style.display = 'block';
    }
  } else {
    videoEmbed.innerHTML = `
      <div class="video-card__placeholder">
        <div class="video-card__placeholder-icon">📹</div>
        <p>No video posted yet today.<br/>Check back later or see the latest on <a href="https://instagram.com" target="_blank" rel="noreferrer" style="color: var(--accent); font-weight: 600;">Instagram</a>.</p>
      </div>
    `;
  }
}

// ============================================
// TIMELINE
// ============================================
async function renderTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  let entries = await fetchJSON(ACTIVITIES_URL);
  if (!entries || entries.length === 0) {
    timeline.innerHTML = `
      <div class="feed__empty">
        <div class="feed__empty-icon">📝</div>
        <p>No entries yet. Check back soon!</p>
      </div>
    `;
    return;
  }

  // Sort by date descending
  entries.sort((a, b) => {
    const dc = b.date.localeCompare(a.date);
    if (dc !== 0) return dc;
    return (b.id || '').localeCompare(a.id || '');
  });

  // Group by date
  const groups = {};
  entries.forEach(entry => {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
  });

  let html = '';
  const dates = Object.keys(groups).sort().reverse();

  dates.forEach(date => {
    const label = isToday(date) ? `Today — ${formatShortDate(date)}` : formatDateLabel(date);

    html += `
      <div class="timeline__date reveal">
        <div class="timeline__date-dot"></div>
        <span class="timeline__date-text">${label}</span>
      </div>
    `;

    groups[date].forEach(entry => {
      const meta = TYPE_META[entry.type] || TYPE_META.misc;
      const tagsHtml = (entry.tags || []).map(t =>
        `<span class="tag ${getTagClass(entry.type)}">${t}</span>`
      ).join('');

      html += `
        <article class="timeline__entry reveal">
          <div class="timeline__entry-header">
            <span class="timeline__entry-icon">${meta.icon}</span>
            <span class="timeline__entry-type ${meta.class}">${meta.label}</span>
          </div>
          <h3 class="timeline__entry-title">${entry.title}</h3>
          ${entry.description ? `<p class="timeline__entry-desc">${entry.description}</p>` : ''}
          ${tagsHtml ? `<div class="timeline__entry-tags">${tagsHtml}</div>` : ''}
        </article>
      `;
    });
  });

  timeline.innerHTML = html;
  initScrollReveal(timeline);
}

// --- Init ---
renderVideo();
renderTimeline();

// --- Hero parallax ---
(function () {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const jordan = hero.querySelector('.hero__jordan');
  const skateboard = hero.querySelector('.hero__skateboard');
  if (!jordan && !skateboard) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const heroH = hero.offsetHeight;
        if (scrollY < heroH) {
          const p = scrollY / heroH;
          if (jordan) jordan.style.transform = `translateY(${-16 + p * 24}px) rotate(${-4 + p * 6}deg)`;
          if (skateboard) skateboard.style.transform = `translateX(${p * 20}px) rotate(${p * 5}deg)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
