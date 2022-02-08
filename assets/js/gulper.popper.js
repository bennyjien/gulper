// popper.js: pop element from button/link
/* OPTIONS
	data-popper-trigger="click|hover" -> how will popper be triggered
	data-popper-target="[selector]" -> popper target
	data-popper-area="[selector]" -> popper will end outside this area
	data-popper-animation="css|slide|fade" -> how popper is handled
	data-popper-duration="[second]" -> how long is popper animation
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
		animation: `css`,
		duration: 0.5,
		focus: `input[type="text"]`,
		pop: true,
		escape: true,
		onOpen: function() {}
	});
*/

/* global animate smoothScroll hasChild */

function popper(selector, options = {}) {
	const body = document.querySelector(`body`);
	const popperEl = document.querySelectorAll(selector);

	function init(element, params) {

		if (params.pop) {
			open(event, element, params);
		}
	}

	function removePopper(element, params) {
		element.classList.remove(`is-unpopping`);
		params.targetEl.classList.remove(`is-unpopping`);
		body.classList.remove(`${params.bodyClass}-is-unpopping`, `${params.targetClass}-is-unpopping`);
	}

	function open(event, element, params) {
		if (element.timeout) {
			clearTimeout(element.timeout);
			removePopper(element, params);
		}

		element.classList.add(`${params.targetClass}-toggler`);
		element.classList.add(`is-popping`);
		params.targetEl.classList.add(`is-popping`);
		body.classList.add(`${params.bodyClass}-is-popping`, `${params.targetClass}-is-popping`);

		if (params.animation === `slide`) animate.slideDown(params.targetEl, params.duration * 1000);
		if (params.animation === `fade`) animate.fadeIn(params.targetEl, params.duration * 1000);

		setTimeout(function() {
			element.classList.remove(`is-popping`);
			element.classList.add(`is-popped`);
			params.targetEl.classList.remove(`is-popping`);
			params.targetEl.classList.add(`is-popped`);
			body.classList.add(`${params.bodyClass}-is-popped`, `${params.targetClass}-is-popped`);
			body.classList.remove(`${params.bodyClass}-is-popping`, `${params.targetClass}-is-popping`);
		}, 1);

		if (params.onOpen) params.onOpen();

		if (params.focus) {
			document.querySelector(params.focus).focus();
		}

		if (params.scrollTarget) {
			smoothScroll(event, element);
		}
	}

	function close(element, params) {
		const prevPopperEl = document.querySelector(`.${params.targetClass}-toggler`);

		element.classList.add(`is-unpopping`);
		params.targetEl.classList.add(`is-unpopping`);
		body.classList.add(`${params.bodyClass}-is-unpopping`, `${params.targetClass}-is-unpopping`);
		element.classList.remove(`is-popped`);
		params.targetEl.classList.remove(`is-popped`);
		body.classList.remove(`${params.bodyClass}-is-popped`, `${params.targetClass}-is-popped`);
		prevPopperEl.classList.remove(`is-popped`, `${params.targetClass}-toggler`);
		if (params.animation === `slide`) animate.slideUp(params.targetEl, params.duration * 1000);
		if (params.animation === `fade`) animate.fadeOut(params.targetEl, params.duration * 1000);

		function ending(ev) {
			if (ev.target === params.targetEl) {
				removePopper(element, params);
				params.targetEl.removeEventListener(`transitionend`, ending);
			}
		}

		if (params.animation === `css`) {
			if (params.duration) {
				if (params.targetEl.style.transition || getComputedStyle(params.targetEl).transitionDuration !== `0s`) {
					params.targetEl.addEventListener(`transitionend`, ending);
				} else {
					removePopper(element, params);
				}
			} else {
				removePopper(element, params);
			}
		} else {
			element.timeout = setTimeout(function() {
				removePopper(element, params);
			}, params.duration * 1000);
		}
	}

	function handleClick(event, element, params) {
		if (event.target === element || hasChild(element, event.target)) {
			event.preventDefault();
			if (element.classList.contains(`is-popped`) || params.targetEl.classList.contains(`is-popped`)) {
				// console.log(`closing`);
				close(element, params);
			} else {
				// console.log(`opening`);
				open(event, element, params);
			}
		} else if (!event.target.closest(params.area)) {
			const evTarget = event.target.dataset.popperTarget || event.target.hash;
			// if this element is the trigger, close
			if (element.classList.contains(`is-popped`) && params.targetEl.classList.contains(`is-popped`) && evTarget !== params.target) {
				// console.log(`outside-closing`);
				close(element, params);
			}
		}
	}

	function handleHover(event, element, params) {
		// counter mobile browser touch behaviour
		element.classList.add(`is-unselectable`);
		if (event.type === `mouseover` || event.type === `touchstart`) {
			open(event, element, params);
		} else if (event.type === `mouseout` || event.type === `touchend`) {
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
		const targetChild = `${target} > *`;
		const targetEl = document.querySelector(target);
		const targetClass = target.substring(1);
		const bodyClass = options.bodyClass || targetClass;
		const area = (element.dataset.popperArea === `child` ? targetChild : element.dataset.popperArea) || (options.area === `child` ? targetChild : options.area) || target;
		const animation = element.dataset.popperAnimation || options.animation || `css`;
		const duration = element.dataset.popperDuration || options.duration || 0.2;
		const trigger = element.dataset.popperTrigger || options.trigger || `click`;
		const escape = element.hasAttribute(`data-popper-escape`) || options.escape;
		const focus = element.dataset.popperFocus || options.focus;
		const pop = element.hasAttribute(`data-popper-pop`) || options.pop;
		const onOpen = options.onOpen;
		const scrollTarget = element.dataset.scrollTarget;

		const params = {
			target,
			targetEl,
			targetClass,
			bodyClass,
			area,
			animation,
			duration,
			trigger,
			escape,
			focus,
			pop,
			onOpen,
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
			element.addEventListener(`touchstart`, event => {
				handleHover(event, element, params);
			});
			element.addEventListener(`mouseout`, event => {
				handleHover(event, element, params);
			});
			element.addEventListener(`touchend`, event => {
				handleHover(event, element, params);
			});
		}

		if (escape) {
			window.addEventListener(`keydown`, event => {
				if (event.key === `Escape`) {
					handleEscape(element, params);
				}
			});
		}
	});
}

popper.version = `1.1.1`;
