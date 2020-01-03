// elMover.js: move elements depending of breakpoints
// TODO: add options for callback
/* OPTIONS
	data-mover-breakpoint="[width]" -> mover breakpoint width
	data-mover-target="[selector]" -> mover will append selected element to this selector
	*/
/* EXAMPLE
	elMover(`.js-mover`);
*/

function elMover(selector) {
	const moversEl = document.querySelectorAll(selector);

	function moverStart(element) {
		const thisEl = element;

		thisEl.insertAdjacentHTML(`beforebegin`, `<div class="js-mover-source"></div>`);

		const moversElource = thisEl.previousElementSibling,
			moverTargetEl = document.querySelector(thisEl.dataset.moverTarget),
			moverBreakpoint = thisEl.dataset.moverBreakpoint;
		let windowWidth = document.documentElement.clientWidth;

		if (windowWidth >= moverBreakpoint) {
			moverTargetEl.appendChild(thisEl);
		}

		window.addEventListener(`resize`, function() {
			windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= moverBreakpoint) {
				if (thisEl.parentNode !== moverTargetEl) {
					moverTargetEl.appendChild(thisEl);
				}
			} else {
				if (thisEl.parentNode !== moversElource) {
					moversElource.parentNode.insertBefore(thisEl, moversElource.nextSibling);
				}
			}
		});
	}

	moversEl.forEach(element => moverStart(element));
}

elMover.version = `1.0.0`;
