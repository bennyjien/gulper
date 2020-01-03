// scrollAnimater.js: scroll animation with parallax and stagger option
// TODO: pass options object on callback
/* OPTIONS
	data-scene-hook="[0-1]" -> where the trigger hook is located on y axis (0 = top, 1 = bottom)
	data-scene-offset="[px]" -> offset from top of scene element
	data-scene-stagger="[second]" -> staggering children delay duration
	data-scene-stagger-duration="[second]" -> staggering children animation duration
	data-scene-parallax="[percent]" -> how much does the element will be shifted
	data-scene-parallax-speed="[number]" -> how fast does the element will be shifted
	data-scene-parallax-type="[transform|background]" -> what to shift
*/
/* EXAMPLE
  scrollAnimater(`.js-scene`);
*/

/* global imagesLoaded ScrollMagic gsap */

function scrollAnimater(selector) {
	const scenesEl = document.querySelectorAll(selector);
	const siteEl = document.querySelector(`#site-container`);
	const sceneController = new ScrollMagic.Controller({
		refreshInterval: 0 // if 100 has bug on parallax, 0 has better performance but must recalculate on resize
	});

	scenesEl.forEach(element => {
		const sceneChild = element.children,
			triggerHook = element.dataset.sceneHook || 0.8,
			triggerOffset = element.dataset.sceneOffset || 0,
			stagger = element.dataset.sceneStagger || 0,
			staggerDuration = element.dataset.sceneStaggerDuration || (stagger * 2),
			parallax = element.dataset.sceneParallax || 0,
			parallaxSpeed = element.dataset.sceneParallaxSpeed || 1,
			parallaxType = element.dataset.sceneParallaxType || `transform`,
			parallaxDuration = parallax ? element.offsetHeight / parallaxSpeed : 0,
			reverse = stagger ? false : true;

		imagesLoaded(siteEl, function() {
			element.magic = new ScrollMagic.Scene({
				triggerElement: element,
				triggerHook: triggerHook,
				duration: parallaxDuration,
				offset: triggerOffset,
				reverse: reverse
			})
				.setClassToggle(element, `in-viewport`)
				// .addIndicators()
				.addTo(sceneController);

			let tween;

			if (parallax) {
				if (parallaxType === `transform`) {
					tween = gsap.from(element, {
						duration: 1,
						y: `${parallax}%`
					});
				} else if (parallaxType === `background`) {
					tween = gsap.from(element, {
						duration: 1,
						backgroundPositionY: `${parallax}%`
					});
				}
				element.magic.setTween(tween);
			}

			if (stagger) {
				element.magic.on(`start`, () => {
					gsap.to(sceneChild, {
						duration: staggerDuration,
						stagger: {
							amount: stagger,
							onStart: function() {
								this._targets[0].classList.add(`in-viewport`);
							}
						},
					});
				});
			}
		});

	});
}

scrollAnimater.version = `1.0.0`;
