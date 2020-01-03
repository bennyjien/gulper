// equalHeighter.js: equal height of elements in the same row
/* EXAMPLE
  equalHeighter(`.js-eqheight .item`);
*/

function equalHeighter(selector) {
	let thisEl,
		currentHighest = 0,
		currentRowStart = 0,
		currentDiv,
		rowDivs = [],
		topPosition = 0;

	function calculateHeight(selector) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(element => {
			thisEl = element;
			thisEl.style.minHeight = 0;
			topPosition = thisEl.getBoundingClientRect().top;

			if (currentRowStart !== topPosition) {
				for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
					rowDivs[currentDiv].style.minHeight = currentHighest + `px`;
				}
				rowDivs.length = 0;
				currentRowStart = topPosition;
				currentHighest = thisEl.offsetHeight;
				rowDivs.push(thisEl);
			} else {
				rowDivs.push(thisEl);
				currentHighest = (currentHighest < thisEl.offsetHeight) ? thisEl.offsetHeight : currentHighest;
			}

			for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
				rowDivs[currentDiv].style.minHeight = currentHighest + `px`;
			}
		});
	}

	calculateHeight(selector);
	window.addEventListener(`resize`, function() {
		currentHighest = 0;
		calculateHeight(selector);
	});
}

equalHeighter.version = `1.0.0`;
