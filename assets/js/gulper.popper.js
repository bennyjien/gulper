// popper.js: pop element from button/link
// TODO: when event is running, there should be a way of stopping if clicked
/* OPTIONS
	data-popper-trigger="click|hover" -> how will popper be triggered
	data-popper-target="[selector]" -> popper target
	data-popper-area="[selector]" -> popper will end outside this area
	data-popper-animation="manual|slide|fade" -> how popper is handled
	data-popper-duration="[ms]" -> how long is popper animation
	data-popper-focus="[selector]" -> popper will focus on targeted form
	data-popper-pop -> popper popped on page load
	data-popper-escape -> popper target can be closed by escape
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
		duration: 500,
		focus: `input[type="text"]`,
		pop: true,
		escape: true,
	});
*/

/* global wait animate smoothScroll */

function popper(selector, options = {}) {
	const body = document.querySelector(`body`);
	const popperEl = document.querySelectorAll(selector);

	function init(element, params) {
		const pop = element.hasAttribute(`data-popper-pop`) || options.pop;

		if (pop) {
			open(event, element, params);
		}
	}

	async function open(event, element, params) {
		element.classList.add(`${params.targetClass}-toggler`);
		element.classList.add(`is-popping`);
		params.targetEl.classList.add(`is-popping`);
		body.classList.add(`${params.targetClass}-is-popping`);
		if (params.animation === `slide`) animate.slideDown(params.targetEl, params.duration);
		if (params.animation === `fade`) animate.fadeIn(params.targetEl, params.duration);
		await wait(params.duration);
		element.classList.add(`is-popped`);
		params.targetEl.classList.add(`is-popped`);
		body.classList.add(`${params.targetClass}-is-popped`);
		element.classList.remove(`is-popping`);
		params.targetEl.classList.remove(`is-popping`);
		body.classList.remove(`${params.targetClass}-is-popping`);

		if (params.focus) {
			document.querySelector(params.focus).focus();
		}

		if (params.scrollTarget) {
			smoothScroll(event, element);
		}
	}

	async function close(element, params) {
		const prevPopperEl = document.querySelector(`.${params.targetClass}-toggler`);

		element.classList.add(`is-unpopping`);
		params.targetEl.classList.add(`is-unpopping`);
		body.classList.add(`${params.targetClass}-is-unpopping`);
		element.classList.remove(`is-popped`);
		params.targetEl.classList.remove(`is-popped`);
		body.classList.remove(`${params.targetClass}-is-popped`);
		prevPopperEl.classList.remove(`is-popped`, `${params.targetClass}-toggler`);
		if (params.animation === `slide`) animate.slideUp(params.targetEl, params.duration);
		if (params.animation === `fade`) animate.fadeOut(params.targetEl, params.duration);
		await wait(params.duration);
		element.classList.remove(`is-unpopping`);
		params.targetEl.classList.remove(`is-unpopping`);
		body.classList.remove(`${params.targetClass}-is-unpopping`);
	}

	function handleClick(event, element, params) {
		if (event.target === element || !event.target.closest(params.area)) {
			event.preventDefault();
			if (element.classList.contains(`is-popped`) || params.targetEl.classList.contains(`is-popped`)) {
				close(element, params);
			} else {
				if (event.target === element) {
					open(event, element, params);
				}
			}
		}
	}

	function handleHover(event, element, params) {
		if (event.type === `mouseover`) {
			open(event, element, params);
		} else if (event.type === `mouseout`) {
			close(element, params);
		}
	}

	function handleEscape(element, params) {
		if (element.classList.contains(`is-popped`) || params.targetEl.classList.contains(`is-popped`)) {
			close(element, params);
		}
	}

	popperEl.forEach(element => {
		const target = element.dataset.popperTarget || element.hash;
		const targetEl = document.querySelector(target);
		const targetClass = target.substring(1);
		const area = element.dataset.popperArea || options.area || target;
		const animation = element.dataset.popperAnimation || options.animation || `manual`;
		const duration = element.dataset.popperDuration || options.duration || 0;
		const trigger = element.dataset.popperTrigger || options.trigger || `click`;
		const escape = element.hasAttribute(`data-popper-escape`) || options.escape;
		const focus = element.dataset.popperFocus || options.focus;
		const scrollTarget = element.dataset.scrollTarget;

		const params = {
			target,
			targetEl,
			targetClass,
			area,
			animation,
			duration,
			trigger,
			escape,
			focus,
			scrollTarget
		};

		init(element, params);

		if (trigger === `click`) {
			window.addEventListener(`click`, event => {
				handleClick(event, element, params);
			});
		} else if (trigger === `hover`) {
			element.addEventListener(`mouseover`, event => {
				handleHover(event, element, params);
			});
			element.addEventListener(`mouseout`, event => {
				handleHover(event, element, params);
			});
		}
		// element.addEventListener(`touchstart`, handleHover); *TODO*

		if (escape) {
			window.addEventListener(`keydown`, event => {
				if (event.key === `Escape`) {
					handleEscape(element, params);
				}
			});
		}
	});
}

popper.version = `1.0.0`;
