'use strict';

const debug = require('debug')('app:game');

class Game {
	constructor() {
		debug('Создаём инстанс игры');
		this.player1 = null;
		this.player2 = null;
		this.inplay = false;
		this.interval = null;
		this.gameState = null;

		this.eventsMap = {
			'newPlayer': 'onNewPlayerLoggedIn',
			'newCommand': 'onNewCommand'
		}
	}

	addPlayer(player) {
		debug('Добавляем нового игрока');
		let id = null;
		if (!this.player1) {
			this.player1 = player;
			id = 'player1';
		} else if (!this.player2) {
			this.player2 = player;
			id = 'player2';
		} else {
			return;
		}

		debug(`Добавили игрока ${id}`);

		player.id = id;

		player.on('close', function () {
			debug(`Игрок ${id} отключился`);
			this.stop(id);

		}.bind(this));

		player.on('message', function (msg) {
			if (msg === 'update') {
				return;
			}
			debug(`Игрок ${id} прислал message`, msg);
			this.handleMessageFromPlayer(id, msg);
		}.bind(this));
	}

	stop(id) {
		if (this.inplay) {
			this.reset();
		}
		if (this[id]) {
			this[id].close();
		}
		this[id] = null;
	}

	reset() {
		debug('Сбрасываем инстанс игры');
		['player1', 'player2'].forEach(id => this.send(id, 'SIGNAL_FINISH_GAME', {message: 'Игра окончена. Ваш противник покинул игру'}));
		if (this.player1) {
			this.player1.close();
		}
		if (this.player2) {
			this.player2.close();
		}
		this.player1 = null;
		this.player2 = null;
		this.inplay = false;
		this.gameState = null;
		if (this.interval) {
			clearInterval(this.interval)
		}
	}

	send(id, type, payload = null) {
		try {
			if (this[id]) {
				let body = JSON.stringify({type, payload});
				if (type !== 'SIGNAL_NEW_GAME_STATE') {
					debug(`send to ${id}`, body);
				}
				this[id].send(body);
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	onNewPlayerLoggedIn(id, payload) {
		debug(id, payload);
		this[id].username = payload.username;
		debug([this['player1'] && this['player1'].username, this['player2'] && this['player2'].username]);
		if (this['player1'] && this['player1'].username && this['player2'] && this['player2'].username) {
			this.startGame();
		} else {
			this.send(id, 'SIGNAL_TO_WAIT_OPPONENT');
		}
	}

	onfire(id) {
		switch (id) {
			case 'player1' : {
				this.gameState.bullets.push({
					x: this.gameState[id].xpos,
					y: this.gameState[id].ypos + 1,
					dir: 'up'
				});
				break;
			}

			case 'player2' : {
				this.gameState.bullets.push({
					x: this.gameState[id].xpos,
					y: this.gameState[id].ypos - 1,
					dir: 'down'
				});
				break;
			}
		}
	}

	onleft(id) {
		switch (id) {
			case 'player1' : {
				this.gameState[id].xpos--;
				if (this.gameState[id].xpos < 1) {
					this.gameState[id].xpos = 1;
				}
				break;
			}

			case 'player2' : {
				this.gameState[id].xpos++;
				if (this.gameState[id].xpos > 18) {
					this.gameState[id].xpos = 18;
				}
				break;
			}
		}
	}

	onright(id) {
		switch (id) {
			case 'player1' : {
				this.gameState[id].xpos++;
				if (this.gameState[id].xpos > 18) {
					this.gameState[id].xpos = 18;
				}
				break;
			}

			case 'player2' : {
				this.gameState[id].xpos--;
				if (this.gameState[id].xpos < 1) {
					this.gameState[id].xpos = 1;
				}
				break;
			}
		}
	}

	onup(id) {
		switch (id) {
			case 'player1' : {
				this.gameState[id].ypos++;
				if (this.gameState[id].ypos > 6) {
					this.gameState[id].ypos = 6;
				}
				break;
			}

			case 'player2' : {
				this.gameState[id].ypos--;
				if (this.gameState[id].ypos < 27) {
					this.gameState[id].ypos = 27;
				}
				break;
			}
		}
	}

	ondown(id) {
		switch (id) {
			case 'player1' : {
				this.gameState[id].ypos--;
				if (this.gameState[id].ypos < 1) {
					this.gameState[id].ypos = 1;
				}
				break;
			}

			case 'player2' : {
				this.gameState[id].ypos++;
				if (this.gameState[id].ypos > 32) {
					this.gameState[id].ypos = 32;
				}
				break;
			}
		}
	}

	onNewCommand(id, payload) {
		const code = payload.code;
		debug(`onNewCommand`, id, code);
		if (['fire', 'up', 'down', 'left', 'right'].includes(code.toLowerCase())) {
			this[`on${code.toLowerCase()}`](id);
		}
	}

	startGame() {
		this.gameState = {
			bullets: [],
			player1: {
				xpos: 1,
				ypos: 1,
				hp: 10,
				name: this['player1'].username
			},
			player2: {
				xpos: 18,
				ypos: 32,
				hp: 10,
				name: this['player2'].username
			}
		};
		this.send('player1', 'SIGNAL_START_THE_GAME', {
			me: this['player1'].username,
			opponent: this['player2'].username
		});
		this.send('player2', 'SIGNAL_START_THE_GAME', {
			me: this['player2'].username,
			opponent: this['player1'].username
		});
		this.interval = setInterval(() => this.gameLoop(), 100);
		this.inplay = true;
	}

	prepareStateToSend1(state) {
		const state1 = {};
		state1.me = state.player1;
		state1.opponent = state.player2;
		state1.bullets = state.bullets;
		return state1;
	}

	prepareStateToSend2(state) {
		const state2 = {};
		state2.opponent = Object.assign({}, state.player1);
		state2.opponent.xpos = 19 - state2.opponent.xpos;
		state2.opponent.ypos = 33 - state2.opponent.ypos;

		state2.me = Object.assign({}, state.player2);
		state2.me.xpos = 19 - state2.me.xpos;
		state2.me.ypos = 33 - state2.me.ypos;

		state2.bullets = state.bullets.map(b => {
			let nb = {};
			if (b.dir === 'up') {
				nb.dir = 'down';
			} else {
				nb.dir = 'up';
			}
			nb.x = 19 - b.x;
			nb.y = 33 - b.y;
			return nb;
		});
		return state2;
	}

	stopFinishGame(idwin, idfall) {
		this.send(idwin, 'SIGNAL_FINISH_GAME', {message: `Игра окончена. Вы победили (${this.gameState[idwin].name}(${this.gameState[idwin].hp})/${this.gameState[idfall].name}(${this.gameState[idfall].hp}))`});
		this.send(idfall, 'SIGNAL_FINISH_GAME', {message: `Игра окончена. Вы проиграли (${this.gameState[idwin].name}(${this.gameState[idwin].hp})/${this.gameState[idfall].name}(${this.gameState[idfall].hp}))`});

		if (this.player1) {
			this.player1.close();
		}
		if (this.player2) {
			this.player2.close();
		}

		this.player1 = null;
		this.player2 = null;
		this.reset();
	}

	gameLoop() {
		if (this.gameState && this.gameState.bullets) {
			this.gameState.bullets = this.gameState.bullets.map(blt => {
				switch (blt.dir) {
					case 'down': {
						blt.y--;
						if (Math.abs(this.gameState.player1.xpos - blt.x) <= 1) {
							if (Math.abs(this.gameState.player1.ypos - blt.y) <= 1) {
								this.gameState.player1.hp--;
								return null;
							}
						}
						break;
					}
					case 'up': {
						blt.y++;
						if (Math.abs(this.gameState.player2.xpos - blt.x) <= 1) {
							if (Math.abs(this.gameState.player2.ypos - blt.y) <= 1) {
								this.gameState.player2.hp--;
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
			this.gameState.bullets = this.gameState.bullets.filter(blt => blt);
		}


		if (this.gameState.player1.hp <= 0) {
			return this.stopFinishGame('player2', 'player1');
		}

		if (this.gameState.player2.hp <= 0) {
			return this.stopFinishGame('player1', 'player2');

		}

		this.send('player1', 'SIGNAL_NEW_GAME_STATE', this.prepareStateToSend1(this.gameState));
		this.send('player2', 'SIGNAL_NEW_GAME_STATE', this.prepareStateToSend2(this.gameState));
	}

	handleMessageFromPlayer(id, msg) {
		try {
			const parsed = JSON.parse(msg);
			const {type, payload} = parsed;
			debug({type, payload});
			debug(this.eventsMap[type]);
			debug(this[this.eventsMap[type]]);

			if (this.eventsMap[type] && typeof this[this.eventsMap[type]] === 'function') {
				this[this.eventsMap[type]](id, payload);
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

module.exports = Game;
