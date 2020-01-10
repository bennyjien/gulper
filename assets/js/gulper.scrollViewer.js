// scrollViewer.js: scroll and monitor if the element in viewport
/* OPTIONS
	data-scroll-target="[selector]" -> scroll to target
	data-scroll-offset="[selector]" -> offset of selector height
	data-scroll-duration="[second]" -> how long is scrolling animation
*/
/* EXAMPLE
  scrollViewer(`.js-scroll`);
*/

/* global ScrollMagic imagesLoaded smoothScroll */

function scrollViewer(selector) {
	const scrollsEl = document.querySelectorAll(selector);
	const sceneController = new ScrollMagic.Controller();

	// add .in-viewport for links and element (to mark current selected)
	function elementClass(scroll) {
		const scrollTarget = scroll.dataset.scrollTarget || scroll.hash || ``,
			scrollTargetEl = document.querySelector(`[id="${scrollTarget.substring(1)}"]`);
		let scrollTargetHeight = scrollTargetEl.offsetHeight;

		function updateDuration() {
			scrollTargetHeight = scrollTargetEl.offsetHeight;
			return scrollTargetHeight;
		}

		imagesLoaded(scrollTargetEl, function() {
			const scene = new ScrollMagic.Scene({ triggerElement: scrollTargetEl, triggerHook: 0.5, duration: scrollTargetHeight, reverse: true })
				.setClassToggle([scroll, scrollTargetEl], `in-viewport`)
				// .addIndicators()
				.addTo(sceneController);

			window.addEventListener(`resize`, updateDuration);
			scene.duration(updateDuration);
		});
	}

	scrollsEl.forEach(scroll => {
		scroll.addEventListener(`click`, function(event) {
			smoothScroll(event, scroll);
		});

		elementClass(scroll);
	});
}

scrollViewer.version = `1.0.0`;
