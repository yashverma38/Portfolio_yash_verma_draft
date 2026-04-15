/* ============================================
   AUTH + PAYMENT GATING
   Firebase Auth (Google) + Razorpay Checkout
   Controls access to the analytics dashboard
   ============================================ */

(function () {
  'use strict';

  // --- Firebase Config ---
  var firebaseConfig = {
    apiKey: 'AIzaSyDoTbp91LlARVdzfrjArv8_qvKKpmr8ct4',
    authDomain: 'profile-analytics-tracker.firebaseapp.com',
    projectId: 'profile-analytics-tracker',
    storageBucket: 'profile-analytics-tracker.firebasestorage.app',
    messagingSenderId: '5287005463',
    appId: '1:5287005463:web:fdd0885eb48981f4b47b52',
    measurementId: 'G-91L0CC1DD4'
  };

  // --- DEV MODE ---
  // Set to true to use mock Razorpay checkout (no real payments, no Cloud Functions needed)
  // Set to false for production with real Razorpay
  var DEV_MODE = false;

  // --- Razorpay Config ---
  // TODO: Replace with your live key_id from Razorpay Dashboard > Settings > API Keys
  var RAZORPAY_KEY_ID = 'rzp_test_PLACEHOLDER';
  var AMOUNT_PAISE = 19900; // ₹199

  // --- Cloud Functions base URL ---
  // TODO: Replace after deploying Cloud Functions
  var FUNCTIONS_BASE = 'https://us-central1-profile-analytics-tracker.cloudfunctions.net';

  // --- Auth states ---
  var STATE = {
    LOADING: 'loading',
    NOT_LOGGED_IN: 'not_logged_in',
    LOGGED_IN_NOT_PAID: 'logged_in_not_paid',
    LOGGED_IN_PAID: 'logged_in_paid'
  };

  var currentState = STATE.LOADING;
  var currentUser = null;

  // --- Initialize Firebase ---
  firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth();
  var db = firebase.firestore();

  // --- DOM refs (set on DOMContentLoaded) ---
  var paywall, paywallSignin, paywallPayment, paywallAvatar, paywallName;
  var gatedContent, fullTemplate;
  var lockedCards;
  // Header auth elements
  var headerSigninBtn, headerProfile, headerAvatar, headerName, headerEmail;
  var headerProfileToggle, headerDropdown;

  function cacheDom() {
    paywall = document.getElementById('dash-paywall');
    paywallSignin = document.getElementById('paywall-signin');
    paywallPayment = document.getElementById('paywall-payment');
    paywallAvatar = document.getElementById('paywall-avatar');
    paywallName = document.getElementById('paywall-name');
    gatedContent = document.getElementById('dash-gated-content');
    fullTemplate = document.getElementById('dash-full-content');
    lockedCards = document.querySelectorAll('.dash-stat-card--locked');
    // Header auth
    headerSigninBtn = document.getElementById('header-signin-btn');
    headerProfile = document.getElementById('header-profile');
    headerAvatar = document.getElementById('header-avatar');
    headerName = document.getElementById('header-name');
    headerEmail = document.getElementById('header-email');
    headerProfileToggle = document.getElementById('header-profile-toggle');
    headerDropdown = document.getElementById('header-dropdown');

    // Toggle dropdown on click
    if (headerProfileToggle) {
      headerProfileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        headerDropdown.classList.toggle('is-open');
      });
    }
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function () {
      if (headerDropdown) headerDropdown.classList.remove('is-open');
    });
  }

  // --- Auth state listener ---
  auth.onAuthStateChanged(function (user) {
    if (user) {
      currentUser = user;
      saveUserProfile(user);
      checkSubscription(user.uid);
    } else {
      currentUser = null;
      setState(STATE.NOT_LOGGED_IN);
    }
  });

  // --- Save user profile to Firestore ---
  function saveUserProfile(user) {
    db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).catch(function () { /* silent */ });
  }

  // --- Check subscription status in Firestore ---
  function checkSubscription(uid) {
    // DEV MODE: check localStorage for mock subscription (per-user key)
    if (DEV_MODE) {
      try {
        var devKey = '__dev_subscription_' + uid;
        var devSub = JSON.parse(localStorage.getItem(devKey) || 'null');
        if (devSub && devSub.expires_at > Date.now()) {
          setState(STATE.LOGGED_IN_PAID);
          return;
        }
        if (devSub) localStorage.removeItem(devKey);
        // Clean up old global key if it exists
        localStorage.removeItem('__dev_subscription');
      } catch (e) { /* ignore */ }
    }

    db.collection('users').doc(uid).collection('subscriptions')
      .orderBy('created_at', 'desc')
      .limit(1)
      .get()
      .then(function (snapshot) {
        if (snapshot.empty) {
          setState(STATE.LOGGED_IN_NOT_PAID);
          return;
        }
        var sub = snapshot.docs[0].data();
        var expiresAt = sub.expires_at.toDate();
        if (expiresAt > new Date()) {
          setState(STATE.LOGGED_IN_PAID);
        } else {
          setState(STATE.LOGGED_IN_NOT_PAID);
        }
      })
      .catch(function () {
        setState(STATE.LOGGED_IN_NOT_PAID);
      });
  }

  // --- Set state and update UI ---
  function setState(state) {
    currentState = state;
    updateUI();
  }

  function updateUI() {
    if (!paywall) return; // DOM not ready

    // --- Header auth buttons ---
    var isLoggedIn = currentState === STATE.LOGGED_IN_NOT_PAID || currentState === STATE.LOGGED_IN_PAID;
    if (headerSigninBtn) headerSigninBtn.style.display = isLoggedIn ? 'none' : '';
    if (headerProfile) headerProfile.style.display = isLoggedIn ? '' : 'none';
    if (isLoggedIn && currentUser) {
      if (headerAvatar) { headerAvatar.src = currentUser.photoURL || ''; headerAvatar.alt = currentUser.displayName || ''; }
      if (headerName) headerName.textContent = currentUser.displayName || '';
      if (headerEmail) headerEmail.textContent = currentUser.email || '';
    }

    // --- Main paywall / content ---
    switch (currentState) {
      case STATE.LOADING:
        paywall.style.display = 'block';
        paywallSignin.style.display = 'none';
        paywallPayment.style.display = 'none';
        break;

      case STATE.NOT_LOGGED_IN:
        paywall.style.display = 'block';
        paywallSignin.style.display = '';
        paywallPayment.style.display = 'none';
        showSkeletons();
        break;

      case STATE.LOGGED_IN_NOT_PAID:
        paywall.style.display = 'block';
        paywallSignin.style.display = 'none';
        paywallPayment.style.display = '';
        // Show user info in paywall card
        if (currentUser) {
          if (paywallAvatar) {
            paywallAvatar.src = currentUser.photoURL || '';
            paywallAvatar.alt = currentUser.displayName || '';
          }
          if (paywallName) paywallName.textContent = currentUser.displayName || currentUser.email;
        }
        showSkeletons();
        break;

      case STATE.LOGGED_IN_PAID:
        paywall.style.display = 'none';
        unlockDashboard();
        break;
    }
  }

  // --- Show skeleton placeholders (default state) ---
  function showSkeletons() {
    // Skeletons are already in the DOM; ensure gated content shows them
    if (gatedContent && !gatedContent.querySelector('.dash-skeleton-stats')) {
      // Already been replaced with real content, revert
      // (This shouldn't happen in normal flow, but handles edge cases)
    }
    // Lock remaining stat cards
    lockedCards.forEach(function (card) {
      card.classList.add('dash-stat-card--locked');
    });
  }

  // --- Unlock: clone template into DOM, render charts ---
  function unlockDashboard() {
    if (!gatedContent || !fullTemplate) return;

    // Only clone once
    if (gatedContent.dataset.unlocked === 'true') return;
    gatedContent.dataset.unlocked = 'true';

    // Clear skeletons
    gatedContent.innerHTML = '';

    // Clone template content into the page
    var content = fullTemplate.content.cloneNode(true);
    gatedContent.appendChild(content);

    // Unlock stat cards
    lockedCards.forEach(function (card) {
      card.classList.remove('dash-stat-card--locked');
    });

    // Render full dashboard (charts + your activity)
    if (typeof window.renderFullDashboard === 'function') {
      window.renderFullDashboard();
    }

    // Re-initialize reveal animations for cloned elements
    reinitReveal();
  }

  // --- Re-init IntersectionObserver for .reveal elements ---
  function reinitReveal() {
    var reveals = gatedContent.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- DEV: Mock Razorpay Payment Modal ---
  function showMockPaymentModal() {
    var mockOrderId = 'order_DEV_' + Date.now();
    var mockPaymentId = 'pay_DEV_' + Math.random().toString(36).substr(2, 14);
    var payBtn = document.getElementById('paywall-pay-btn');

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'mock-razorpay-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

    // Card
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:12px;width:380px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;';

    // Header
    var header = document.createElement('div');
    header.style.cssText = 'background:#072654;color:#fff;padding:0.75rem 1rem;font-weight:600;font-size:0.9rem;display:flex;align-items:center;justify-content:space-between;';
    header.innerHTML = '<span>MOCK RAZORPAY</span><span style="background:#ff6b35;padding:2px 8px;border-radius:4px;font-size:0.7rem;">DEV MODE</span>';
    card.appendChild(header);

    // Body
    var body = document.createElement('div');
    body.style.cssText = 'padding:1.5rem 2rem 2rem;';

    // Amount display
    body.innerHTML = '<div style="text-align:center;margin-bottom:1.5rem;">' +
      '<div style="font-size:0.8rem;color:#666;margin-bottom:0.5rem;">Analytics Dashboard — 30 Day Access</div>' +
      '<div style="font-size:2.2rem;font-weight:700;color:#072654;">&#8377;199</div>' +
      '<div style="font-size:0.75rem;color:#999;margin-top:0.25rem;">Order: ' + mockOrderId + '</div>' +
      '</div>' +
      '<div style="border-top:1px solid #eee;padding-top:1rem;margin-bottom:1rem;">' +
      '<div style="font-size:0.8rem;font-weight:600;color:#333;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Choose payment outcome:</div>' +
      '</div>' +
      '<div id="mock-rzp-buttons" style="display:flex;flex-direction:column;gap:0.6rem;">' +
      '<button id="mock-btn-success" style="padding:0.75rem;border:none;border-radius:8px;background:#1cb955;color:#fff;font-size:0.9rem;font-weight:600;cursor:pointer;">&#10003;  Payment Success</button>' +
      '<button id="mock-btn-pending" style="padding:0.75rem;border:none;border-radius:8px;background:#f5a623;color:#fff;font-size:0.9rem;font-weight:600;cursor:pointer;">&#8987;  Payment Pending</button>' +
      '<button id="mock-btn-failure" style="padding:0.75rem;border:none;border-radius:8px;background:#e74c3c;color:#fff;font-size:0.9rem;font-weight:600;cursor:pointer;">&#10007;  Payment Failed</button>' +
      '</div>' +
      '<div id="mock-rzp-status" style="display:none;text-align:center;padding:1rem 0;"></div>' +
      '<button id="mock-btn-close" style="width:100%;margin-top:1rem;padding:0.6rem;border:1px solid #ddd;border-radius:8px;background:#fff;color:#666;font-size:0.8rem;cursor:pointer;">Close</button>';

    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    var buttonsDiv = document.getElementById('mock-rzp-buttons');
    var statusDiv = document.getElementById('mock-rzp-status');

    function closeMock() {
      var el = document.getElementById('mock-razorpay-overlay');
      if (el) el.parentNode.removeChild(el);
      if (payBtn) { payBtn.disabled = false; payBtn.textContent = 'Unlock Full Dashboard'; }
    }

    // SUCCESS
    document.getElementById('mock-btn-success').addEventListener('click', function () {
      buttonsDiv.style.display = 'none';
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<div style="color:#1cb955;font-size:2rem;margin-bottom:0.5rem;">&#10003;</div>' +
        '<div style="font-weight:600;color:#333;font-size:1rem;">Payment Successful!</div>' +
        '<div style="font-size:0.8rem;color:#666;margin-top:0.25rem;">Payment ID: ' + mockPaymentId + '</div>';

      // Store dev subscription in localStorage (per-user)
      var devKey = '__dev_subscription_' + (currentUser ? currentUser.uid : 'anon');
      localStorage.setItem(devKey, JSON.stringify({
        order_id: mockOrderId,
        payment_id: mockPaymentId,
        created_at: Date.now(),
        expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000
      }));

      setTimeout(function () {
        closeMock();
        setState(STATE.LOGGED_IN_PAID);
      }, 1500);
    });

    // PENDING
    document.getElementById('mock-btn-pending').addEventListener('click', function () {
      buttonsDiv.style.display = 'none';
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<div style="color:#f5a623;font-size:2rem;margin-bottom:0.5rem;">&#8987;</div>' +
        '<div style="font-weight:600;color:#333;">Payment Processing...</div>' +
        '<div style="font-size:0.8rem;color:#666;margin-top:0.25rem;">This can take a few seconds</div>';

      setTimeout(function () {
        statusDiv.innerHTML = '<div style="color:#f5a623;font-size:2rem;margin-bottom:0.5rem;">&#8987;</div>' +
          '<div style="font-weight:600;color:#333;">Still processing...</div>' +
          '<div style="font-size:0.8rem;color:#999;margin-top:0.25rem;">Payment is being verified by the bank</div>';
      }, 2000);

      setTimeout(function () {
        statusDiv.innerHTML = '<div style="color:#999;font-size:2rem;margin-bottom:0.5rem;">&#8986;</div>' +
          '<div style="font-weight:600;color:#333;">Payment Timed Out</div>' +
          '<div style="font-size:0.8rem;color:#666;margin-top:0.25rem;">No confirmation received. Try again.</div>';
        document.getElementById('mock-btn-close').textContent = 'Close & Try Again';
      }, 5000);
    });

    // FAILURE
    document.getElementById('mock-btn-failure').addEventListener('click', function () {
      buttonsDiv.style.display = 'none';
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<div style="color:#e74c3c;font-size:2rem;margin-bottom:0.5rem;">&#10007;</div>' +
        '<div style="font-weight:600;color:#333;">Payment Failed</div>' +
        '<div style="font-size:0.8rem;color:#666;margin-top:0.25rem;">Your bank declined the transaction</div>';
      document.getElementById('mock-btn-close').textContent = 'Close & Try Again';
    });

    // CLOSE
    document.getElementById('mock-btn-close').addEventListener('click', closeMock);

    // Click overlay to close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMock();
    });
  }

  // --- Google Sign-In ---
  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(function (err) {
      if (err.code === 'auth/popup-blocked') {
        // Fallback to redirect
        auth.signInWithRedirect(provider);
      }
    });
  }

  // --- Get Firebase ID token for Cloud Function calls ---
  function getIdToken() {
    if (!currentUser) return Promise.reject(new Error('Not signed in'));
    return currentUser.getIdToken();
  }

  // --- Initiate Razorpay payment ---
  function initiatePayment() {
    var payBtn = document.getElementById('paywall-pay-btn');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.textContent = 'Creating order...';
    }

    // DEV MODE: show mock payment modal instead of real Razorpay
    if (DEV_MODE) {
      setTimeout(function () {
        if (payBtn) payBtn.textContent = 'Processing...';
        showMockPaymentModal();
      }, 500);
      return;
    }

    getIdToken()
      .then(function (idToken) {
        return fetch(FUNCTIONS_BASE + '/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
          },
          body: JSON.stringify({ uid: currentUser.uid })
        });
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) throw new Error(data.error);

        // Open Razorpay Checkout
        var options = {
          key: RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'Yash Verma',
          description: 'Analytics Dashboard — 30 Day Access',
          order_id: data.order_id,
          handler: function (response) {
            verifyPayment(response);
          },
          modal: {
            ondismiss: function () {
              // User closed the modal without paying
              if (payBtn) {
                payBtn.disabled = false;
                payBtn.textContent = 'Unlock Full Dashboard';
              }
            }
          },
          prefill: {
            email: currentUser.email,
            name: currentUser.displayName
          },
          theme: { color: '#2d6a8a' }
        };

        var rzp = new Razorpay(options);
        rzp.on('payment.failed', function () {
          if (payBtn) {
            payBtn.disabled = false;
            payBtn.textContent = 'Unlock Full Dashboard';
          }
        });
        rzp.open();
      })
      .catch(function (err) {
        console.error('Payment init error:', err);
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = 'Unlock Full Dashboard';
        }
      });
  }

  // --- Verify payment with Cloud Function ---
  function verifyPayment(response) {
    var payBtn = document.getElementById('paywall-pay-btn');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.textContent = 'Verifying payment...';
    }

    getIdToken()
      .then(function (idToken) {
        return fetch(FUNCTIONS_BASE + '/verifyPayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        });
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          setState(STATE.LOGGED_IN_PAID);
        } else {
          alert('Payment verification failed. Please contact yashverma.iitkgp@gmail.com');
          if (payBtn) {
            payBtn.disabled = false;
            payBtn.textContent = 'Unlock Full Dashboard';
          }
        }
      })
      .catch(function (err) {
        console.error('Verification error:', err);
        alert('Something went wrong. Please contact yashverma.iitkgp@gmail.com');
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = 'Unlock Full Dashboard';
        }
      });
  }

  // --- Sign out ---
  function signOut() {
    auth.signOut();
  }

  // --- Expose public API ---
  window.portfolioAuth = {
    signIn: signInWithGoogle,
    pay: initiatePayment,
    signOut: signOut
  };

  // DEV MODE: expose helper to clear mock subscription + log status
  if (DEV_MODE) {
    window.portfolioAuth.clearDevSub = function () {
      // Clear per-user key for current user + old global key
      if (currentUser) localStorage.removeItem('__dev_subscription_' + currentUser.uid);
      localStorage.removeItem('__dev_subscription');
      location.reload();
    };
    console.log('%c[DEV MODE] Mock Razorpay active — no real payments will be processed', 'color:#ff6b35;font-weight:bold;');
    console.log('%c  Call portfolioAuth.clearDevSub() to reset mock subscription and re-test payment flow', 'color:#888;');
  }

  // --- Init ---
  function init() {
    cacheDom();

    // Always fetch free stats (2 numbers only)
    if (typeof window.renderFreeStats === 'function') {
      window.renderFreeStats();
    }

    // If auth state already resolved, update UI
    if (currentState !== STATE.LOADING) {
      updateUI();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
