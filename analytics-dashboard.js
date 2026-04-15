/* ============================================
   ANALYTICS DASHBOARD — Chart.js Rendering
   Fetches data from Mixpanel via OAuth MCP proxy
   and renders charts using Chart.js
   ============================================ */

(function () {
  'use strict';

  // --- Mixpanel API config ---
  var PROJECT_ID = 3851631;
  var TOKEN = 'AJgUsAYRikwVVUhUofXEBxhNCZuzYE';
  var MCP_URL = 'https://mcp.mixpanel.com/mcp';

  // --- Chart.js color palette (matches portfolio design tokens) ---
  var COLORS = {
    ocean: 'rgba(45, 106, 138, 1)',
    oceanSoft: 'rgba(45, 106, 138, 0.15)',
    sunrise: 'rgba(217, 119, 86, 1)',
    sunriseSoft: 'rgba(217, 119, 86, 0.15)',
    sage: 'rgba(90, 143, 107, 1)',
    sageSoft: 'rgba(90, 143, 107, 0.15)',
    sand: 'rgba(184, 146, 58, 1)',
    sandSoft: 'rgba(184, 146, 58, 0.15)',
    plum: 'rgba(139, 111, 138, 1)',
    plumSoft: 'rgba(139, 111, 138, 0.15)',
    text: 'rgba(26, 46, 59, 1)',
    textSecondary: 'rgba(77, 100, 117, 1)',
    border: 'rgba(26, 46, 59, 0.08)',
    gridLine: 'rgba(26, 46, 59, 0.06)'
  };

  var CHART_COLORS = [
    COLORS.ocean, COLORS.sunrise, COLORS.sage, COLORS.sand, COLORS.plum
  ];
  var CHART_BG = [
    COLORS.oceanSoft, COLORS.sunriseSoft, COLORS.sageSoft, COLORS.sandSoft, COLORS.plumSoft
  ];

  // --- Chart.js defaults ---
  Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = COLORS.textSecondary;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(26, 46, 59, 0.92)';
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 10;

  // --- Date helpers ---
  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // --- MCP query helper ---
  function mcpQuery(toolName, args) {
    return fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Math.random().toString(36).slice(2),
        method: 'tools/call',
        params: { name: toolName, arguments: args }
      })
    })
      .then(function (res) { return res.text(); })
      .then(function (raw) {
        var lines = raw.split('\n');
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].indexOf('data: ') === 0) {
            var outer = JSON.parse(lines[i].substring(6));
            var text = outer.result.content[0].text;
            var inner = JSON.parse(text);
            var innerText = inner.content[0].text;
            innerText = innerText
              .replace(/None/g, 'null')
              .replace(/True/g, 'true')
              .replace(/False/g, 'false')
              .replace(/'/g, '"');
            return JSON.parse(innerText);
          }
        }
        throw new Error('No data in response');
      });
  }

  function segQuery(event, fromDate, toDate, unit, opts) {
    var args = {
      project_id: PROJECT_ID,
      event: event,
      from_date: fromDate,
      to_date: toDate,
      unit: unit
    };
    if (opts) {
      if (opts.on) args.on = opts.on;
      if (opts.type) args.type = opts.type;
      if (opts.where) args.where = opts.where;
    }
    return mcpQuery('run_segmentation_query', args);
  }

  // --- Extract series from segmentation response ---
  function extractSeries(data, eventName) {
    var series = data.data.series;
    var values = data.data.values[eventName] || {};
    return {
      labels: series.map(formatDate),
      data: series.map(function (d) { return values[d] || 0; })
    };
  }

  function sumValues(valuesObj) {
    var total = 0;
    for (var k in valuesObj) {
      total += valuesObj[k];
    }
    return total;
  }

  // --- Show/hide loading states ---
  function showChart(containerId) {
    var el = document.getElementById(containerId);
    if (el) {
      var placeholder = el.closest('.dash-chart').querySelector('.dash-chart__loading');
      if (placeholder) placeholder.style.display = 'none';
      el.style.display = 'block';
    }
  }

  function showError(containerId, msg) {
    var el = document.getElementById(containerId);
    if (el) {
      var placeholder = el.closest('.dash-chart').querySelector('.dash-chart__loading');
      if (placeholder) {
        placeholder.textContent = msg || 'Could not load data';
        placeholder.style.color = 'var(--text-tertiary)';
      }
    }
  }

  // --- Stat card update ---
  function updateStat(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // --- Common chart options ---
  var lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, maxTicksLimit: 7 }
      },
      y: {
        beginAtZero: true,
        grid: { color: COLORS.gridLine },
        ticks: { precision: 0 }
      }
    },
    plugins: { legend: { display: false } },
    elements: {
      point: { radius: 3, hoverRadius: 6 },
      line: { tension: 0.3 }
    }
  };

  // ===================================
  //  RENDER ALL CHARTS
  // ===================================
  function renderDashboard() {
    var from = daysAgo(30);
    var to = today();

    // --- 1. TOTAL PAGE VIEWS (line chart) ---
    segQuery('$mp_web_page_view', from, to, 'day')
      .then(function (data) {
        var s = extractSeries(data, '$mp_web_page_view');
        var total = s.data.reduce(function (a, b) { return a + b; }, 0);
        updateStat('stat-pageviews', total.toLocaleString());
        showChart('chart-pageviews');
        new Chart(document.getElementById('chart-pageviews'), {
          type: 'line',
          data: {
            labels: s.labels,
            datasets: [{
              label: 'Page Views',
              data: s.data,
              borderColor: COLORS.ocean,
              backgroundColor: COLORS.oceanSoft,
              fill: true,
              borderWidth: 2
            }]
          },
          options: lineOpts
        });
      })
      .catch(function () { showError('chart-pageviews', 'Unable to load page view data'); });

    // --- 2. UNIQUE VISITORS (line chart) ---
    segQuery('$mp_web_page_view', from, to, 'day', { type: 'unique' })
      .then(function (data) {
        var s = extractSeries(data, '$mp_web_page_view');
        var total = s.data.reduce(function (a, b) { return a + b; }, 0);
        updateStat('stat-visitors', total.toLocaleString());
        showChart('chart-visitors');
        new Chart(document.getElementById('chart-visitors'), {
          type: 'line',
          data: {
            labels: s.labels,
            datasets: [{
              label: 'Unique Visitors',
              data: s.data,
              borderColor: COLORS.sunrise,
              backgroundColor: COLORS.sunriseSoft,
              fill: true,
              borderWidth: 2
            }]
          },
          options: lineOpts
        });
      })
      .catch(function () { showError('chart-visitors', 'Unable to load visitor data'); });

    // --- 3. TOP PAGES (horizontal bar chart) ---
    segQuery('$mp_web_page_view', from, to, 'day', { on: 'properties["$current_url"]' })
      .then(function (data) {
        var pageTotals = {};
        for (var url in data.data.values) {
          var total = sumValues(data.data.values[url]);
          if (total > 0) {
            // Clean URL to page name
            var name = url.replace(/https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/';
            // Skip Vercel preview URLs and local files
            if (url.indexOf('vercel.app') > -1 || url.indexOf('file://') === 0 || url.indexOf('lovable.app') > -1) continue;
            // Aggregate same paths
            if (pageTotals[name]) pageTotals[name] += total;
            else pageTotals[name] = total;
          }
        }
        var sorted = Object.keys(pageTotals).sort(function (a, b) { return pageTotals[b] - pageTotals[a]; }).slice(0, 8);
        var labels = sorted.map(function (p) {
          var names = { '/': 'Home', '/work.html': 'Work', '/about.html': 'About', '/contact.html': 'Contact', '/case-study-1.html': 'Ads on Speaker', '/case-study-2.html': 'Credit Line', '/case-study-3.html': 'Stolo UX', '/case-study-4.html': 'bloc', '/75hard.html': '75 Hard', '/splitwise': 'Splitwise' };
          return names[p] || p;
        });
        var vals = sorted.map(function (p) { return pageTotals[p]; });
        var totalPages = sorted.length;
        updateStat('stat-pages', totalPages);
        showChart('chart-top-pages');
        new Chart(document.getElementById('chart-top-pages'), {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Views',
              data: vals,
              backgroundColor: CHART_COLORS.concat(CHART_COLORS).slice(0, labels.length).map(function (c) { return c.replace('1)', '0.8)'); }),
              borderColor: CHART_COLORS.concat(CHART_COLORS).slice(0, labels.length),
              borderWidth: 1,
              borderRadius: 6
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { beginAtZero: true, grid: { color: COLORS.gridLine }, ticks: { precision: 0 } },
              y: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
          }
        });
      })
      .catch(function () { showError('chart-top-pages', 'Unable to load top pages data'); });

    // --- 4. SCROLL DEPTH (bar chart) ---
    var scrollEvents = [
      'scroll_page_page_content_home_engagement_portfolio',
      'scroll_page_page_content_work_engagement_portfolio',
      'scroll_page_page_content_bloc_engagement_portfolio',
      'scroll_page_page_content_unknown_engagement_portfolio'
    ];
    var scrollPromises = scrollEvents.map(function (evt) {
      return segQuery(evt, from, to, 'day', { on: 'properties["depth"]' })
        .then(function (data) { return data; })
        .catch(function () { return null; });
    });
    Promise.all(scrollPromises).then(function (results) {
      var depths = { '25': 0, '50': 0, '75': 0, '100': 0 };
      results.forEach(function (data) {
        if (!data) return;
        for (var depth in data.data.values) {
          if (depths.hasOwnProperty(depth)) {
            depths[depth] += sumValues(data.data.values[depth]);
          }
        }
      });
      var totalScrolls = depths['25'] + depths['50'] + depths['75'] + depths['100'];
      updateStat('stat-scrolls', totalScrolls);
      showChart('chart-scroll-depth');
      new Chart(document.getElementById('chart-scroll-depth'), {
        type: 'bar',
        data: {
          labels: ['25%', '50%', '75%', '100%'],
          datasets: [{
            label: 'Scroll Events',
            data: [depths['25'], depths['50'], depths['75'], depths['100']],
            backgroundColor: [
              COLORS.ocean.replace('1)', '0.8)'),
              COLORS.sunrise.replace('1)', '0.8)'),
              COLORS.sage.replace('1)', '0.8)'),
              COLORS.sand.replace('1)', '0.8)')
            ],
            borderColor: [COLORS.ocean, COLORS.sunrise, COLORS.sage, COLORS.sand],
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: COLORS.gridLine }, ticks: { precision: 0 } }
          },
          plugins: { legend: { display: false } }
        }
      });
    });

    // --- 5. SECTION VIEWS (horizontal bar) ---
    var sectionEvents = [
      { name: 'view_section_hero_home_engagement_portfolio', label: 'Hero (Home)' },
      { name: 'view_section_work_cards_home_engagement_portfolio', label: 'Work Cards (Home)' },
      { name: 'view_section_work_cards_work_engagement_portfolio', label: 'Work Cards (Work)' },
      { name: 'view_section_side_projects_home_engagement_portfolio', label: 'Side Projects (Home)' },
      { name: 'view_section_side_projects_work_engagement_portfolio', label: 'Side Projects (Work)' },
      { name: 'view_section_about_teaser_home_engagement_portfolio', label: 'About Teaser (Home)' },
      { name: 'view_section_cs_hero_bloc_engagement_portfolio', label: 'CS Hero (bloc)' },
      { name: 'view_section_cs_meta_bloc_engagement_portfolio', label: 'CS Meta (bloc)' },
      { name: 'view_section_metrics_bloc_engagement_portfolio', label: 'Metrics (bloc)' },
      { name: 'view_section_learnings_bloc_engagement_portfolio', label: 'Learnings (bloc)' },
      { name: 'view_section_cs_nav_bloc_engagement_portfolio', label: 'CS Nav (bloc)' },
      { name: 'view_section_page_hero_work_engagement_portfolio', label: 'Hero (Work)' }
    ];
    var sectionPromises = sectionEvents.map(function (evt) {
      return segQuery(evt.name, from, to, 'day')
        .then(function (data) {
          return { label: evt.label, total: sumValues(data.data.values[evt.name] || {}) };
        })
        .catch(function () { return { label: evt.label, total: 0 }; });
    });
    Promise.all(sectionPromises).then(function (results) {
      results.sort(function (a, b) { return b.total - a.total; });
      var nonZero = results.filter(function (r) { return r.total > 0; });
      if (nonZero.length === 0) nonZero = results.slice(0, 5);
      var totalSectionViews = nonZero.reduce(function (a, b) { return a + b.total; }, 0);
      updateStat('stat-sections', totalSectionViews);
      showChart('chart-section-views');
      new Chart(document.getElementById('chart-section-views'), {
        type: 'bar',
        data: {
          labels: nonZero.map(function (r) { return r.label; }),
          datasets: [{
            label: 'Views',
            data: nonZero.map(function (r) { return r.total; }),
            backgroundColor: COLORS.plum.replace('1)', '0.7)'),
            borderColor: COLORS.plum,
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { beginAtZero: true, grid: { color: COLORS.gridLine }, ticks: { precision: 0 } },
            y: { grid: { display: false } }
          },
          plugins: { legend: { display: false } }
        }
      });
    });

    // --- 6. CLICK EVENTS (doughnut chart) ---
    var clickEvents = [
      { name: 'tap_card_work_cards_home_discovery_portfolio', label: 'Work Cards (Home)' },
      { name: 'tap_card_work_cards_work_discovery_portfolio', label: 'Work Cards (Work)' },
      { name: 'tap_link_header_nav_bloc_navigation_portfolio', label: 'Header Nav' },
      { name: 'tap_link_side_projects_work_discovery_portfolio', label: 'Side Projects' }
    ];
    var clickPromises = clickEvents.map(function (evt) {
      return segQuery(evt.name, from, to, 'day')
        .then(function (data) {
          return { label: evt.label, total: sumValues(data.data.values[evt.name] || {}) };
        })
        .catch(function () { return { label: evt.label, total: 0 }; });
    });
    Promise.all(clickPromises).then(function (results) {
      var nonZero = results.filter(function (r) { return r.total > 0; });
      if (nonZero.length === 0) nonZero = results;
      var totalClicks = nonZero.reduce(function (a, b) { return a + b.total; }, 0);
      updateStat('stat-clicks', totalClicks);
      showChart('chart-clicks');
      new Chart(document.getElementById('chart-clicks'), {
        type: 'doughnut',
        data: {
          labels: nonZero.map(function (r) { return r.label; }),
          datasets: [{
            data: nonZero.map(function (r) { return r.total; }),
            backgroundColor: CHART_COLORS.slice(0, nonZero.length).map(function (c) { return c.replace('1)', '0.8)'); }),
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: { padding: 16 }
            }
          }
        }
      });
    });
  }

  // ===================================
  //  YOUR ACTIVITY (localStorage)
  // ===================================
  var LOCAL_KEY = 'yv_activity';

  var PAGE_LABELS = {
    'home': 'Home',
    'work': 'Work',
    'about': 'About',
    'contact': 'Contact',
    'ads_on_speaker': 'Ads on Speaker',
    'credit_line_upi': 'Credit Line',
    'stolo_ux': 'Stolo UX',
    'bloc': 'bloc',
    '75hard': '75 Hard',
    'analytics': 'Analytics',
    'unknown': 'Other'
  };

  var EVENT_LABELS = {
    'view_page': 'Viewed page',
    'tap_link': 'Clicked a link',
    'tap_button': 'Clicked a button',
    'tap_card': 'Clicked a card',
    'tap_logo': 'Clicked the logo',
    'toggle_menu': 'Toggled the menu',
    'scroll_page': 'Scrolled the page',
    'view_section': 'Saw a section',
    'focus_form': 'Focused the contact form',
    'submit_form': 'Submitted the contact form'
  };

  function timeAgo(dateStr) {
    var now = new Date();
    var then = new Date(dateStr);
    var diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    var days = Math.floor(diff / 86400);
    if (days === 1) return 'yesterday';
    if (days < 30) return days + 'd ago';
    return Math.floor(days / 30) + 'mo ago';
  }

  function friendlyEvent(eventName) {
    for (var prefix in EVENT_LABELS) {
      if (eventName.indexOf(prefix) === 0) return EVENT_LABELS[prefix];
    }
    return eventName;
  }

  function renderYourActivity() {
    var data;
    try { data = JSON.parse(localStorage.getItem(LOCAL_KEY)); }
    catch (e) { data = null; }

    var emptyEl = document.getElementById('activity-empty');
    var filledEl = document.getElementById('activity-filled');
    if (!data || !data.totalVisits) {
      if (emptyEl) emptyEl.style.display = '';
      if (filledEl) filledEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (filledEl) filledEl.style.display = '';

    // --- Stat cards ---
    var pagesCount = data.pages ? Object.keys(data.pages).length : 0;
    var sectionsCount = data.sectionsSeen ? data.sectionsSeen.length : 0;
    var lastVisit = data.lastVisit ? timeAgo(data.lastVisit) : '—';

    var el;
    el = document.getElementById('act-total-visits');
    if (el) el.textContent = data.totalVisits;
    el = document.getElementById('act-pages-viewed');
    if (el) el.textContent = pagesCount;
    el = document.getElementById('act-sections-seen');
    if (el) el.textContent = sectionsCount;
    el = document.getElementById('act-last-visit');
    if (el) el.textContent = lastVisit;

    // --- Pages list with bar chart ---
    var pagesList = document.getElementById('act-pages-list');
    if (pagesList && data.pages) {
      var sortedPages = Object.keys(data.pages).sort(function (a, b) {
        return data.pages[b] - data.pages[a];
      });
      var maxViews = sortedPages.length > 0 ? data.pages[sortedPages[0]] : 1;
      pagesList.innerHTML = '';
      sortedPages.forEach(function (page) {
        var count = data.pages[page];
        var pct = Math.max(0, Math.min(100, Math.round((count / maxViews) * 100)));
        var label = PAGE_LABELS[page] || page;
        var li = document.createElement('li');
        var nameSpan = document.createElement('span');
        nameSpan.className = 'dash-activity-pages__name';
        nameSpan.textContent = label;
        var barOuter = document.createElement('span');
        barOuter.className = 'dash-activity-pages__bar';
        var barFill = document.createElement('span');
        barFill.className = 'dash-activity-pages__bar-fill';
        barFill.style.width = pct + '%';
        barOuter.appendChild(barFill);
        var countSpan = document.createElement('span');
        countSpan.className = 'dash-activity-pages__count';
        countSpan.textContent = count;
        li.appendChild(nameSpan);
        li.appendChild(barOuter);
        li.appendChild(countSpan);
        pagesList.appendChild(li);
      });
    }

    // --- Scroll depth list ---
    var scrollList = document.getElementById('act-scroll-list');
    if (scrollList && data.maxScroll) {
      var scrollPages = Object.keys(data.maxScroll).sort(function (a, b) {
        return data.maxScroll[b] - data.maxScroll[a];
      });
      scrollList.innerHTML = '';
      scrollPages.forEach(function (page) {
        var depth = Math.max(0, Math.min(100, data.maxScroll[page]));
        var label = PAGE_LABELS[page] || page;
        var li = document.createElement('li');
        var nameSpan = document.createElement('span');
        nameSpan.className = 'dash-activity-pages__name';
        nameSpan.textContent = label;
        var barOuter = document.createElement('span');
        barOuter.className = 'dash-activity-pages__bar';
        var barFill = document.createElement('span');
        barFill.className = 'dash-activity-pages__bar-fill';
        barFill.style.width = depth + '%';
        barOuter.appendChild(barFill);
        var countSpan = document.createElement('span');
        countSpan.className = 'dash-activity-pages__count';
        countSpan.textContent = depth + '%';
        li.appendChild(nameSpan);
        li.appendChild(barOuter);
        li.appendChild(countSpan);
        scrollList.appendChild(li);
      });
      if (scrollPages.length === 0) {
        scrollList.innerHTML = '<li style="color:var(--text-tertiary);font-size:0.85rem">No scroll data yet — keep browsing!</li>';
      }
    }

    // --- Recent events timeline (last 10) ---
    var timeline = document.getElementById('act-timeline');
    if (timeline && data.events) {
      var recent = data.events.slice(-10).reverse();
      timeline.innerHTML = '';
      recent.forEach(function (evt) {
        var label = friendlyEvent(evt.name);
        var pageName = PAGE_LABELS[evt.page] || evt.page || '';
        var time = evt.ts ? timeAgo(evt.ts) : '';
        var li = document.createElement('li');
        var dot = document.createElement('span');
        dot.className = 'dash-activity-timeline__dot';
        var eventSpan = document.createElement('span');
        eventSpan.className = 'dash-activity-timeline__event';
        var strong = document.createElement('strong');
        strong.textContent = label;
        eventSpan.appendChild(strong);
        if (pageName) eventSpan.appendChild(document.createTextNode(' on ' + pageName));
        var timeSpan = document.createElement('span');
        timeSpan.className = 'dash-activity-timeline__time';
        timeSpan.textContent = time;
        li.appendChild(dot);
        li.appendChild(eventSpan);
        li.appendChild(timeSpan);
        timeline.appendChild(li);
      });
      if (recent.length === 0) {
        timeline.innerHTML = '<li style="color:var(--text-tertiary);font-size:0.85rem">No events yet — your activity will appear here as you browse.</li>';
      }
    }
  }

  // ===================================
  //  GATED EXPORTS (called by auth.js)
  // ===================================

  // Free stats: only fetches Page Views total + Unique Visitors total (2 numbers)
  window.renderFreeStats = function () {
    var from = daysAgo(30);
    var to = today();

    segQuery('$mp_web_page_view', from, to, 'day')
      .then(function (data) {
        var s = extractSeries(data, '$mp_web_page_view');
        var total = s.data.reduce(function (a, b) { return a + b; }, 0);
        updateStat('stat-pageviews', total.toLocaleString());
      })
      .catch(function () { /* silent fail for free stats */ });

    segQuery('$mp_web_page_view', from, to, 'day', { type: 'unique' })
      .then(function (data) {
        var s = extractSeries(data, '$mp_web_page_view');
        var total = s.data.reduce(function (a, b) { return a + b; }, 0);
        updateStat('stat-visitors', total.toLocaleString());
      })
      .catch(function () { /* silent fail for free stats */ });
  };

  // Full dashboard: renders all 6 charts + all stat cards + Your Activity
  // Only called by auth.js after payment verification
  window.renderFullDashboard = function () {
    renderDashboard();
    renderYourActivity();
  };
})();
