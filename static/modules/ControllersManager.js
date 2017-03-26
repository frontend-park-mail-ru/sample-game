window.ControllersManager = (function (window) {

	class ControllersManager {
		constructor() {
			console.log('ControllersManager.fn');

			this.previous = {};
			this.keys = {};

			this._onPress = this._keyHandler.bind(this, 'press');
			this._onUp = this._keyHandler.bind(this, 'up');
		}

		/**
		 * Начинаем слушать события клавиатуры
		 */
		init() {
			document.addEventListener('keydown', this._onPress);
			document.addEventListener('keyup', this._onUp);
		}

		/**
		 * Получить клавиши, нажатые с момента прошлого запроса
		 * @returns {*}
		 */
		diff() {
			let allkeys = [];
			allkeys.push.apply(allkeys, Object.keys(this.previous));
			allkeys.push.apply(allkeys, Object.keys(this.keys));
			allkeys = allkeys.map(k => k.toLowerCase());
			allkeys = allkeys.filter((key, pos, all) => {
				return all.indexOf(key, pos + 1) === -1;
			});

			const clicked = allkeys.reduce((res, key) => {
				res[key] = !this.previous[key] && this.keys[key];
				return res;
			}, {});

			this.previous = Object.assign({}, this.keys);
			return clicked;
		}


		/**
		 * Нажата ли клавиша?
		 * @param  {string}  key
		 * @return {boolean}
		 */
		is(key) {
			return this.keys[key];
		}

		/**
		 * Обработчик события
		 * @param  {string} type
		 * @param  {MouseEvent} event
		 */
		_keyHandler(type, event) {
			this.keys[event.key.toLowerCase()] = type === 'press';
		}

		/**
		 * Прекращаем слушать события клавиатуры
		 */
		destroy() {
			document.removeEventListener('keydown', this._onPress);
			document.removeEventListener('keyup', this._onUp);
		}
	}


	return ControllersManager;
})(window);
