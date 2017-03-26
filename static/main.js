(function (window) {
	const Application = window.Application;
	const Mediator = window.Mediator;
	const MagicTransport = window.MagicTransport;

	Mediator.initialize();
	MagicTransport.initialize();
	const app = new Application;
	app.start();

})(window);
