window.View = (function (window) {
	const Mediator = window.Mediator;

	class View {
		constructor() {
			const name = this.constructor.name.slice(0, -4).toLowerCase();
			if (name) {
				this._el = document.getElementById(name);
			}
			if (!this._el) {
				this._el = document.createElement('div');
				document.body.appendChild(this._el);
			}
			this._destroyed = false;
			this.mediator = new Mediator;

			this.hide();
		}

		show() {
			if (!this._destroyed) {
				this._el.hidden = false;
			}
		}

		hide() {
			if (!this._destroyed) {
				this._el.hidden = true;
			}
		}

		destroy() {
			if (this._destroyed) {
				return;
			}
			this.hide();
			document.body.removeChild(this._el);
			this._el = null;
			this._destroyed = true;
		}
	}


	return View;
})(window);
