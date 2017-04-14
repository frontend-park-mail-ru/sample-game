// наименование для нашего хранилища кэша
const CACHE_NAME = 'app_serviceworker_v_1';
// ссылки на кэшируемые файлы
const cacheUrls = [
	'/',
	'/finish/',
	'/reset.css',
	'/milligram.css',
	'/styles.css',
	'/preloader.css',
	'/fireworks.css',

	'/events.js',
	'/lib/eventemitter2.js',

	'/modules/ControllersManager.js',
	'/modules/Mediator.js',

	'/transports/MagicTransport.js',

	'/game-modules/GameScene.js',
	'/game-modules/GameStrategy.js',
	'/game-modules/game-strategies/SinglePlayerStrategy.js',
	'/game-modules/game-strategies/MultiPlayerStrategy.js',
	'/game-modules/game-strategies/SinglePlayerSmartStrategy.js',
	'/game-modules/GameManager.js',
	'/game-modules/Game.js',

	'/views/View.js',
	'/views/GreetView.js',
	'/views/WaitView.js',
	'/views/GameView.js',
	'/views/FinishView.js',

	'/Application.js',
	'/main.js',
];

this.addEventListener('install', function (event) {
	// задержим обработку события
	// если произойдёт ошибка, serviceWorker не установится
	event.waitUntil(
		// находим в глобальном хранилище Cache-объект с нашим именем
		// если такого не существует, то он будет создан
		caches.open(CACHE_NAME)
			.then(function (cache) {
				// загружаем в наш cache необходимые файлы
				return cache.addAll(cacheUrls);
			})
	);
});

this.addEventListener('fetch', function (event) {
	// console.log(event);
	event.respondWith(
		// ищем запрашиваемый ресурс в хранилище кэша
		caches.match(event.request).then(function (cachedResponse) {

			// выдаём кэш, если он есть
			if (cachedResponse) {
				return cachedResponse;
			}

			// иначе запрашиваем из сети как обычно
			return fetch(event.request);
		})
	);
});
