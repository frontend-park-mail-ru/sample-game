window.GameManager = (function (window) {
	const Mediator = window.Mediator;
	const EVENTS = window.EVENTS;
	const GameScene = window.GameScene;
	const ControllersManager = window.ControllersManager;

	const mediator = new Mediator;

	class GameManager {
		/**
		 *
		 * @param username
		 * @param canvas
		 * @param {GameStrategy} Strategy
		 */
		constructor(username, canvas, Strategy) {
			console.log('GameManager.fn');

			this._subscribed = [];
			this.mediatorCallback = function (event) {
				const name = event.name;
				const payload = event.payload;

				const r = this._subscribed.find(data => {
					if (data.name !== name) {
						return;
					}

					if (data.callback && typeof this[data.callback] === 'function') {
						this[data.callback](payload);
						return true;
					}
				});

				if (!r) {
					throw new Error('Not match any callback ' + name);
				}
			}.bind(this);

			this.username = username;
			this.strategy = new Strategy;
			this.scene = new GameScene(canvas);
			this.controllers = new ControllersManager();

			this.subscribe(EVENTS.WAITING_FOR_OPPONENT, 'onWaitOpponent');
			this.subscribe(EVENTS.SETUP_OPPONENTS, 'onFindOpponent');
			this.subscribe(EVENTS.START_THE_GAME, 'onStart');
			this.subscribe(EVENTS.SET_NEW_GAME_STATE, 'onNewState');
			this.subscribe(EVENTS.FINISH_THE_GAME, 'onFinishTheGame');

			mediator.emit(EVENTS.WE_ARE_LOGGED_IN, {username});
		}

		onWaitOpponent() {
			console.log('GameManager.fn.onWaitOpponent', arguments);
			mediator.emit(EVENTS.OPEN_WAITING_VIEW);
		}

		onFindOpponent(me, opponent) {
			console.log('GameManager.fn.onFindOpponent', arguments);
			this.scene.setNames(me, opponent);
		}

		onStart() {
			console.log('GameManager.fn.onStart', arguments);
			mediator.emit(EVENTS.OPEN_GAME_VIEW);

			this.controllers.init();
			this.startGameLoop();
		}

		onNewState(payload) {
			// console.log('GameManager.fn.onNewState', payload);
			this.state = payload.state;
		}

		startGameLoop() {
			this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
		}

		gameLoop() {
			const controlsUpdates = this.controllers.diff();

			if (Object.keys(controlsUpdates).some(k => controlsUpdates[k])) {
				mediator.emit(EVENTS.NEXT_STEP_CONTROLS_PRESSED, controlsUpdates);
			}

			this.scene.setState(this.state);


			this.scene.render();
			this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
		}

		onFinishTheGame(payload) {
			console.log('GameManager.fn.onFinishTheGame', payload);

			if (this.requestID) {
				cancelAnimationFrame(this.requestID);
			}

			this.strategy.destroy();
			this.scene.destroy();
			this.controllers.destroy();

			mediator.emit(EVENTS.OPEN_FINISH_VIEW, {results: payload.message});
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


	return GameManager;
})(window);
