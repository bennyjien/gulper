// scrollViewer.js: scroll and monitor if the element in viewport
/* OPTIONS
	data-scroll-target="[selector]" -> scroll to target
	data-scroll-offset="[selector]" -> offset of selector height
	data-scroll-duration="[duration]" -> how long is scrolling animation
*/
/* EXAMPLE
  scrollViewer(`.js-scroll`);
*/

/* global ScrollMagic imagesLoaded */

import { smoothScroll } from './helper.js';

function scrollViewer(selector) {
	const $scrolls = document.querySelectorAll(selector);
	const sceneController = new ScrollMagic.Controller();

	// add .in-viewport for links and element (to mark current selected)
	function elementClass(scroll) {
		const scrollTarget = scroll.dataset.scrollTarget || scroll.hash || ``,
			$scrollTarget = document.querySelector(`[id="${scrollTarget.substring(1)}"]`);
		let scrollTargetHeight = $scrollTarget.offsetHeight;

		function updateDuration() {
			scrollTargetHeight = $scrollTarget.offsetHeight;
			return scrollTargetHeight;
		}

		imagesLoaded($scrollTarget, function() {
			const scene = new ScrollMagic.Scene({ triggerElement: $scrollTarget, triggerHook: 0.5, duration: scrollTargetHeight, reverse: true })
				.setClassToggle([scroll, $scrollTarget], `in-viewport`)
				// .addIndicators()
				.addTo(sceneController);

			window.addEventListener(`resize`, updateDuration);
			scene.duration(updateDuration);
		});
	}

	$scrolls.forEach(scroll => {
		scroll.addEventListener(`click`, function(event) {
			smoothScroll(event, this);
		});

		elementClass(scroll);
	});
}

scrollViewer.version = `1.0.0`;

export default scrollViewer;
