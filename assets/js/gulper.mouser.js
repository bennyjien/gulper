// mouser.js: detect mouse in and out on element
/* EXAMPLE
	mouser(`.js-mouser`);
*/

function mouser(selector) {
	const mouserEl = document.querySelectorAll(selector);

	function handleMouseOver(event) {
		event.target.classList.remove(`is-unhovered`);
		event.target.classList.add(`is-hovering`);
	}
	function handleMouseOut(event) {
		event.target.classList.remove(`is-hovering`);
		event.target.classList.add(`is-unhovered`);
	}

	mouserEl.forEach(element => {
		element.addEventListener(`mouseover`, handleMouseOver);
		element.addEventListener(`mouseout`, handleMouseOut);
	});
}

mouser.version = `1.0.0`;
