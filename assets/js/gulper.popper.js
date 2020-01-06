// popper.js: pop element from button/link
/* OPTIONS
	data-popper-trigger="click|hover" -> how will popper be triggered
	data-popper-target="[selector]" -> popper target
	data-popper-area="[selector]" -> popper will end outside this area
	data-popper-animation="slide|manual" -> how popper is handled *TODO*
	data-popper-duration="[ms]" -> how long is popper animation
	data-popper-focus="[selector]" -> popper will focus on targeted form
	data-popper-state="undefined|popped" -> popper state on page load
	data-popper-keyclose="false|true" -> popper target can be closed by keydown *TODO*
	data-scroll-target="[selector]" -> scroll to target *TODO*
	data-scroll-offset="[element]" *TODO*
	data-scroll-duration="[second]" *TODO*
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

/* global wait */

function popper(selector, options = {}) {
	const body = document.querySelector(`body`);
	const popperEl = document.querySelectorAll(selector);

	function init(element, targetEl, duration, bodyClass) {
		const state = element.dataset.popperState || options.state;

		if (state === `popped`) {
			open(element, targetEl, duration, bodyClass);
		}
	}

	async function open(element, targetEl, duration, bodyClass) {
		const focus = element.dataset.popperFocus || options.focus;

		element.classList.add(`is-popping`);
		targetEl.classList.add(`is-popping`);
		body.classList.add(`${bodyClass}-is-popping`);
		await wait(duration);
		element.classList.add(`is-popped`);
		targetEl.classList.add(`is-popped`);
		body.classList.add(`${bodyClass}-is-popped`);
		element.classList.remove(`is-popping`);
		targetEl.classList.remove(`is-popping`);
		body.classList.remove(`${bodyClass}-is-popping`);

		if (focus) {
			document.querySelector(focus).focus();
		}
	}

	async function close(element, targetEl, duration, bodyClass) {
		element.classList.add(`is-unpopping`);
		targetEl.classList.add(`is-unpopping`);
		body.classList.add(`${bodyClass}-is-unpopping`);
		element.classList.remove(`is-popped`);
		targetEl.classList.remove(`is-popped`);
		body.classList.remove(`${bodyClass}-is-popped`);
		await wait(duration);
		element.classList.remove(`is-unpopping`);
		targetEl.classList.remove(`is-unpopping`);
		body.classList.remove(`${bodyClass}-is-unpopping`);
	}

	function handleClick(event, element, targetEl, area, duration, bodyClass) {
		event.preventDefault();

		if (event.target === element || !event.target.closest(area)) {
			if (element.classList.contains(`is-popped`) || targetEl.classList.contains(`is-popped`)) {
				close(element, targetEl, duration, bodyClass);
			} else {
				if (event.target === element) {
					open(element, targetEl, duration, bodyClass);
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
		const bodyClass = target.substring(1);
		const area = element.dataset.popperArea || options.area || target;
		const duration = element.dataset.popperDuration || options.duration || 0;
		const trigger = element.dataset.popperTrigger || options.trigger || `click`;

		// console.log(bodyClass);

		init(element, targetEl, duration, bodyClass);

		if (trigger === `click`) {
			body.addEventListener(`click`, function(event) {
				handleClick(event, element, targetEl, area, duration, bodyClass);
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
	// duration: 500,
	// trigger: `hover`,
	// state: `popped`,
});
