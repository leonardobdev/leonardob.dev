var APP_PREFIX = 'testServiceworker_';
var VERSION = 'v1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  '/src/img/x1024.png',
  '/src/img/x512.png',
  '/src/img/x384.png',
  '/src/img/x192.png',
  '/src/img/x128.png',
  '/src/img/x96.png',
  '/src/img/x72.png',
  '/src/img/x48.png',
  '/src/img/animated_favicon1.gif',
  '/src/img/favicon.ico',
  '/src/img/logo.svg',
  '/sw.js',
  '/',
  '/index.html',
  '/src/css/style.css',
  '/manifest.json',
  '/app.js'
];

self.addEventListener('fetch', async function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(async function (request) {
      if (request) {
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

    })
  )
});

self.addEventListener('install', async function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
});

self.addEventListener('activate', async function (e) {
  e.waitUntil(
    caches.keys().then(async function (keyList) {

      var cacheWhitelist = keyList.filter(async function (key) {
        return key.indexOf(APP_PREFIX)
      })

      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(async function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i])
          return caches.delete(keyList[i])
        }
      }))
    })
  )
});