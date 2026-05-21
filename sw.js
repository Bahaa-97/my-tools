const CACHE_NAME = 'daily-tools-v1.1';

// Since we have many tools, we will use a cache-first or network-first strategy.
// For simplicity, we just listen to fetch and cache as we go (Stale-While-Revalidate).

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                './',
                'index.html',
                'styles.css',
                'registry.js',
                'js/app.js',
                'js/bg.js'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;
    
    // Ignore chrome-extension:// etc
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const networkFetch = fetch(event.request).then(response => {
                // cache the new response
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(() => {
                // Offline fallback if needed
                return cachedResponse;
            });
            
            // Return cached response immediately if exists, while fetching network in background
            return cachedResponse || networkFetch;
        })
    );
});
