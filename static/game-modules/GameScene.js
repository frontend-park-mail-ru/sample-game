window.GameScene = (function (window) {
	const Mediator = window.Mediator;

	const mediator = new Mediator;

	const HDim = 34;
	const WDim = 20;
	const AR = HDim / WDim;
	const userspace = 8;

	class GameScene {
		constructor(canvas) {
			console.log('GameScene.fn');

			this.canvas = canvas;
			this.ctx = this.canvas.getContext('2d');
			this.fieldSize = 1;

			this.bindedResizer = this.resizer.bind(this);
			window.addEventListener('resize', this.bindedResizer);
			this.resizer();

			this.setState({});
			this.render();
		}

		resizer() {
			const height = window.innerHeight;
			this.fieldSize = (height / HDim) | 0;

			this.canvas.dheight = this.fieldSize * HDim;
			this.canvas.dwidth = this.fieldSize * WDim;

			this.canvas.height = this.canvas.dheight;
			this.canvas.width = this.canvas.dwidth;
		}

		setState(state) {
			// console.log(`GameScene.fn.setState`, state);

			this.state = state;
		}

		render() {
			// console.log(`GameScene.fn.render`);

			const ctx = this.ctx;
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;

			ctx.beginPath();
			ctx.moveTo(0, userspace * this.fieldSize);
			ctx.lineTo(this.canvas.dwidth, userspace * this.fieldSize);
			ctx.moveTo(0, this.canvas.dheight - userspace * this.fieldSize);
			ctx.lineTo(this.canvas.dwidth, this.canvas.dheight - userspace * this.fieldSize);
			ctx.closePath();
			ctx.stroke();

			if (!this.state) {
				return;
			}
			ctx.fillStyle = 'black';

			if (this.state.bullets) {
				this.state.bullets.forEach(blt => {
					ctx.beginPath();
					ctx.arc(blt.x * this.fieldSize + 0.5 * this.fieldSize, this.canvas.dheight - (blt.y * this.fieldSize + 0.5 * this.fieldSize), this.fieldSize / 2 - 2, 0, 4 * Math.PI);
					ctx.closePath();
					ctx.fill();
				});
			}

			if (!(this.state.me && this.state.opponent)) {
				return;
			}

			ctx.fillStyle = 'blue';
			ctx.fillRect(2, this.canvas.dheight - (userspace + 5 * this.state.me.hp / 10) * this.fieldSize - 2, this.fieldSize - 4, 5 * this.state.me.hp / 10 * this.fieldSize - 4);

			ctx.fillStyle = 'red';
			ctx.fillRect(this.canvas.dwidth - this.fieldSize + 2, userspace * this.fieldSize + 2, this.fieldSize - 4, 5 * this.state.opponent.hp / 10 * this.fieldSize - 4);

			ctx.fillStyle = 'black';
			ctx.strokeRect(2, this.canvas.dheight - (userspace + 5) * this.fieldSize - 2, this.fieldSize - 4, 5 * this.fieldSize - 4);
			ctx.strokeRect(this.canvas.dwidth - this.fieldSize + 2, userspace * this.fieldSize + 2, this.fieldSize - 4, 5 * this.fieldSize - 4);

			const mx = this.state.me.xpos;
			const my = this.state.me.ypos;
			const ox = this.state.opponent.xpos;
			const oy = this.state.opponent.ypos;

			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.moveTo((mx - 1) * this.fieldSize, (this.canvas.dheight - 1) - (my - 1) * this.fieldSize);
			ctx.lineTo((mx + 2) * this.fieldSize, (this.canvas.dheight - 1) - (my - 1) * this.fieldSize);
			ctx.lineTo((mx + 2) * this.fieldSize, (this.canvas.dheight - 1) - (my + 1) * this.fieldSize);
			ctx.lineTo((mx + 1) * this.fieldSize, (this.canvas.dheight - 1) - (my + 1) * this.fieldSize);
			ctx.lineTo((mx + 1) * this.fieldSize, (this.canvas.dheight - 1) - (my + 2) * this.fieldSize);
			ctx.lineTo((mx - 0) * this.fieldSize, (this.canvas.dheight - 1) - (my + 2) * this.fieldSize);
			ctx.lineTo((mx - 0) * this.fieldSize, (this.canvas.dheight - 1) - (my + 1) * this.fieldSize);
			ctx.lineTo((mx - 1) * this.fieldSize, (this.canvas.dheight - 1) - (my + 1) * this.fieldSize);
			ctx.lineTo((mx - 1) * this.fieldSize, (this.canvas.dheight - 1) - (my - 1) * this.fieldSize);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.moveTo((ox + 2) * this.fieldSize, (this.canvas.dheight - 1) - (oy + 2) * this.fieldSize);
			ctx.lineTo((ox - 1) * this.fieldSize, (this.canvas.dheight - 1) - (oy + 2) * this.fieldSize);
			ctx.lineTo((ox - 1) * this.fieldSize, (this.canvas.dheight - 1) - (oy - 0) * this.fieldSize);
			ctx.lineTo((ox - 0) * this.fieldSize, (this.canvas.dheight - 1) - (oy - 0) * this.fieldSize);
			ctx.lineTo((ox - 0) * this.fieldSize, (this.canvas.dheight - 1) - (oy - 1) * this.fieldSize);
			ctx.lineTo((ox + 1) * this.fieldSize, (this.canvas.dheight - 1) - (oy - 1) * this.fieldSize);
			ctx.lineTo((ox + 1) * this.fieldSize, (this.canvas.dheight - 1) - (oy - 0) * this.fieldSize);
			ctx.lineTo((ox + 2) * this.fieldSize, (this.canvas.dheight - 1) - (oy - 0) * this.fieldSize);
			ctx.lineTo((ox + 2) * this.fieldSize, (this.canvas.dheight - 1) - (oy + 2) * this.fieldSize);
			ctx.closePath();
			ctx.fill();
		}

		setNames(me, opponent) {
			this.players = {me, opponent};
		}

		destroy() {
			window.removeEventListener('resize', this.bindedResizer);
		}
	}


	return GameScene;
})(window);
