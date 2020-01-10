// elementMover.js: move elements depending of breakpoints
/* OPTIONS
	data-mover-breakpoint="[px]" -> mover viewport width breakpoint
	data-mover-target="[selector]" -> mover will append selected element to this selector
	*/
/* EXAMPLE
	elementMover(`.js-mover`, {
		breakpoint: 768,
		target: `#sidenav`
	});
*/

function elementMover(selector, options = {}) {
	const moversEl = document.querySelectorAll(selector);

	function moverStart(element) {
		const thisEl = element;

		thisEl.insertAdjacentHTML(`beforebegin`, `<div class="js-mover-source"></div>`);

		const sourceEl = thisEl.previousElementSibling;
		const targetEl = document.querySelector(thisEl.dataset.moverTarget) || document.querySelector(options.target);
		const breakpoint = parseInt(thisEl.dataset.moverBreakpoint) || options.breakpoint;

		let windowWidth = document.documentElement.clientWidth;

		if (windowWidth >= breakpoint) {
			targetEl.appendChild(thisEl);
		}

		window.addEventListener(`resize`, function() {
			windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= breakpoint) {
				if (thisEl.parentNode !== targetEl) {
					targetEl.appendChild(thisEl);
				}
			} else {
				if (thisEl.parentNode !== sourceEl) {
					sourceEl.parentNode.insertBefore(thisEl, sourceEl.nextSibling);
				}
			}
		});
	}

	moversEl.forEach(element => moverStart(element));
}

elementMover.version = `1.0.0`;
