window.SinglePlayerStrategy = (function (window) {
	const Mediator = window.Mediator;
	const GameStrategy = window.GameStrategy;

	const mediator = new Mediator;

	const KEYS = {
		FIRE: [' ', 'Enter'],
		LEFT: ['a', 'A', 'ф', 'Ф', 'ArrowLeft'],
		RIGHT: ['d', 'D', 'в', 'В', 'ArrowRight'],
		DOWN: ['s', 'S', 'ы', 'Ы', 'ArrowDown'],
		UP: ['w', 'W', 'ц', 'Ц', 'ArrowUp'],
	};


	class SinglePlayerStrategy extends GameStrategy {
		constructor() {
			console.log('SinglePlayerStrategy.fn');
			super();

			this.interval = null;
		}

		onLoggedIn(payload) {
			console.log('SinglePlayerStrategy.fn.onLoggedIn', arguments);
			this.me = payload.username;
			this.opponent = 'Jhon Snow';
			this.fireOpponentFound(this.me, this.opponent);
			this.fireStartGame();
			this.state = {
				bullets: [],
				me: {
					xpos: 1,
					ypos: 1,
					hp: 10
				},
				opponent: {
					xpos: 18,
					ypos: 32,
					hp: 10
				}
			};

			this.startGameLoop();
		}

		onNewCommand(payload) {
			console.log('SinglePlayerStrategy.fn.onNewCommand', payload);
			if (this._pressed('FIRE', payload)) {
				const bullet = {
					x: this.state.me.xpos,
					y: this.state.me.ypos + 1,
					dir: 'up'
				};
				this.state.bullets.push(bullet);
				return;
			}
			if (this._pressed('LEFT', payload)) {
				if (this.state.me.xpos > 1) {
					this.state.me.xpos--;
				}
				return;
			}
			if (this._pressed('RIGHT', payload)) {
				if (this.state.me.xpos < 18) {
					this.state.me.xpos++;
				}
				return;
			}
			if (this._pressed('UP', payload)) {
				if (this.state.me.ypos < 6) {
					this.state.me.ypos++;
				}
				return;
			}
			if (this._pressed('DOWN', payload)) {
				if (this.state.me.ypos > 1) {
					this.state.me.ypos--;
				}
				return;
			}

		}

		gameLoop() {
			if (this.state && this.state.bullets) {
				this.state.bullets = this.state.bullets.map(blt => {
					switch (blt.dir) {
						case 'down': {
							blt.y--;
							if (Math.abs(this.state.me.xpos - blt.x) <= 1) {
								if (Math.abs(this.state.me.ypos - blt.y) <= 1) {
									this.state.me.hp--;
									return null;
								}
							}
							break;
						}
						case 'up': {
							blt.y++;
							if (Math.abs(this.state.opponent.xpos - blt.x) <= 1) {
								if (Math.abs(this.state.opponent.ypos - blt.y) <= 1) {
									this.state.opponent.hp--;
									return null;
								}
							}
							break;
						}
					}
					if (blt.y > 33 || blt.y < 0) {
						return null;
					}
					return blt;
				});
				this.state.bullets = this.state.bullets.filter(blt => blt);
			}

			if (this.state.me.hp <= 0) {
				return this.fireGameOver(`Игра окончена, вы проиграли (${this.me}:${this.state.me.hp} / ${this.opponent}:${this.state.opponent.hp})`);
			}

			if (this.state.opponent.hp <= 0) {
				return this.fireGameOver(`Игра окончена, вы победили (${this.me}:${this.state.me.hp} / ${this.opponent}:${this.state.opponent.hp})`);
			}

			this.fireSetNewGameState(this.state);
		}

		startGameLoop() {
			this.interval = setInterval(() => this.gameLoop(), 100);
		}

		stopGameLoop() {
			if (this.interval) {
				clearInterval(this.interval);
			}
		}

		_pressed(name, data) {
			return KEYS[name].some(k => data[k.toLowerCase()]);
		}

		destroy() {
			super.destroy();

			this.stopGameLoop();
		}
	}


	return SinglePlayerStrategy;
})(window);
