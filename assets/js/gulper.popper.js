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

	function init(element, targetEl, animation, duration, bodyClass) {
		const pop = element.hasAttribute(`data-popper-pop`) || options.pop;

		if (pop) {
			open(event, element, targetEl, animation, duration, bodyClass);
		}
	}

	async function open(event, element, targetEl, animation, duration, bodyClass) {
		const focus = element.dataset.popperFocus || options.focus;
		const scrollTarget = element.dataset.scrollTarget;

		element.classList.add(`${bodyClass}-toggler`);
		element.classList.add(`is-popping`);
		targetEl.classList.add(`is-popping`);
		body.classList.add(`${bodyClass}-is-popping`);
		if (animation === `slide`) animate.slideDown(targetEl, duration);
		if (animation === `fade`) animate.fadeIn(targetEl, duration);
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

		if (scrollTarget) {
			smoothScroll(event, element);
		}
	}

	async function close(element, targetEl, animation, duration, bodyClass) {
		const prevPopperEl = document.querySelector(`.${bodyClass}-toggler`);

		element.classList.add(`is-unpopping`);
		targetEl.classList.add(`is-unpopping`);
		body.classList.add(`${bodyClass}-is-unpopping`);
		element.classList.remove(`is-popped`);
		targetEl.classList.remove(`is-popped`);
		body.classList.remove(`${bodyClass}-is-popped`);
		prevPopperEl.classList.remove(`is-popped`, `${bodyClass}-toggler`);
		if (animation === `slide`) animate.slideUp(targetEl, duration);
		if (animation === `fade`) animate.fadeOut(targetEl, duration);
		await wait(duration);
		element.classList.remove(`is-unpopping`);
		targetEl.classList.remove(`is-unpopping`);
		body.classList.remove(`${bodyClass}-is-unpopping`);
	}

	function handleClick(event, element, targetEl, area, animation, duration, bodyClass) {
		if (event.target === element || !event.target.closest(area)) {
			event.preventDefault();
			if (element.classList.contains(`is-popped`) || targetEl.classList.contains(`is-popped`)) {
				close(element, targetEl, animation, duration, bodyClass);
			} else {
				if (event.target === element) {
					open(event, element, targetEl, animation, duration, bodyClass);
				}
			}
		}
	}

	function handleHover(event, element, targetEl, animation, duration, bodyClass) {
		if (event.type === `mouseover`) {
			open(event, element, targetEl, animation, duration, bodyClass);
		} else if (event.type === `mouseout`) {
			close(element, targetEl, animation, duration, bodyClass);
		}
	}

	function handleEscape(element, targetEl, animation, duration, bodyClass) {
		if (element.classList.contains(`is-popped`) || targetEl.classList.contains(`is-popped`)) {
			close(element, targetEl, animation, duration, bodyClass);
		}
	}

	popperEl.forEach(element => {
		const target = element.dataset.popperTarget || element.hash;
		const targetEl = document.querySelector(target);
		const bodyClass = target.substring(1);
		const area = element.dataset.popperArea || options.area || target;
		const animation = element.dataset.popperAnimation || options.animation || `manual`;
		const duration = element.dataset.popperDuration || options.duration || 0;
		const trigger = element.dataset.popperTrigger || options.trigger || `click`;
		const escape = element.hasAttribute(`data-popper-escape`) || options.escape;

		init(element, targetEl, animation, duration, bodyClass);

		if (trigger === `click`) {
			window.addEventListener(`click`, event => {
				handleClick(event, element, targetEl, area, animation, duration, bodyClass);
			});
		} else if (trigger === `hover`) {
			element.addEventListener(`mouseover`, event => {
				handleHover(event, element, targetEl, animation, duration, bodyClass);
			});
			element.addEventListener(`mouseout`, event => {
				handleHover(event, element, targetEl, animation, duration, bodyClass);
			});
		}
		// element.addEventListener(`touchstart`, handleHover);

		if (escape) {
			window.addEventListener(`keydown`, event => {
				if (event.key === `Escape`) {
					handleEscape(element, targetEl, animation, duration, bodyClass);
				}
			});
		}
	});
}

popper.version = `1.0.0`;
