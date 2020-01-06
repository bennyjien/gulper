// popper.js: pop element from button/link
/* OPTIONS
	data-popper-trigger="click|hover" -> how will popper be triggered
	data-popper-target="[selector]" -> popper target
	data-popper-area="[selector]" -> popper will end outside this area
	data-popper-animation="slide|manual" -> how popper is handled
	data-popper-duration="[second]" -> how long is popper animation
	data-popper-focus="[selector]" -> popper will focus on targeted form
	data-popper-repeat="true|false" -> once will only trigger popper once
	data-popper-state="undefined|popped" -> popper state on page load
	data-popper-keyclose="false|true" -> popper target can be closed by keydown
	data-scroll-target="[selector]" -> scroll to target
	data-scroll-offset="[element]"
	data-scroll-duration="[second]"
*/
/* EXAMPLE
  popper(`.js-popup-link`, {
		trigger: `click`,
		target: `#popup-inline`,
		area: `#popup-inline`,
		animation: `manual`,
		duration: `0.2`,
		focus: `input[type="text"]`,
		repeat: true,
		state: `undefined`,
		keyclose: `true`,
	});
*/

function popper(selector, options = {}) {
	const body = document.querySelector(`body`);
	const popperEl = document.querySelectorAll(selector);

	function init(element, targetEl, state) {
		if (state === `popped`) {
			open(element, targetEl);
		}
	}

	function open(element, targetEl, focusEl) {
		element.classList.add(`is-popped`);
		targetEl.classList.add(`is-popped`);

		if (focusEl) {
			focusEl.focus();
		}
	}

	function close(element, targetEl) {
		element.classList.remove(`is-popped`);
		targetEl.classList.remove(`is-popped`);
	}

	function handleClick(event, element, targetEl, area, focusEl) {
		event.preventDefault();

		if (event.target === element || !event.target.closest(area)) {
			if (element.classList.contains(`is-popped`) || targetEl.classList.contains(`is-popped`)) {
				close(element, targetEl);
			} else {
				if (event.target === element) {
					open(element, targetEl, focusEl);
				}
			}
		}
	}

	function handleHover(event, element, targetEl) {
		event.preventDefault();

		if (event.type === `mouseover`) {
			open(element, targetEl);
		} else if (event.type === `mouseout`) {
			close(element, targetEl);
		}
	}


	popperEl.forEach(element => {
		const target = element.dataset.popperTarget || element.hash;
		const targetEl = document.querySelector(target);
		const area = element.dataset.popperArea || options.area || target;
		const focus = element.dataset.popperFocus || options.focus;
		const focusEl = document.querySelector(focus);
		const duration = element.dataset.popperDuration || 0.2;
		const trigger = element.dataset.popperTrigger || options.trigger || `click`;
		const state = element.dataset.popperState || options.state;

		// console.log(area);

		init(element, targetEl, state);

		if (trigger === `click`) {
			body.addEventListener(`click`, function(event) {
				handleClick(event, element, targetEl, area, focusEl);
			});
		} else if (trigger === `hover`) {
			element.addEventListener(`mouseover`, function(event) {
				handleHover(event, element, targetEl);
			});
			element.addEventListener(`mouseout`, function(event) {
				handleHover(event, element, targetEl);
			});
		}
		// element.addEventListener(`touchstart`, handleHover);
	});
}

popper.version = `1.0.0`;

// demo callback
popper(`.js-popper`, {
	// area: `.js-popper`,
	// focus: `#input-name`,
	// trigger: `hover`,
	// state: `popped`,
});
