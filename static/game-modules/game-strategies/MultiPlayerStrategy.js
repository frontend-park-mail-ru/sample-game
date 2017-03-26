window.MultiPlayerStrategy = (function (window) {
	const Mediator = window.Mediator;
	const GameStrategy = window.GameStrategy;
	const MagicTransport = window.MagicTransport;

	const mediator = new Mediator;
	const transport = new MagicTransport;

	const KEYS = {
		FIRE: [' ', 'Enter'],
		LEFT: ['a', 'A', 'ф', 'Ф', 'ArrowLeft'],
		RIGHT: ['d', 'D', 'в', 'В', 'ArrowRight'],
		DOWN: ['s', 'S', 'ы', 'Ы', 'ArrowDown'],
		UP: ['w', 'W', 'ц', 'Ц', 'ArrowUp'],
	};

	const gameEventsReseived = [
		'SIGNAL_TO_WAIT_OPPONENT',
		'SIGNAL_START_THE_GAME',
		'SIGNAL_FINISH_GAME',
		'SIGNAL_NEW_GAME_STATE'
	];

	class MultiPlayerStrategy extends GameStrategy {
		constructor() {
			console.log('MultiPlayerStrategy.fn');
			super();

			this.subscribe('SIGNAL_START_THE_GAME', 'onStart');
			this.subscribe('SIGNAL_NEW_GAME_STATE', 'onNewState');
			this.subscribe('SIGNAL_FINISH_GAME', 'onFinishGame');
			this.subscribe('SIGNAL_TO_WAIT_OPPONENT', 'onWaitOpponent');
		}

		onStart(payload) {
			console.dir(payload);
			this.fireOpponentFound(payload.me, payload.opponent);
			this.fireStartGame();
		}

		onNewState(state) {
			this.state = state;

			this.fireSetNewGameState(this.state);
		}

		onFinishGame(payload) {
			this.fireGameOver(payload.message || 'Игра окончена');
		}

		onWaitOpponent() {
			this.fireWaitOpponent();
		}

		onLoggedIn(payload) {
			console.log('MultiPlayerStrategy.fn.onLoggedIn', arguments);
			this.me = payload.username;

			this.fireWaitOpponent();
			transport.send('newPlayer', {username: payload.username});
		}

		onNewCommand(payload) {
			console.log('MultiPlayerStrategy.fn.onNewCommand', payload);
			if (this._pressed('FIRE', payload)) {
				transport.send('newCommand', {code: 'FIRE'});
				return;
			}
			if (this._pressed('LEFT', payload)) {
				transport.send('newCommand', {code: 'LEFT'});
				return;
			}
			if (this._pressed('RIGHT', payload)) {
				transport.send('newCommand', {code: 'RIGHT'});
				return;
			}
			if (this._pressed('UP', payload)) {
				transport.send('newCommand', {code: 'UP'});
				return;
			}
			if (this._pressed('DOWN', payload)) {
				transport.send('newCommand', {code: 'DOWN'});
				return;
			}
		}

		_pressed(name, data) {
			return KEYS[name].some(k => data[k.toLowerCase()]);
		}
	}


	return MultiPlayerStrategy;
})(window);
