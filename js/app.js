/* CardioScores engine — hash routing + rendering + scoring. No dependencies. */
(function () {
  'use strict';

  var view = document.getElementById('view');
  var topTitle = document.getElementById('topTitle');
  var backBtn = document.getElementById('backBtn');
  var homeBtn = document.getElementById('homeBtn');

  var LEVEL_LABEL = { low: 'Low risk', mod: 'Intermediate', high: 'High risk', vhigh: 'Very high risk', info: 'Result' };

  /* ---------- helpers ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function catById(id) {
    for (var i = 0; i < CARDIO.categories.length; i++) {
      if (CARDIO.categories[i].id === id) return CARDIO.categories[i];
    }
    return null;
  }

  function calcById(id) {
    for (var i = 0; i < CARDIO.calculators.length; i++) {
      if (CARDIO.calculators[i].id === id) return CARDIO.calculators[i];
    }
    return null;
  }

  function calcsInCategory(catId) {
    return CARDIO.calculators
      .filter(function (c) { return c.category === catId; })
      .sort(function (a, b) {
        if ((a.kind === 'external') !== (b.kind === 'external')) return a.kind === 'external' ? 1 : -1;
        return a.name.localeCompare(b.name);
      });
  }

  /* ---------- views ---------- */

  function renderHome() {
    topTitle.textContent = 'CardioScores';
    backBtn.hidden = true;
    view.innerHTML = '';

    var search = el('input', { class: 'search-box', type: 'search', placeholder: 'Search ' + CARDIO.calculators.length + ' calculators…', 'aria-label': 'Search calculators' });
    var results = el('div', { class: 'calc-list' });
    var grid = el('div', { class: 'cat-grid' });

    CARDIO.categories.forEach(function (cat) {
      var n = calcsInCategory(cat.id).length;
      if (n === 0) return;
      grid.appendChild(el('a', { class: 'cat-card', href: '#/cat/' + cat.id }, [
        el('div', { class: 'cat-icon', text: cat.icon }),
        el('h3', { text: cat.name }),
        el('p', { text: cat.blurb }),
        el('span', { class: 'cat-count', text: n + (n === 1 ? ' tool' : ' tools') })
      ]));
    });

    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      results.innerHTML = '';
      if (!q) { grid.style.display = ''; return; }
      grid.style.display = 'none';
      var hits = CARDIO.calculators.filter(function (c) {
        var hay = (c.name + ' ' + (c.short || '') + ' ' + (c.keywords || []).join(' ') + ' ' + (catById(c.category) || {}).name).toLowerCase();
        return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
      }).slice(0, 40);
      if (!hits.length) {
        results.appendChild(el('p', { class: 'empty-msg', text: 'No calculators match "' + search.value + '".' }));
      }
      hits.forEach(function (c) { results.appendChild(calcListItem(c)); });
    });

    view.appendChild(search);
    view.appendChild(results);
    view.appendChild(grid);
  }

  function calcListItem(c) {
    var h3 = el('h3', { text: c.name });
    if (c.kind === 'external') h3.appendChild(el('span', { class: 'ext-tag', text: 'external' }));
    return el('a', { class: 'calc-item', href: '#/calc/' + c.id }, [h3, el('p', { text: c.short || '' })]);
  }

  function renderCategory(catId) {
    var cat = catById(catId);
    if (!cat) return renderHome();
    topTitle.textContent = cat.name;
    backBtn.hidden = false;
    view.innerHTML = '';
    var list = el('div', { class: 'calc-list' });
    var calcs = calcsInCategory(catId);
    if (!calcs.length) list.appendChild(el('p', { class: 'empty-msg', text: 'No calculators in this category yet.' }));
    calcs.forEach(function (c) { list.appendChild(calcListItem(c)); });
    view.appendChild(list);
  }

  /* ---------- calculator page ---------- */

  function renderCalc(calcId) {
    var calc = calcById(calcId);
    if (!calc) return renderHome();
    topTitle.textContent = calc.name;
    backBtn.hidden = false;
    view.innerHTML = '';

    var page = el('div', { class: 'calc-page' }, [
      el('h2', { text: calc.name }),
      el('p', { class: 'calc-short', text: calc.short || '' })
    ]);

    if (calc.kind === 'external') {
      var ext = calc.external || {};
      var box = el('div', { class: 'external-box' }, [
        el('p', { text: ext.reason || 'This score uses a complex or proprietary model and should be calculated with the official tool.' })
      ]);
      if (ext.url) {
        var openBtn = el('button', { class: 'btn-open-ext', type: 'button' }, [
          document.createTextNode('Open official calculator '),
          el('span', { 'aria-hidden': 'true', text: '↗' })
        ]);
        openBtn.addEventListener('click', function () { openExternal(ext.url); });

        var urlRow = el('div', { class: 'ext-url-row' });
        var urlLink = el('a', { class: 'ext-url', href: ext.url, target: '_blank', rel: 'noopener noreferrer', text: ext.url });
        var copyBtn = el('button', { class: 'btn-copy-ext', type: 'button', text: 'Copy' });
        copyBtn.addEventListener('click', function () { copyText(ext.url, copyBtn); });
        urlRow.appendChild(urlLink);
        urlRow.appendChild(copyBtn);

        box.appendChild(openBtn);
        box.appendChild(urlRow);
      }
      page.appendChild(box);
      appendNotesRefs(page, calc);
      view.appendChild(page);
      return;
    }

    var controls = {};
    var resultPanel = el('div', { class: 'result-panel level-info' });

    (calc.inputs || []).forEach(function (inp) {
      page.appendChild(buildInputRow(inp, controls, update));
    });

    var resetBtn = el('button', { class: 'btn-reset', text: 'Reset' });
    resetBtn.addEventListener('click', function () {
      Object.keys(controls).forEach(function (k) {
        var c = controls[k];
        if (c.type === 'checkbox') c.checked = false;
        else if (c.tagName === 'SELECT') { if (!c._applyUnit) c.selectedIndex = 0; } // keep the chosen unit
        else c.value = '';
      });
      update();
    });

    page.appendChild(resultPanel);
    page.appendChild(resetBtn);
    appendNotesRefs(page, calc);
    view.appendChild(page);

    function readValues() {
      var vals = {};
      (calc.inputs || []).forEach(function (inp) {
        var c = controls[inp.id];
        if (inp.type === 'check') {
          vals[inp.id] = c.checked;
        } else if (inp.type === 'select') {
          var opt = inp.options[c.selectedIndex] || {};
          vals[inp.id] = ('value' in opt) ? opt.value : (opt.points || 0);
          vals[inp.id + '__points'] = opt.points || 0;
        } else if (inp.type === 'number') {
          var raw = c.value.trim();
          var val = raw === '' ? null : parseFloat(raw);
          if (val !== null && isNaN(val)) val = null;
          if (val !== null && inp.units && inp.units.length > 1) {
            var usel = controls[inp.id + '__unitsel'];
            var u = inp.units[usel ? usel.selectedIndex : 0];
            var f = (u && u.factor != null) ? u.factor : 1;
            val = val * f; // convert entered value to the calculator's base unit
          }
          vals[inp.id] = val;
        }
      });
      return vals;
    }

    function update() {
      var vals = readValues();
      var out;
      if (calc.kind === 'custom' && typeof calc.compute === 'function') {
        try {
          out = calc.compute(vals);
        } catch (e) {
          out = null;
        }
        if (!out) {
          setResult(resultPanel, { value: '—', text: 'Complete the fields above to calculate.', level: 'info', noBadge: true });
          return;
        }
        setResult(resultPanel, out);
      } else {
        var score = 0;
        (calc.inputs || []).forEach(function (inp) {
          if (inp.type === 'check' && vals[inp.id]) score += (inp.points || 0);
          else if (inp.type === 'select') score += vals[inp.id + '__points'];
        });
        var band = pickBand(calc.interpret, score);
        setResult(resultPanel, {
          value: String(score),
          unit: (calc.result && calc.result.unit) || 'points',
          text: band ? band.text : '',
          level: band ? band.level : 'info'
        });
      }
    }

    update();
  }

  function buildInputRow(inp, controls, onChange) {
    var row = el('div', { class: 'input-row' });

    if (inp.type === 'check') {
      var cb = el('input', { type: 'checkbox' });
      cb.addEventListener('change', onChange);
      controls[inp.id] = cb;
      var lbl = el('label', { class: 'check-row' }, [
        cb,
        el('span', { class: 'check-text' }, [
          document.createTextNode(inp.label),
          inp.hint ? el('span', { class: 'hint', text: inp.hint }) : null
        ]),
        (typeof inp.points === 'number') ? el('span', { class: 'pts', text: (inp.points > 0 ? '+' : '') + inp.points }) : null
      ]);
      row.appendChild(lbl);
      return row;
    }

    var labelEl = el('label', { class: 'row-label' }, [document.createTextNode(inp.label)]);
    if (inp.hint) labelEl.appendChild(el('span', { class: 'hint', text: inp.hint }));
    row.appendChild(labelEl);

    if (inp.type === 'select') {
      var sel = el('select');
      inp.options.forEach(function (o) {
        var suffix = (typeof o.points === 'number' && !inp.hidePoints) ? '  (' + (o.points > 0 ? '+' : '') + o.points + ')' : '';
        sel.appendChild(el('option', { text: o.label + suffix }));
      });
      sel.addEventListener('change', onChange);
      controls[inp.id] = sel;
      row.appendChild(sel);
    } else if (inp.type === 'number') {
      var num = el('input', {
        type: 'number',
        inputmode: 'decimal',
        step: inp.step != null ? inp.step : 'any',
        placeholder: inp.placeholder || ''
      });
      num.addEventListener('input', onChange);
      controls[inp.id] = num;

      if (inp.units && inp.units.length > 1) {
        // Dual-unit input (e.g., kg/lb, cm/in): dropdown converts to the base unit.
        var usel = el('select', { class: 'unit-select', 'aria-label': 'Unit for ' + inp.label });
        inp.units.forEach(function (u) { usel.appendChild(el('option', { text: u.label })); });
        var pref = getUnitPref();
        inp.units.forEach(function (u, i) { if (u.system === pref) usel.selectedIndex = i; });

        var applyUnit = function () {
          var u = inp.units[usel.selectedIndex] || inp.units[0];
          var f = (u.factor != null) ? u.factor : 1;
          if (inp.min != null) num.min = Math.round((inp.min / f) * 100) / 100; else num.removeAttribute('min');
          if (inp.max != null) num.max = Math.round((inp.max / f) * 100) / 100; else num.removeAttribute('max');
          num.placeholder = (usel.selectedIndex === 0 && inp.placeholder) ? inp.placeholder : '';
        };
        usel._applyUnit = applyUnit;
        applyUnit();
        usel.addEventListener('change', function () {
          applyUnit();
          var u = inp.units[usel.selectedIndex];
          if (u && u.system) setUnitPref(u.system);
          onChange();
        });
        controls[inp.id + '__unitsel'] = usel;
        row.appendChild(el('div', { class: 'num-with-unit' }, [num, usel]));
      } else {
        if (inp.min != null) num.setAttribute('min', inp.min);
        if (inp.max != null) num.setAttribute('max', inp.max);
        row.appendChild(el('div', {}, [num]));
        if (inp.unit) labelEl.appendChild(el('span', { class: 'unit-suffix', text: '(' + inp.unit + ')' }));
      }
    }
    return row;
  }

  /* Preferred unit system (remembered across calculators). 'si' = metric base, 'us' = US/Imperial. */
  function getUnitPref() {
    try { return localStorage.getItem('cardio_units') === 'us' ? 'us' : 'si'; } catch (e) { return 'si'; }
  }
  function setUnitPref(sys) {
    try { localStorage.setItem('cardio_units', sys === 'us' ? 'us' : 'si'); } catch (e) { /* ignore */ }
  }

  function pickBand(bands, score) {
    if (!bands) return null;
    for (var i = 0; i < bands.length; i++) {
      if (score <= bands[i].upTo) return bands[i];
    }
    return bands[bands.length - 1] || null;
  }

  function setResult(panel, out) {
    panel.className = 'result-panel level-' + (out.level || 'info');
    panel.innerHTML = '';
    if (!out.noBadge) {
      panel.appendChild(el('span', { class: 'level-badge ' + (out.level || 'info'), text: out.badge || LEVEL_LABEL[out.level] || 'Result' }));
    }
    var line = el('p', { class: 'score-line', text: out.value });
    if (out.unit) line.appendChild(el('span', { class: 'unit', text: out.unit }));
    panel.appendChild(line);
    if (out.text) panel.appendChild(el('p', { class: 'interp', text: out.text }));
    if (out.detail) panel.appendChild(el('p', { class: 'detail', text: out.detail }));
    if (out.svg) {
      // out.svg is a trusted, calculator-generated SVG string (never user input).
      var chart = el('div', { class: 'result-chart' });
      chart.innerHTML = out.svg;
      panel.appendChild(chart);
    }
  }

  function appendNotesRefs(page, calc) {
    if (calc.notes) {
      page.appendChild(el('div', { class: 'notes-block', html: '<strong>Notes:</strong> ' + escapeHtml(calc.notes) }));
    }
    if (calc.refs && calc.refs.length) {
      var ol = el('ol');
      calc.refs.forEach(function (r) { ol.appendChild(el('li', { text: r })); });
      page.appendChild(el('div', { class: 'refs-block' }, [el('strong', { text: 'References' }), ol]));
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Open an external URL reliably across web, PWA and the Capacitor native app.
   * Order: Capacitor Browser plugin (native) → new tab → same-tab navigation. */
  function openExternal(url) {
    try {
      if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' &&
          window.Capacitor.isNativePlatform() &&
          window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) {
        window.Capacitor.Plugins.Browser.open({ url: url });
        return;
      }
    } catch (e) { /* fall through to web handling */ }

    var win = null;
    try { win = window.open(url, '_blank', 'noopener,noreferrer'); } catch (e) { win = null; }
    if (!win) {
      // Popups blocked (e.g. sandboxed preview) — navigate in the current tab instead.
      try { window.location.assign(url); } catch (e) { window.location.href = url; }
    }
  }

  function copyText(text, btn) {
    function flash() {
      var old = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = old; }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, function () { legacyCopy(text); flash(); });
    } else {
      legacyCopy(text);
      flash();
    }
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- routing ---------- */

  function route() {
    var h = location.hash || '#/';
    var m;
    window.scrollTo(0, 0);
    if ((m = h.match(/^#\/cat\/([\w-]+)$/))) renderCategory(m[1]);
    else if ((m = h.match(/^#\/calc\/([\w-]+)$/))) renderCalc(m[1]);
    else renderHome();
  }

  backBtn.addEventListener('click', function () { history.back(); });
  homeBtn.addEventListener('click', function () { location.hash = '#/'; });
  window.addEventListener('hashchange', route);

  /* ---------- disclaimer ---------- */

  var modal = document.getElementById('disclaimerModal');
  var accepted = false;
  try { accepted = localStorage.getItem('cardio_disclaimer_v1') === 'yes'; } catch (e) { /* private mode */ }
  if (!accepted) {
    modal.hidden = false;
    document.getElementById('acceptDisclaimer').addEventListener('click', function () {
      try { localStorage.setItem('cardio_disclaimer_v1', 'yes'); } catch (e) { /* ignore */ }
      modal.hidden = true;
    });
  }

  route();
})();
