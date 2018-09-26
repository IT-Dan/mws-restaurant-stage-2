var staticCacheName = 'restaurant-v5';
var contentImgsCache = 'restaurant-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache
];

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'css/styles.css',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'js/main.js',
        'manifest.json',
        'https://raw.githubusercontent.com/necolas/normalize.css/master/normalize.css'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all( 
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-v4') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open('restaurant-v5')
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) { 
              return caches.open('restaurant-v5')
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});   
  
