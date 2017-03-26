window.GameView = (function (window) {
	const View = window.View;

	class GameView extends View {
		constructor() {
			super();

			this.canvas = this._el.querySelector('.game-view__canvas-element');
		}
	}


	return GameView;
})(window);
