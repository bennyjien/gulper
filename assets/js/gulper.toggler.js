// toggler.js: toggle element state
// TODO: pass options object on callback
// TODO: by default toggle direct child
// TODO: can still be interated with after ajax
/* OPTIONS
	data-toggle-trigger="click|hover" -> how will toggle be triggered
	data-toggle-target="[selector]" -> toggle target
	data-toggle-area="[selector]" -> toggle will end outside this area
	data-toggle-animation="slide|manual" -> how toggle is handled
	data-toggle-duration="[second]" -> how long is toggle animation
	data-toggle-focus="[selector]" -> toggle will focus on targeted form
	data-toggle-iteration="infinite|once" -> once will only trigger toggle once
	data-toggle-state="undefined|toggled" -> toggle state on page load
	data-toggle-keyclose="false|true" -> toggle target can be closed by keydown
	data-scroll-target="[selector]" -> scroll to target
	data-scroll-offset="[element]"
	data-scroll-duration="[second]"
*/
/* EXAMPLE
  toggler(`.js-toggle`);
*/

/* global animate hasChild smoothScroll */

function toggler(selector) {
	const bodyEl = document.querySelector(`body`);
	const togglesEl = document.querySelectorAll(selector);
	const togglesClass = selector.substring(1);

	function toggleInit(thisEl) {
		const eventClick = new MouseEvent(`click`),
			eventMouse = new MouseEvent(`mouseenter`);

		if (thisEl.dataset.toggleState === `toggled`) {
			toggleOpen(eventClick, thisEl);
			toggleOpen(eventMouse, thisEl);
		}
	}

	function toggleOpen(event, thisEl) {
		const toggleTrigger = thisEl.dataset.toggleTrigger || `click`,
			toggleTarget = thisEl.dataset.toggleTarget || thisEl.hash,
			toggleTargetEl = document.querySelector(toggleTarget),
			toggleAreaEl = document.querySelector(thisEl.dataset.toggleArea) || thisEl,
			toggleFocusEl = document.querySelector(thisEl.dataset.toggleFocus),
			toggleAnimation = thisEl.dataset.toggleAnimation || `slide`,
			toggleDuration = thisEl.dataset.toggleDuration || 0.2,
			toggleIteration = thisEl.dataset.toggleIteration || `infinite`,
			toggleScrollTarget = thisEl.dataset.scrollTarget,
			toggleKeyclose = thisEl.dataset.toggleKeyclose || false,
			bodyClass = toggleTarget.substring(1),
			preventDefault = thisEl.dataset.toggleTarget ? false : true;

		let clickPrevent = false;

		if (toggleTarget === thisEl.hash) clickPrevent = true;
		if (!toggleTargetEl) return false;
		if (!thisEl.classList.contains(togglesClass)){
			return false;
		}

		if (event.type === `mouseenter` || event.type === `touchstart`) {
			if (toggleTrigger === `hover`) {
				const toggleLinkToggledEl = toggleAreaEl.querySelectorAll(`${selector}.is-toggled`);

				if (toggleIteration === `once`) {
					thisEl.classList.remove(togglesClass);
				}

				toggleLinkToggledEl.forEach(toggle => {
					if (toggle !== thisEl) {
						toggle.classList.remove(`is-toggled`);
					}
				});

				const toggleAllToggledEl = toggleAreaEl.querySelectorAll(`.is-toggled`),
					toggleCurrentToggledEl = [];

				toggleAllToggledEl.forEach(toggle => {
					if (toggle !== thisEl && toggle !== toggleTargetEl) {
						toggleCurrentToggledEl.push(toggle);
					}
				});

				if (toggleAnimation === `slide`) {
					toggleCurrentToggledEl.forEach(toggle => {
						animate.slideUp(toggle, toggleDuration/2);
					});
				} else if (toggleAnimation === `fade`) {
					toggleCurrentToggledEl.forEach(toggle => {
						animate.fadeOut(toggle, toggleDuration/2);
					});
				}

				toggleCurrentToggledEl.forEach(toggle => toggle.classList.remove(`is-toggled`));

				if (thisEl.classList.contains(`is-toggled`) === false) {
					thisEl.classList.add(`is-toggled`);
					toggleTargetEl.classList.add(`is-toggled`);
					if (toggleAnimation === `slide`) {
						animate.slideDown(toggleTargetEl, toggleDuration, toggleDuration/2);
					} else if (toggleAnimation === `fade`) {
						animate.fadeIn(toggleTargetEl, toggleDuration, toggleDuration/2);
					}
				}

				toggleAreaEl.addEventListener(`mouseleave`, function(event) {
					toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass);
				});
				bodyEl.addEventListener(`click`, function(event) {
					toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass);
				});
				bodyEl.addEventListener(`touchend`, function(event) {
					toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass);
				});
			}
		} else if (event.type === `click`) {
			if (toggleTrigger === `hover` && clickPrevent === true) {
				event.preventDefault();
			}
			else if (toggleTrigger === `click`) {
				if (toggleIteration === `once`) {
					thisEl.classList.replace(togglesClass, `${togglesClass}-inactive`);
				}

				if (thisEl.classList.contains(`is-toggled`) || toggleTargetEl.classList.contains(`is-toggled`) || window.getComputedStyle(toggleTargetEl).getPropertyValue(`display`) !== `none`) {
					if (!hasChild(thisEl, toggleAreaEl)) {
						var togglerEl = document.querySelectorAll(`.`+bodyClass+`-toggler`);

						togglerEl.forEach(element => {
							element.classList.replace(`${togglesClass}-inactive`, togglesClass);
							element.classList.remove(`is-toggled`);
							element.classList.remove(bodyClass+`-toggler`);
							element.classList.add(`is-untoggling`);
						});
						toggleTargetEl.classList.remove(`is-toggled`);
						toggleTargetEl.classList.add(`is-untoggling`);
						bodyEl.classList.add(bodyClass+`-is-untoggling`);
						setTimeout(function() {
							togglerEl.forEach(element => {
								element.classList.remove(`is-untoggling`);
							});
							toggleTargetEl.classList.remove(`is-untoggling`);
							bodyEl.classList.remove(bodyClass+`-is-toggled`, bodyClass+`-is-untoggling`);
						}, toggleDuration);
						if (toggleAnimation === `slide`) {
							animate.slideUp(toggleTargetEl, toggleDuration/2);
						} else if (toggleAnimation === `fade`) {
							animate.fadeOut(toggleTargetEl, toggleDuration/2);
						}
					}
				} else {
					thisEl.classList.add(`is-toggling`);
					toggleTargetEl.classList.add(`is-toggling`);
					bodyEl.classList.add(bodyClass+`-is-toggling`);

					setTimeout(function() {
						thisEl.classList.remove(`is-toggling`);
						thisEl.classList.add(`is-toggled`);
						thisEl.classList.add(bodyClass+`-toggler`);
						toggleTargetEl.classList.remove(`is-toggling`);
						toggleTargetEl.classList.add(`is-toggled`);
						bodyEl.classList.remove(bodyClass+`-is-toggling`);
						bodyEl.classList.add(bodyClass+`-is-toggled`);

						if (toggleFocusEl) {
							toggleFocusEl.focus();
						}
					}, toggleDuration);

					if (toggleScrollTarget) {
						smoothScroll(event, thisEl);
					}

					if (toggleAnimation === `slide`) {
						animate.slideDown(toggleTargetEl, toggleDuration);
					} else if (toggleAnimation === `fade`) {
						animate.fadeIn(toggleTargetEl, toggleDuration);
					}

					bodyEl.addEventListener(`click`, function(event) {
						toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass);
					});
					bodyEl.addEventListener(`touchend`, function(event) {
						toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass);
					});

					if (toggleKeyclose === `true`) {
						document.addEventListener(`keydown`, function(event) {
							if (event.keyCode === 27) {
								toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass);
							}
						});
					}
				}

				if (preventDefault === true) {
					event.preventDefault();
				}
			}
		}
	}

	function toggleClose(event, thisEl, toggleTrigger, toggleTargetEl, toggleAreaEl, toggleAnimation, toggleDuration, bodyClass) {
		if (thisEl.classList.contains(`is-toggled`) || toggleTargetEl.classList.contains(`is-toggled`)) {
			if ((toggleTrigger === `hover` && event.type !== `click`) || (toggleTrigger === `click` && event.type === `keydown`)) {
				thisEl.classList.remove(`is-toggled`);
				thisEl.classList.add(`is-untoggling`);
				toggleTargetEl.classList.remove(`is-toggled`);
				toggleTargetEl.classList.add(`is-untoggling`);

				setTimeout(function() {
					thisEl.classList.remove(`is-untoggling`);
					toggleTargetEl.classList.remove(`is-untoggling`);
				}, toggleDuration);

				if (toggleAnimation === `slide`) {
					animate.slideUp(toggleTargetEl, toggleDuration/2);
				} else if (toggleAnimation === `fade`) {
					animate.fadeOut(toggleTargetEl, toggleDuration/2);
				}
			} else {
				if (thisEl !== event.target && !hasChild(thisEl, event.target) && toggleAreaEl !== event.target && !hasChild(toggleAreaEl, event.target)) {
					thisEl.classList.remove(`is-toggled`);
					thisEl.classList.add(`is-untoggling`);
					toggleTargetEl.classList.remove(`is-toggled`);
					toggleTargetEl.classList.add(`is-untoggling`);
					bodyEl.classList.add(bodyClass+`-is-untoggling`);
					setTimeout(function() {
						thisEl.classList.remove(`is-untoggling`);
						toggleTargetEl.classList.remove(`is-untoggling`);
						bodyEl.classList.remove(bodyClass+`-is-toggled`, bodyClass+`-is-untoggling`);
					}, toggleDuration);
					if (toggleAnimation === `slide`) {
						animate.slideUp(toggleTargetEl, toggleDuration/2);
					} else if (toggleAnimation === `fade`) {
						animate.fadeOut(toggleTargetEl, toggleDuration/2);
					}
				}
			}
		}
	}

	togglesEl.forEach(toggle => {
		toggleInit(toggle);
		toggle.addEventListener(`click`, function(event) { toggleOpen(event, this); });
		toggle.addEventListener(`mouseenter`, function(event) { toggleOpen(event, this); });
		toggle.addEventListener(`touchstart`, function(event) { toggleOpen(event, this); });
	});
}

toggler.version = `2.0.0`;
