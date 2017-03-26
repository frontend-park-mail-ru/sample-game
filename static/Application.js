window.Application = (function (window) {
	const EVENTS = window.EVENTS;
	const Mediator = window.Mediator;
	const FinishView = window.FinishView;
	const GameView = window.GameView;
	const GreetView = window.GreetView;
	const WaitView = window.WaitView;
	const MultiPlayerStrategy = window.MultiPlayerStrategy;
	const SinglePlayerStrategy = window.SinglePlayerStrategy;
	const SinglePlayerSmartStrategy = window.SinglePlayerSmartStrategy;
	const Game = window.Game;

	const STRATEGIES = {
		SINGLE: SinglePlayerStrategy,
		MULTI: MultiPlayerStrategy,
		SMART: SinglePlayerSmartStrategy
	};

	const mediator = new Mediator;

	class Application {
		constructor() {
			this.views = {
				finish: new FinishView,
				game: new GameView,
				greet: new GreetView,
				wait: new WaitView,
			};

			this._subscribed = [];
			this.mediatorCallback = function (event) {
				const name = event.name;
				const payload = event.payload;

				this._subscribed.forEach(data => {
					if (data.name !== name) {
						return;
					}

					if (data.callback && typeof this[data.callback] === 'function') {
						this[data.callback](payload);
					}
				})
			}.bind(this);

			this.game = null;
			this.opts = null;


			this.subscribe(EVENTS.OPEN_WAITING_VIEW, 'waitOpponent');
			this.subscribe(EVENTS.OPEN_FINISH_VIEW, 'finishGame');
			this.subscribe(EVENTS.OPEN_GAME_VIEW, 'startGame');
			this.subscribe(EVENTS.MODE_CHOOSED, 'onGreet');
			this.subscribe(EVENTS.DESTROY_APP, 'destroy');
		}

		start() {
			this.views.greet.show();
		}

		waitOpponent(payload) {
			if (this.views.greet) {
				this.views.greet.hide();
				this.views.greet.destroy();
				delete this.views.greet;
			}

			if (this.views.wait) {
				this.views.wait.show();
			}
		}

		startGame(payload) {
			this.views.wait.hide();
			this.views.wait.destroy();
			delete this.views.wait;

			this.views.game.show();
		}

		finishGame(payload) {
			console.log(`Application.fn.finishGame`, payload);
			this.views.game.hide();
			this.views.game.destroy();
			delete this.views.game;

			this.game.destroy();
			this.game = null;


			this.views.finish.show({text: payload.results});
		}

		onGreet(payload) {
			console.log(`Application.fn.onGreet`, payload);

			const gamemode = (payload.mode || '').toUpperCase();
			const username = (payload.username || '').toUpperCase();

			if (gamemode && STRATEGIES[gamemode]) {
				const Strategy = STRATEGIES[gamemode];
				this.opts = {Strategy, username};
				const gameCanvas = this.views.game.canvas;
				this.game = new Game(Strategy, username, gameCanvas);

				this.unsubscribe(EVENTS.MODE_CHOOSED);
				this.waitOpponent();
			}
		}

		subscribe(event, callbackName) {
			this._subscribed.push({name: event, callback: callbackName});
			mediator.on(event, this.mediatorCallback);
		}

		unsubscribe(event) {
			this._subscribed = this._subscribed.filter(data => data.name !== event);
			mediator.off(event, this.mediatorCallback);
		}

		destroy() {
			this._subscribed.forEach(data => mediator.off(data.name, this.mediatorCallback));
			this._subscribed = null;
		}
	}


	return Application;
})(window);
