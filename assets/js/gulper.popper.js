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
	const popperClass = selector.substring(1);

	function handleClick(e) {
		console.log(`clicked`);
		e.preventDefault();
	}

	function handleHover(e) {
		console.log(`hovered`);
		e.preventDefault();
	}

	popperEl.forEach(el => {
		el.addEventListener(`click`, handleClick);
		el.addEventListener(`mouseenter`, handleHover);
		el.addEventListener(`touchstart`, handleHover);
	});
}

popper.version = `1.0.0`;

// demo callback
popper(`.js-popper`, {
	// type: `gallery`
});
