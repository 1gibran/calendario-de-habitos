const CACHE_NAME = 'habitos-v1';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/tablaHabitos.js',
    './js/graficaMensual.js',
    './js/graficaSemanal.js',
    './js/graficaDiaria.js',
    './js/contadorMeta.js',
    './js/tema.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});