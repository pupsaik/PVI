const CACHE_NAME = 'student-app-v1';

const CACHE_ASSETS = [
  '/',
  '/students.html',
  '/dashboard.html',
  '/css/styles.css',
  '/css/students.css',
  '/js/script.js',
  '/js/table.js',
  '/js/students.js',
  '/js/ui.js',
  '/components/header.html',
  '/components/sidebar.html',
  '/assets/images/offline.png',
  '/assets/images/bell.png',
  '/assets/images/bell-new.png',
  '/assets/images/user.png',
  '/assets/images/edit.png',
  '/assets/images/delete.png'
];

// Встановлення Service Worker і кешування основних ресурсів
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Відкрито кеш');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Очищення старих кешів при активації
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегія кешування: "Cache First, Network Fallback"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Спочатку повертаємо з кешу, якщо є
        if (response) {
          return response;
        }

        // Якщо немає в кеші, робимо запит до мережі
        return fetch(event.request)
          .then(networkResponse => {
            // Перевіряємо, чи валідна відповідь
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Клонуємо відповідь, щоб кешувати її
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(error => {
            console.log('Помилка завантаження з мережі:', error);
            
            // Якщо це запит на HTML-сторінку, можна повернути офлайн-сторінку
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Обробка запитів API
self.addEventListener('fetch', event => {
  // Перевіряємо, чи це запит до API
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      // Стратегія "Network First, Cache Fallback" для API
      fetch(event.request)
        .then(response => {
          // Кешуємо успішну відповідь від мережі
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME + '-api').then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Якщо мережа недоступна, повертаємо з кешу
          return caches.match(event.request);
        })
    );
    return; // Важливо для запобігання подвійної обробки
  }
});