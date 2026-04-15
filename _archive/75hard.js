(function () {
  var data = window.ENG_DATA || [];
  var START_DATE = new Date('2026-03-01'); // UPDATE THIS to your actual Day 1
  var LS_PREFIX = '75hard_';

  var CATEGORY_LABELS = {
    tip: 'Business Tip',
    fitness: 'Fitness Challenge',
    quiz: 'Quiz',
    surprise: 'Surprise'
  };

  // --- Date Logic ---
  function getCurrentDay() {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var start = new Date(START_DATE);
    start.setHours(0, 0, 0, 0);
    var diff = Math.floor((now - start) / (86400000)) + 1;
    return Math.max(1, Math.min(diff, 75));
  }

  function isUnlocked(day) {
    return day <= getCurrentDay();
  }

  function isToday(day) {
    return day === getCurrentDay();
  }

  // --- Streak Tracking ---
  function updateStreak() {
    var streak = parseInt(localStorage.getItem(LS_PREFIX + 'streak') || '0', 10);
    var lastVisit = localStorage.getItem(LS_PREFIX + 'lastVisit');
    var today = new Date().toDateString();

    if (lastVisit === today) {
      return streak;
    }

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastVisit === yesterday.toDateString()) {
      streak++;
    } else {
      streak = 1;
    }

    localStorage.setItem(LS_PREFIX + 'streak', streak.toString());
    localStorage.setItem(LS_PREFIX + 'lastVisit', today);
    return streak;
  }

  // --- Quiz Score ---
  function getQuizScore() {
    return parseInt(localStorage.getItem(LS_PREFIX + 'quizScore') || '0', 10);
  }

  function addQuizPoint() {
    var score = getQuizScore() + 1;
    localStorage.setItem(LS_PREFIX + 'quizScore', score.toString());
    return score;
  }

  function isQuizAnswered(day) {
    return localStorage.getItem(LS_PREFIX + 'quiz_' + day) !== null;
  }

  function markQuizAnswered(day, correct) {
    localStorage.setItem(LS_PREFIX + 'quiz_' + day, correct ? '1' : '0');
  }

  // --- Cards Opened ---
  function getOpenedCards() {
    try {
      return JSON.parse(localStorage.getItem(LS_PREFIX + 'opened') || '[]');
    } catch (e) {
      return [];
    }
  }

  function markCardOpened(day) {
    var opened = getOpenedCards();
    if (opened.indexOf(day) === -1) {
      opened.push(day);
      localStorage.setItem(LS_PREFIX + 'opened', JSON.stringify(opened));
    }
    return opened.length;
  }

  // --- Rendering ---
  function renderStats() {
    var currentDay = getCurrentDay();
    var streak = updateStreak();
    document.getElementById('statDay').textContent = currentDay;
    document.getElementById('statStreak').textContent = streak;
    document.getElementById('statScore').textContent = getQuizScore();
    document.getElementById('statUnlocked').textContent = getOpenedCards().length;

    var pct = Math.round((currentDay / 75) * 100);
    document.getElementById('engProgressFill').style.width = pct + '%';
    document.getElementById('engProgressText').textContent = 'Day ' + currentDay + ' of 75';
  }

  function renderTodayCard() {
    var todayIdx = getCurrentDay() - 1;
    if (todayIdx < 0 || todayIdx >= data.length) return;
    var item = data[todayIdx];
    var container = document.getElementById('todayCard');
    container.setAttribute('data-category', item.category);
    container.innerHTML = buildCardContent(item, true);
    attachQuizHandlers(container, item);
    markCardOpened(item.day);
  }

  function renderGrid() {
    var gridEl = document.getElementById('engGrid');
    var activeFilter = document.querySelector('.eng-pill--active').getAttribute('data-category');
    gridEl.innerHTML = '';

    data.forEach(function (item) {
      if (activeFilter !== 'all' && item.category !== activeFilter) return;

      var card = document.createElement('div');
      card.className = 'eng-card';
      card.setAttribute('data-category', item.category);
      card.setAttribute('data-day', item.day);

      var unlocked = isUnlocked(item.day);
      var today = isToday(item.day);

      if (!unlocked) {
        card.classList.add('eng-card--locked');
        card.innerHTML =
          '<span class="eng-card__day">' + item.day + '</span>' +
          '<span class="eng-card__lock">&#128274;</span>';
      } else {
        if (today) card.classList.add('eng-card--today');
        card.classList.add('eng-card--unlocked');
        card.innerHTML =
          '<span class="eng-card__day">' + item.day + '</span>' +
          '<span class="eng-card__badge">' + (CATEGORY_LABELS[item.category] || item.category) + '</span>' +
          '<span class="eng-card__title">' + escapeHTML(item.title) + '</span>';

        card.addEventListener('click', function () {
          openDrawer(item);
        });
      }

      gridEl.appendChild(card);
    });
  }

  function openDrawer(item) {
    var drawer = document.getElementById('engDrawer');
    var content = document.getElementById('engDrawerContent');
    content.setAttribute('data-category', item.category);
    content.innerHTML =
      '<div class="eng-featured" data-category="' + item.category + '">' +
        buildCardContent(item, false) +
      '</div>';
    attachQuizHandlers(content, item);
    markCardOpened(item.day);
    renderStats();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeDrawer() {
    var drawer = document.getElementById('engDrawer');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function buildCardContent(item, isFeatured) {
    var badge = '<span class="eng-featured__badge" data-category="' + item.category + '">' +
      (CATEGORY_LABELS[item.category] || item.category) + '</span>';
    var title = '<h3 class="eng-featured__title">' + escapeHTML(item.title) + '</h3>';
    var html = badge + title;

    var c = item.content;
    switch (item.category) {
      case 'tip':
        html += '<p class="eng-featured__text">' + escapeHTML(c.text) + '</p>';
        if (c.takeaway) {
          html += '<div class="eng-featured__takeaway">' + escapeHTML(c.takeaway) + '</div>';
        }
        break;

      case 'fitness':
        html += '<p class="eng-featured__challenge">' + escapeHTML(c.challenge) + '</p>';
        if (c.tip) {
          html += '<p class="eng-featured__text">' + escapeHTML(c.tip) + '</p>';
        }
        if (c.sharePrompt) {
          html += '<p class="eng-featured__share">' + escapeHTML(c.sharePrompt) + '</p>';
        }
        break;

      case 'quiz':
        html += '<p class="eng-featured__text">' + escapeHTML(c.question) + '</p>';
        var answered = isQuizAnswered(item.day);
        var storedAnswer = localStorage.getItem(LS_PREFIX + 'quiz_' + item.day);
        html += '<div class="eng-quiz-options" data-day="' + item.day + '" data-correct="' + c.correctIndex + '">';
        c.options.forEach(function (opt, i) {
          var cls = 'eng-quiz-option';
          if (answered) {
            cls += ' eng-quiz-option--answered';
            if (i === c.correctIndex) cls += ' eng-quiz-option--correct';
            else if (storedAnswer === '0' && i !== c.correctIndex) cls += ' eng-quiz-option--wrong';
          }
          html += '<button class="' + cls + '" data-index="' + i + '">' + escapeHTML(opt) + '</button>';
        });
        html += '</div>';
        html += '<div class="eng-quiz-explanation' + (answered ? ' is-visible' : '') + '">' +
          escapeHTML(c.explanation) + '</div>';
        break;

      case 'surprise':
        if (c.type) {
          html += '<span class="eng-featured__surprise-type">' + escapeHTML(c.type) + '</span>';
        }
        if (c.text) {
          html += '<p class="eng-featured__text">' + escapeHTML(c.text) + '</p>';
        }
        if (c.why) {
          html += '<p class="eng-featured__text">' + escapeHTML(c.why) + '</p>';
        }
        if (c.link) {
          html += '<a class="eng-featured__link" href="' + escapeHTML(c.link) + '" target="_blank" rel="noreferrer">Check it out &rarr;</a>';
        }
        break;
    }

    return html;
  }

  function attachQuizHandlers(container, item) {
    if (item.category !== 'quiz' || isQuizAnswered(item.day)) return;

    var options = container.querySelectorAll('.eng-quiz-option');
    var explanationEl = container.querySelector('.eng-quiz-explanation');

    options.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var correct = idx === item.content.correctIndex;

        markQuizAnswered(item.day, correct);
        if (correct) addQuizPoint();

        options.forEach(function (opt, i) {
          opt.classList.add('eng-quiz-option--answered');
          if (i === item.content.correctIndex) {
            opt.classList.add('eng-quiz-option--correct');
          } else if (i === idx && !correct) {
            opt.classList.add('eng-quiz-option--wrong');
          }
        });

        if (explanationEl) explanationEl.classList.add('is-visible');
        renderStats();
      });
    });
  }

  // --- Filter pills ---
  document.querySelectorAll('.eng-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelector('.eng-pill--active').classList.remove('eng-pill--active');
      pill.classList.add('eng-pill--active');
      renderGrid();
    });
  });

  // --- Drawer close ---
  document.getElementById('engDrawerClose').addEventListener('click', closeDrawer);

  // --- Utilities ---
  function escapeHTML(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Init ---
  renderStats();
  renderTodayCard();
  renderGrid();
})();
