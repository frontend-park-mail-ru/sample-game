window.GameStrategy = (function (window) {
	const EVENTS = window.EVENTS;
	const Mediator = window.Mediator;

	const mediator = new Mediator;

	/**
	 * GameStrategy
	 * @name GameStrategy
	 * @class GameStrategy
	 */
	class GameStrategy {
		constructor() {
			console.log('GameStrategy.fn');

			if (this.constructor.name === GameStrategy.name) {
				throw new TypeError('Can not create instance of GameStrategy');
			}

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

			this.subscribe(EVENTS.WE_ARE_LOGGED_IN, 'onLoggedIn');
			this.subscribe(EVENTS.NEXT_STEP_CONTROLS_PRESSED, 'onNewCommand');

			this.me = null;
			this.opponent = null;
			this.state = null;
		}

		onLoggedIn(payload) {
			console.log('GameStrategy.fn.onLoggedIn', arguments);
			throw new TypeError('Not implemented');
		}

		onNewCommand(payload) {
			console.log('GameStrategy.fn.onNewCommand', arguments);
			throw new TypeError('Not implemented');
		}


		fireGameOver(message) {
			console.log('GameStrategy.fn.fireGameOver', arguments);
			mediator.emit(EVENTS.FINISH_THE_GAME, {message});
		}

		fireWaitOpponent() {
			console.log('GameStrategy.fn.fireWaitOpponent', arguments);
			mediator.emit(EVENTS.WAITING_FOR_OPPONENT);
		}

		fireOpponentFound(me, opponent) {
			console.log('GameStrategy.fn.fireOpponentFound', arguments);
			mediator.emit(EVENTS.SETUP_OPPONENTS, {me, opponent});
		}

		fireStartGame() {
			console.log('GameStrategy.fn.fireStartGame', arguments);
			mediator.emit(EVENTS.START_THE_GAME);
		}

		fireSetNewGameState(state) {
			// console.log('GameStrategy.fn.fireSetNewGameState', arguments);
			mediator.emit(EVENTS.SET_NEW_GAME_STATE, {state});
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

	return GameStrategy;
})(window);
