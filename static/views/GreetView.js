window.GreetView = (function (window) {
	const View = window.View;

	class GreetView extends View {
		constructor() {
			super();

			this.greetForm = this._el.querySelector('.greet-form');
			this.usernameInput = this.greetForm.elements['username'];
			this.chooseSingle = this.greetForm.elements['choose-single'];
			this.chooseMulti = this.greetForm.elements['choose-multi'];
			this.chooseSmart = this.greetForm.elements['choose-smart'];

			this.chooseSingle.addEventListener('click', this.onChoose.bind(this, 'single'));
			this.chooseMulti.addEventListener('click', this.onChoose.bind(this, 'multi'));
			this.chooseSmart.addEventListener('click', this.onChoose.bind(this, 'smart'));
			this.greetForm.addEventListener('submit', this.onChoose.bind(this, 'single'));
		}

		onChoose(mode, event) {
			event.preventDefault();
			const username = (this.usernameInput.value || '').trim();
			if (!username) {
				alert('Пустое имя!');
				this.usernameInput.value = '';
				return;
			}

			this.mediator.emit(EVENTS.MODE_CHOOSED, {username, mode});
		}
	}


	return GreetView;
})(window);
