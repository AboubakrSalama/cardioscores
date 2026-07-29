/* CardioScores service worker — offline-first for bedside use.
 * Bump CACHE when any asset below changes so clients pick up the update. */
var CACHE = 'cardioscores-v3';
var ASSETS = [
  './',
  './index.html',
  './privacy.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/registry.js',
  './js/app.js',
  './js/calculators/prevention.js',
  './js/calculators/acs.js',
  './js/calculators/ischemia.js',
  './js/calculators/heart-failure.js',
  './js/calculators/af-anticoagulation.js',
  './js/calculators/ep-syncope.js',
  './js/calculators/ecg.js',
  './js/calculators/pci.js',
  './js/calculators/cardiac-surgery.js',
  './js/calculators/preop.js',
  './js/calculators/vte-aorta.js',
  './js/calculators/advanced-hf.js',
  './js/calculators/congenital-pregnancy.js',
  './js/calculators/imaging-valves.js',
  './js/calculators/misc.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Cache-first for app shell + assets, with network fallback that refreshes the cache.
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
