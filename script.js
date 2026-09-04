/* ============================================================
   Smart Home Repair — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Business config (update here) ---------- */
  var CONFIG = {
    phoneDisplay: '62380 54003',
    phoneTel: '+916238054003',
    whatsapp: '916238054003', // country code + number, digits only
    visitNote: 'Visit charge ₹299 — fully waived when you proceed with the repair.'
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     Data
     ============================================================ */
  var SERVICES = [
    {
      id: 'ac', icon: 'i-snow', name: 'Split / Window AC', tag: 'Air conditioners',
      desc: 'Complete residential AC service — installation, gas refills, PCB repairs and deep cleaning, for every brand and model.',
      feats: ['Installation & uninstallation', 'Gas refill & leakage repair', 'Cooling issue diagnosis & fixing', 'PCB (circuit board) repair', 'Regular servicing & deep cleaning']
    },
    {
      id: 'fridge', icon: 'i-fridge', name: 'Refrigerator', tag: 'All fridge brands',
      desc: 'Cooling issues, gas refills, compressor and thermostat repairs — single-door, double-door and side-by-side fridges.',
      feats: ['Cooling issue diagnosis', 'Gas refill & leak repair', 'Compressor repair & replacement', 'Thermostat replacement', 'Ice buildup / defrost fixes']
    },
    {
      id: 'washer', icon: 'i-washer', name: 'Washing Machine', tag: 'Front & top load',
      desc: 'Front-load and top-load washing machine repairs, installation and PCB servicing — all brands covered.',
      feats: ['Installation of new units', 'Drum & motor repair', 'Water leakage fixing', 'PCB repair & replacement', 'Noise & vibration fixes']
    },
    {
      id: 'microwave', icon: 'i-microwave', name: 'Microwave Oven', tag: 'Solo & convection',
      desc: 'Expert repair for all solo and convection microwave brands across Kochi.',
      feats: ['Magnetron replacement', 'Heating issue fixing', 'Turntable motor repair', 'Sparking problem fix', 'Short-circuit diagnosis']
    },
    {
      id: 'cassette', icon: 'i-wind', name: 'Cassette AC', tag: 'Ceiling mounted',
      desc: 'Ceiling-mounted cassette AC installation, drainage cleaning and cooling optimization for shops and offices.',
      feats: ['Ceiling-mounted installation', 'Drainage system cleaning', 'Gas charging & top-up', 'Airflow & cooling optimization', 'AMC options available']
    },
    {
      id: 'vrv', icon: 'i-building', name: 'VRV / VRF Systems', tag: 'Commercial cooling',
      desc: 'Advanced centralized cooling for offices, malls, hospitals and hotels — design, install and maintain.',
      feats: ['System design & full installation', 'Centralized cooling setup', 'AMC / maintenance contracts', 'Advanced fault diagnosis', 'Compressor & control panel repair']
    },
    {
      id: 'geyser', icon: 'i-flame', name: 'Geyser / Water Heater', tag: 'Electric & gas',
      desc: 'Geyser installation, heating element replacement, leakage repair and descaling for all major brands.',
      feats: ['New unit installation', 'Heating element replacement', 'Thermostat repair', 'Leakage fixing & sealing', 'Descaling & maintenance']
    },
    {
      id: 'install', icon: 'i-truck', name: 'Installation & Shifting', tag: 'New units & home moves',
      desc: 'New unit installation and re-installation for home-shifting needs across Kochi — neat, safe, done right.',
      feats: ['New unit installation', 'Re-installation (home shifting)', 'Mounting, piping & wiring', 'Pre-installation site check']
    }
  ];

  var AREAS = [
    'Kakkanad', 'Edappally', 'Vyttila', 'Palarivattom', 'Thrikkakara', 'Kalamassery',
    'Aluva', 'Maradu', 'Thammanam', 'Kadavanthra', 'Kaloor', 'Thevara',
    'Fort Kochi', 'Mattancherry', 'Vazhakkala', 'Ambalamugal', 'Tripunithura',
    'Ernakulam North', 'Ernakulam South', 'Ponnurunni'
  ];

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function svgUse(id) {
    return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }
  function svgCheck() { return '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>'; }

  /* ============================================================
     Render: service cards
     ============================================================ */
  function renderServices() {
    var grid = $('#serviceGrid');
    if (!grid) return;
    grid.innerHTML = SERVICES.map(function (s, i) {
      return (
        '<div class="service-card reveal" role="button" tabindex="0" ' +
        'aria-haspopup="dialog" data-service="' + s.id + '" style="animation-delay:' + (i * 45) + 'ms">' +
          '<span class="service-ic" aria-hidden="true">' + svgUse(s.icon) + '</span>' +
          '<h3>' + s.name + '</h3>' +
          '<span class="service-tag">' + s.tag + '</span>' +
          '<p>' + s.desc + '</p>' +
          '<span class="card-go">View details ' + svgUse('i-arrow') + '</span>' +
        '</div>'
      );
    });
  }

  /* ============================================================
     Render: areas + selects
     ============================================================ */
  function fillSelect(sel, items, placeholder) {
    if (!sel) return;
    var opts = '';
    if (placeholder) opts += '<option value="">' + placeholder + '</option>';
    opts += items.map(function (a) {
      return '<option value="' + a + '">' + a + '</option>';
    }).join('');
    if (placeholder === null) opts += '<option value="Other">Other (not listed)</option>';
    sel.innerHTML = opts;
  }

  function renderHelpers() {
    // Hero "what needs fixing?"
    fillSelect($('#heroService'), SERVICES.map(function (s) { return s.name; }), 'What needs fixing?');
    // Booking form
    fillSelect($('#fArea'), AREAS, null);
    fillSelect($('#fService'), SERVICES.map(function (s) { return s.name; }), 'Select a service');
    // Coverage chips
    var chips = $('#areaChips');
    if (chips) {
      chips.innerHTML = AREAS.map(function (a) { return '<li>' + a + '</li>'; }).join('') +
        '<li aria-hidden="true">…and 10 more nearby areas</li>';
    }
  }

  /* ============================================================
     Marquee (seamless, skip when reduced motion)
     ============================================================ */
  function initMarquee() {
    var a = $('#marqueeA'), b = $('#marqueeB'), box = $('.marquee');
    if (!a || !b || !box) return;
    $$('li', a).forEach(function (li) {
      b.appendChild(li.cloneNode(true));
    });
    if (!reducedMotion) box.classList.add('marquee-anim');
  }

  /* ============================================================
     Service modal
     ============================================================ */
  var modal = $('#serviceModal');
  var lastFocus = null;

  function openServiceModal(id) {
    var s = SERVICES.filter(function (x) { return x.id === id; })[0];
    if (!s || !modal) return;
    $('#modalIcon').innerHTML = svgUse(s.icon);
    $('#modalTitle').textContent = s.name;
    $('#modalTag').textContent = s.tag;
    $('#modalDesc').textContent = s.desc;
    $('#modalFeats').innerHTML = s.feats.map(function (f) { return '<li>' + svgCheck() + f + '</li>'; }).join('');
    modal.dataset.service = s.id;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal-close', modal).focus();
  }

  function closeServiceModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initModal() {
    if (!modal) return;
    $('#serviceGrid').addEventListener('click', function (e) {
      var card = e.target.closest('.service-card');
      if (card) openServiceModal(card.dataset.service);
    });
    $('#serviceGrid').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.service-card');
      if (card) { e.preventDefault(); openServiceModal(card.dataset.service); }
    });
    $$('[data-close]', modal).forEach(function (el) {
      el.addEventListener('click', closeServiceModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeServiceModal();
    });
    $('#modalBook').addEventListener('click', function () {
      var sel = $('#fService');
      if (sel && modal.dataset.service) {
        sel.value = SERVICES.filter(function (s) { return s.id === modal.dataset.service; })[0].name;
      }
      closeServiceModal();
      var book = $('#book');
      if (book) { book.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }
      var name = $('#fName');
      if (name) name.focus();
    });
  }

  /* ============================================================
     Hero quick quote → booking
     ============================================================ */
  function initHeroGo() {
    var go = $('#heroGo'), sel = $('#heroService');
    if (!go || !sel) return;
    go.addEventListener('click', function () {
      if (!sel.value) {
        sel.classList.add('field-error');
        sel.focus();
        setTimeout(function () { sel.classList.remove('field-error'); }, 1200);
        return;
      }
      var fService = $('#fService');
      if (fService) fService.value = sel.value;
      var book = $('#book');
      if (book) book.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      var name = $('#fName');
      if (name) name.focus();
    });
  }

  /* ============================================================
     Mobile nav
     ============================================================ */
  function initNav() {
    var toggle = $('#menuToggle'), nav = $('#siteNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     Booking form
     ============================================================ */
  function setErr(id, msg) {
    var el = $('#' + id);
    if (el) el.textContent = msg;
  }
  function clearErr(id) { setErr(id, ''); }
  function markInvalid(id, msg) {
    var fieldEl = $('#' + id).closest('.field');
    if (fieldEl) fieldEl.classList.add('invalid');
    setErr('err' + id.slice(1), msg);
  }

  function validate() {
    var ok = true;
    ['fName', 'fPhone', 'fArea', 'fService'].forEach(function (id) {
      var el = $('#' + id), fieldEl = el.closest('.field');
      if (fieldEl) fieldEl.classList.remove('invalid');
    });
    clearErr('errName'); clearErr('errPhone'); clearErr('errArea'); clearErr('errService');

    var name = $('#fName').value.trim();
    if (name.length < 2) { markInvalid('fName', 'Please enter your name.'); ok = false; }

    var phone = $('#fPhone').value.replace(/[\s-]/g, '').replace(/^\+?91/, '');
    if (!/^[6-9]\d{9}$/.test(phone)) { markInvalid('fPhone', 'Enter a valid 10-digit mobile number.'); ok = false; }

    if (!$('#fArea').value) { markInvalid('fArea', 'Please choose your area.'); ok = false; }
    if (!$('#fService').value) { markInvalid('fService', 'Please choose a service.'); ok = false; }
    return ok;
  }

  function buildWaMessage() {
    var msg =
      'Hi Smart Home Repair! I would like to book a service.\n\n' +
      '• Name: ' + $('#fName').value.trim() + '\n' +
      '• Phone: ' + $('#fPhone').value.trim() + '\n' +
      '• Area: ' + $('#fArea').value + '\n' +
      '• Service: ' + $('#fService').value;
    var extra = $('#fMsg').value.trim();
    if (extra) msg += '\n• Details: ' + extra;
    return msg;
  }

  function initForm() {
    var form = $('#bookForm');
    if (!form) return;

    ['fName', 'fPhone'].forEach(function (id) {
      $('#' + id).addEventListener('blur', function () {
        var el = $('#' + id);
        if (el.value.trim()) {
          var fieldEl = el.closest('.field');
          if (fieldEl) fieldEl.classList.remove('invalid');
          clearErr('err' + id.slice(1));
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstInvalid = $('.field.invalid input, .field.invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      // Success state
      var success = $('#formSuccess');
      $('#successMsg').textContent =
        'Thanks, ' + $('#fName').value.trim().split(' ')[0] + '! Our team will call you within 15 minutes during working hours (8 AM – 8 PM).';
      $('#successWa').href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(buildWaMessage());
      success.hidden = false;
      form.classList.add('is-success');
      success.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      $('#submitBtn').disabled = true;
      $('#submitBtn').setAttribute('aria-disabled', 'true');
    });
  }

  /* ============================================================
     Scroll reveal + misc
     ============================================================ */
  function initReveal() {
    var targets = $$('.reveal');
    if (!targets.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ============================================================
     Boot
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    renderServices();
    renderHelpers();
    initMarquee();
    initModal();
    initHeroGo();
    initNav();
    initForm();
    initReveal();

    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
