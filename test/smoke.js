/* Smoke test: loads registry + all calculator modules in a sandboxed VM,
 * validates schema conformance, and exercises every calculator.
 * Run: node test/smoke.js */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const CALC_DIR = path.join(ROOT, 'www', 'js', 'calculators');

const sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);

function load(file) {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sandbox, { filename: file });
}

let failures = 0;
function fail(msg) {
  failures++;
  console.error('  FAIL: ' + msg);
}

load(path.join(ROOT, 'www', 'js', 'registry.js'));

const files = fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.js')).sort();
for (const f of files) {
  try {
    load(path.join(CALC_DIR, f));
  } catch (e) {
    fail(f + ' threw on load: ' + e.message);
  }
}

const CARDIO = sandbox.CARDIO;
const LEVELS = ['low', 'mod', 'high', 'vhigh', 'info'];
const KINDS = ['points', 'custom', 'external'];

console.log('Loaded ' + files.length + ' modules, ' + CARDIO.calculators.length + ' calculators.\n');

for (const c of CARDIO.calculators) {
  const tag = c.id;
  if (!KINDS.includes(c.kind)) fail(tag + ': bad kind "' + c.kind + '"');
  if (!c.short) fail(tag + ': missing short description');
  if (!c.refs || !c.refs.length) fail(tag + ': missing refs');

  if (c.kind === 'external') {
    if (!c.external) fail(tag + ': kind external but no external{} block');
    continue;
  }

  if (!Array.isArray(c.inputs) || !c.inputs.length) {
    fail(tag + ': no inputs');
    continue;
  }
  const seen = new Set();
  for (const inp of c.inputs) {
    if (!inp.id || seen.has(inp.id)) fail(tag + ': missing/duplicate input id ' + inp.id);
    seen.add(inp.id);
    if (!['check', 'select', 'number'].includes(inp.type)) fail(tag + '.' + inp.id + ': bad input type ' + inp.type);
    if (inp.type === 'select' && (!Array.isArray(inp.options) || inp.options.length < 2)) {
      fail(tag + '.' + inp.id + ': select needs >=2 options');
    }
    if (inp.type === 'number' && c.kind !== 'custom') fail(tag + '.' + inp.id + ': number input requires kind custom');
    if (inp.type === 'check' && c.kind === 'points' && typeof inp.points !== 'number') {
      fail(tag + '.' + inp.id + ': points-kind checkbox missing points');
    }
  }

  if (c.kind === 'points') {
    if (!Array.isArray(c.interpret) || !c.interpret.length) { fail(tag + ': points kind missing interpret bands'); continue; }
    let prev = -Infinity;
    for (const b of c.interpret) {
      if (typeof b.upTo !== 'number') fail(tag + ': interpret band missing upTo');
      if (b.upTo <= prev) fail(tag + ': interpret bands not strictly increasing at upTo=' + b.upTo);
      prev = b.upTo;
      if (!LEVELS.includes(b.level)) fail(tag + ': bad band level ' + b.level);
    }
    // max possible score must be covered by last band
    let max = 0;
    for (const inp of c.inputs) {
      if (inp.type === 'check') max += Math.max(0, inp.points || 0);
      else if (inp.type === 'select') max += Math.max(...inp.options.map(o => o.points || 0));
    }
    const last = c.interpret[c.interpret.length - 1];
    if (max > last.upTo) fail(tag + ': max score ' + max + ' exceeds last band upTo=' + last.upTo);
  }

  if (c.kind === 'custom') {
    if (typeof c.compute !== 'function') { fail(tag + ': custom kind missing compute()'); continue; }
    // empty values: all numbers null, checks false, selects first option
    const empty = {};
    const filled = {};
    for (const inp of c.inputs) {
      if (inp.type === 'check') { empty[inp.id] = false; filled[inp.id] = true; }
      else if (inp.type === 'select') {
        const o = inp.options[0];
        const v = ('value' in o) ? o.value : (o.points || 0);
        empty[inp.id] = v; filled[inp.id] = v;
        empty[inp.id + '__points'] = o.points || 0; filled[inp.id + '__points'] = o.points || 0;
      } else {
        empty[inp.id] = null;
        filled[inp.id] = (typeof inp.min === 'number' ? inp.min : 0) || 50;
      }
    }
    try {
      c.compute(empty); // must not throw (may return null)
    } catch (e) {
      fail(tag + ': compute() threw on empty inputs: ' + e.message);
    }
    try {
      const out = c.compute(filled);
      if (out !== null && out !== undefined) {
        if (typeof out.value !== 'string') fail(tag + ': compute().value must be a string, got ' + typeof out.value);
        if (out.level && !LEVELS.includes(out.level)) fail(tag + ': compute() bad level ' + out.level);
      }
    } catch (e) {
      fail(tag + ': compute() threw on filled inputs: ' + e.message);
    }
  }
}

// per-category counts
const counts = {};
for (const c of CARDIO.calculators) counts[c.category] = (counts[c.category] || 0) + 1;
console.log('Calculators per category:');
for (const cat of CARDIO.categories) {
  console.log('  ' + cat.id.padEnd(12) + (counts[cat.id] || 0));
}

const externals = CARDIO.calculators.filter(c => c.kind === 'external').length;
console.log('\nNative: ' + (CARDIO.calculators.length - externals) + '  External links: ' + externals);

if (failures) {
  console.error('\n' + failures + ' failure(s).');
  process.exit(1);
}
console.log('\nAll checks passed.');
