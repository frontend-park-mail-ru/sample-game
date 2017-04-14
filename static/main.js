(function (window) {
	const Application = window.Application;
	const Mediator = window.Mediator;
	const MagicTransport = window.MagicTransport;

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js')
			.then(function (registration) {
				console.log('ServiceWorker registration', registration);
			})
			.catch(function (err) {
				console.error(err);
			});
	}

	Mediator.initialize();
	MagicTransport.initialize();
	const app = new Application;
	app.start();

})(window);
