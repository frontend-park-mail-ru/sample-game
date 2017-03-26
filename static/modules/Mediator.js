window.Mediator = (function (window) {
	const EventEmitter2 = window.EventEmitter2;

	/**
	 * Медиатор (Event Bus)
	 * @global
	 * @class Mediator
	 */
	class Mediator {
		constructor() {
			if (Mediator.__instance) {
				return Mediator.__instance;
			}
			Mediator.__instance = this;

			this.__emitter = new EventEmitter2({});
		}

		static initialize() {
			new Mediator;
		}

		/**
		 * Добавить обработчик на событие
		 * @param {String} name - имя события
		 * @param {Function} func - функция-обработчик
		 */
		on(name, func) {
			// console.log('Mediator.fn.on', arguments);
			this.__emitter.on(name, func);
		}

		/**
		 * Стриггерить событие
		 * @param {String} name - имя события
		 * @param {Object} [payload=null] - объект с данными события
		 */
		emit(name, payload = null) {
			// console.log('Mediator.fn.emit', arguments);
			this.__emitter.emit(name, {name, payload});
		}

		/**
		 * Убрать обработчик события
		 * @param {String} name - имя события
		 * @param {Function} func - функция-обработчик
		 */
		off(name, func) {
			console.log('Mediator.fn.off', arguments);
			this.__emitter.off(name, func);
		}
	}

	return Mediator;
})(window);
