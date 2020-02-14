// directionClass.js: add mouse in and out direction className to element
// TODO: detect only x or y axis
/* EXAMPLE
	directionClass(`.js-button`, {
		axis: `x`
	});
*/

function directionClass(selector) {
	const el = document.querySelectorAll(selector);

	function getPosition(el) {
		let x = 0;
		let y = 0;

		while (el) {
			x += (el.offsetLeft + el.clientLeft);
			y += (el.offsetTop + el.clientTop);

			el = el.offsetParent;
		}

		return {
			x,
			y
		};
	}

	function getDirection(ev, el) {
		const w = el.offsetWidth;
		const h = el.offsetHeight;
		const position = getPosition(el);

		// Calculate the x/y value of the pointer entering/exiting, relative to the center of the item.
		const x = (ev.pageX - position.x - (w / 2)) * (w > h ? (h / w) : 1);
		const y = (ev.pageY - position.y - (h / 2)) * (h > w ? (w / h) : 1);

		// Calculate the angle the pointer entered/exited and convert to clockwise format (top/right/bottom/left = 0/1/2/3). - https://stackoverflow.com/a/3647634
		const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;

		switch(d) {
		case 0:
			return `top`;
		case 1:
			return `right`;
		case 2:
			return `bottom`;
		case 3:
			return `left`;
		default:
			return `top`;
		}
	}

	function resetClass(el, params) {
		el.className = params.initClass;
	}

	function handleMouseEnter(ev, el, params) {
		const direction = getDirection(ev, el);
		el.classList.remove(`is-unhovered`);
		el.classList.remove(`out-top`);
		el.classList.remove(`out-right`);
		el.classList.remove(`out-bottom`);
		el.classList.remove(`out-left`);
		el.classList.add(`is-hovering`);
		el.classList.add(`in-${direction}`);
	}

	function handleMouseLeave(ev, el, params) {
		const direction = getDirection(ev, el);
		el.classList.remove(`is-hovering`);
		el.classList.remove(`in-top`);
		el.classList.remove(`in-right`);
		el.classList.remove(`in-bottom`);
		el.classList.remove(`in-left`);
		// resetClass(el, params);
		el.classList.add(`is-unhovered`);
		el.classList.add(`out-${direction}`);
		el.addEventListener(`animationend`, () => {
			el.classList.remove(`is-unhovered`);
			el.classList.remove(`out-${direction}`);
		}, {
			once: true
		});
	}

	el.forEach(el => {
		const initClass = el.className;

		const params = {
			initClass
		};

		el.addEventListener(`mouseenter`, (ev) => {
			handleMouseEnter(ev, el, params);
		});
		el.addEventListener(`mouseleave`, (ev) => {
			handleMouseLeave(ev, el, params);
		});
	});
}

directionClass.version = `1.0.0`;
