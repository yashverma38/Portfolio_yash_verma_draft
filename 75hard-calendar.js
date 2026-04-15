(function () {
  var data = window.CAL_DATA || [];
  var grid = document.getElementById('calGrid');
  var modal = document.getElementById('calModal');
  var modalBackdrop = document.getElementById('calModalBackdrop');
  var modalCloseBtn = document.getElementById('calModalClose');
  var modalContent = document.getElementById('calModalContent');
  var weekNav = document.getElementById('weekNav');
  var weekLabel = document.getElementById('weekLabel');
  var weekPrev = document.getElementById('weekPrev');
  var weekNext = document.getElementById('weekNext');

  var currentView = 'month';
  var currentWeek = 0;
  var filterCategory = 'all';
  var filterFormat = 'all';
  var TOTAL_PLANNED = data.length;

  var CATEGORY_LABELS = {
    discipline: 'Discipline',
    productivity: 'Productivity',
    startup: 'Startup',
    books: 'Books',
    personal: 'Personal',
    reflection: 'Reflection'
  };

  // --- Rendering ---
  function renderGrid() {
    grid.innerHTML = '';
    grid.className = currentView === 'week' ? 'cal-grid cal-grid--week' : 'cal-grid';

    var filtered = data.filter(function (item) {
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (filterFormat !== 'all' && item.format !== filterFormat) return false;
      if (currentView === 'week') {
        var weekStart = currentWeek * 7 + 1;
        var weekEnd = weekStart + 6;
        if (item.day < weekStart || item.day > weekEnd) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 2rem;">No days match the current filters.</p>';
      return;
    }

    filtered.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'cal-day';
      card.setAttribute('data-pillar', item.category);
      card.setAttribute('data-day', item.day);

      card.innerHTML =
        '<div class="cal-day__header">' +
          '<span class="cal-day__number">' + item.day + '</span>' +
          '<span class="cal-day__badge">' + (CATEGORY_LABELS[item.category] || item.category) + '</span>' +
        '</div>' +
        '<span class="cal-day__topic">' + escapeHTML(item.title) + '</span>' +
        '<div class="cal-day__header" style="margin-top:auto">' +
          '<div class="cal-day__platforms">' +
            '<span class="cal-day__platform-dot cal-day__platform-dot--ig" title="Instagram"></span>' +
            '<span class="cal-day__platform-dot cal-day__platform-dot--x" title="X/Twitter"></span>' +
          '</div>' +
          '<span class="cal-day__format-badge">' + item.format + '</span>' +
        '</div>';

      card.addEventListener('click', function () {
        openModal(item);
      });

      grid.appendChild(card);
    });
  }

  // --- Modal ---
  function openModal(item) {
    document.getElementById('modalDay').textContent = 'Day ' + item.day;
    var pillarEl = document.getElementById('modalPillar');
    pillarEl.textContent = CATEGORY_LABELS[item.category] || item.category;
    pillarEl.setAttribute('data-pillar', item.category);
    modalContent.setAttribute('data-pillar', item.category);

    document.getElementById('modalFormat').textContent = item.format === 'reel' ? 'Reel' : 'Carousel';
    document.getElementById('modalTitle').textContent = item.title;

    var body = document.getElementById('modalBody');
    var html = '';

    // --- Bloc Easter Egg production note ---
    if (item.blocHint) {
      html += '<div class="cal-bloc-hint">' +
        '<div class="cal-bloc-hint__label">&#127916; Bloc Easter Egg</div>' +
        '<div class="cal-bloc-hint__text">' + escapeHTML(item.blocHint) + '</div>' +
      '</div>';
    }

    // --- Instagram section ---
    if (item.format === 'reel' && item.reel) {
      html += '<div class="cal-section-header">Instagram Reel (' + escapeHTML(item.reel.duration) + ')</div>';

      // Music
      if (item.reel.music) {
        html += '<div class="cal-music">' +
          '<span class="cal-music__icon">&#9835;</span>' +
          '<div class="cal-music__info">' +
            '<span class="cal-music__track">' + escapeHTML(item.reel.music.track) + '</span>' +
            '<span class="cal-music__mood">' + escapeHTML(item.reel.music.mood) + '</span>' +
          '</div>' +
        '</div>';
      }

      // Scenes
      html += '<div class="cal-scenes">';
      item.reel.scenes.forEach(function (scene) {
        var cls = scene.type === 'a-roll' ? 'cal-scene cal-scene--a-roll' : 'cal-scene cal-scene--b-roll';
        var typeLabel = scene.type === 'a-roll' ? 'A-Roll' : 'B-Roll';
        var text = scene.type === 'a-roll'
          ? '<p class="cal-scene__script">&ldquo;' + escapeHTML(scene.script) + '&rdquo;</p>'
          : '<p class="cal-scene__script">' + escapeHTML(scene.description) + '</p>';

        html += '<div class="' + cls + '">' +
          '<div class="cal-scene__header">' +
            '<span class="cal-scene__type">' + typeLabel + '</span>' +
            '<span class="cal-scene__time">' + escapeHTML(scene.time) + '</span>' +
          '</div>' +
          '<div class="cal-scene__body">' +
            text +
            '<p class="cal-scene__visual">' + escapeHTML(scene.visual) + '</p>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';

      // Caption
      html += '<div class="cal-caption">' +
        '<div class="cal-caption__label">Caption</div>' +
        '<div class="cal-caption__text">' + escapeHTML(item.reel.caption) + '</div>' +
      '</div>';
      html += '<div class="cal-post-time">Post at ' + escapeHTML(item.reel.postTime) + '</div>';

    } else if (item.format === 'carousel' && item.carousel) {
      html += '<div class="cal-section-header">Instagram Carousel (' + item.carousel.slides.length + ' slides)</div>';

      html += '<div class="cal-slides">';
      item.carousel.slides.forEach(function (slide) {
        html += '<div class="cal-slide">' +
          '<div class="cal-slide__number">Slide ' + slide.number + '</div>' +
          '<div class="cal-slide__headline">' + escapeHTML(slide.headline) + '</div>' +
          '<div class="cal-slide__body">' + escapeHTML(slide.body) + '</div>' +
          '<div class="cal-slide__visual">' + escapeHTML(slide.visual) + '</div>' +
        '</div>';
      });
      html += '</div>';

      html += '<div class="cal-caption">' +
        '<div class="cal-caption__label">Caption</div>' +
        '<div class="cal-caption__text">' + escapeHTML(item.carousel.caption) + '</div>' +
      '</div>';
      html += '<div class="cal-post-time">Post at ' + escapeHTML(item.carousel.postTime) + '</div>';
    }

    // --- X Thread section ---
    if (item.thread) {
      html += '<div class="cal-section-header">X Thread (' + item.thread.tweets.length + ' tweets)</div>';
      html += '<div class="cal-tweets">';
      item.thread.tweets.forEach(function (tweet, i) {
        html += '<div class="cal-tweet">' +
          '<div class="cal-tweet__number">' + (i + 1) + '/' + item.thread.tweets.length + '</div>' +
          '<div class="cal-tweet__text">' + escapeHTML(tweet) + '</div>' +
        '</div>';
      });
      html += '</div>';
      html += '<div class="cal-post-time">Post at ' + escapeHTML(item.thread.postTime) + '</div>';
    }

    // --- Stories section ---
    if (item.stories) {
      html += '<div class="cal-section-header">Daily Tracker (Stories)</div>';
      html += '<div class="cal-stories">';
      if (item.stories.gym) {
        html += '<div class="cal-story">' +
          '<div class="cal-story__label">Gym</div>' +
          '<div class="cal-story__text">' + escapeHTML(item.stories.gym) + '</div>' +
        '</div>';
      }
      if (item.stories.food) {
        html += '<div class="cal-story">' +
          '<div class="cal-story__label">Food</div>' +
          '<div class="cal-story__text">' + escapeHTML(item.stories.food) + '</div>' +
        '</div>';
      }
      html += '</div>';
    }

    body.innerHTML = html;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- View toggle ---
  document.querySelectorAll('.cal-view-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelector('.cal-view-btn--active').classList.remove('cal-view-btn--active');
      btn.classList.add('cal-view-btn--active');
      currentView = btn.getAttribute('data-view');
      weekNav.classList.toggle('is-visible', currentView === 'week');
      renderGrid();
    });
  });

  // --- Week navigation ---
  var maxWeek = Math.ceil(TOTAL_PLANNED / 7) - 1;

  function updateWeekLabel() {
    var start = currentWeek * 7 + 1;
    var end = Math.min(start + 6, TOTAL_PLANNED);
    weekLabel.textContent = 'Week ' + (currentWeek + 1) + ' (Days ' + start + '\u2013' + end + ')';
    weekPrev.disabled = currentWeek === 0;
    weekNext.disabled = currentWeek >= maxWeek;
  }

  weekPrev.addEventListener('click', function () {
    if (currentWeek > 0) { currentWeek--; updateWeekLabel(); renderGrid(); }
  });

  weekNext.addEventListener('click', function () {
    if (currentWeek < maxWeek) { currentWeek++; updateWeekLabel(); renderGrid(); }
  });

  // --- Filters ---
  document.getElementById('filterPillar').addEventListener('change', function (e) {
    filterCategory = e.target.value;
    renderGrid();
  });

  document.getElementById('filterFormat').addEventListener('change', function (e) {
    filterFormat = e.target.value;
    renderGrid();
  });

  // --- Modal close handlers ---
  modalBackdrop.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // --- Progress ---
  function updateProgress() {
    var pct = Math.round((TOTAL_PLANNED / 75) * 100);
    document.getElementById('calProgressFill').style.width = pct + '%';
    document.getElementById('calProgressText').textContent = TOTAL_PLANNED + ' of 75 days planned';
  }

  // --- Utilities ---
  function escapeHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Init ---
  updateProgress();
  updateWeekLabel();
  renderGrid();
})();
