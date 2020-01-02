// scrollAnimater.js: scroll animation with parallax option
// TODO: : rewrite this function
/* OPTIONS
	data-scene-hook="[0-1]" -> where the trigger hook is located on y axis (0 = top, 1 = bottom)
	data-scene-offset="[px]" -> offset from top of scene element
	data-scene-stagger="[second]" -> staggering children duration
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

	scenesEl.forEach(scene => {
		const sceneChild = scene.children,
			triggerHook = scene.dataset.sceneHook || 0.8,
			triggerOffset = scene.dataset.sceneOffset || 0,
			stagger = scene.dataset.sceneStagger || 0,
			parallax = scene.dataset.sceneParallax || 0,
			parallaxSpeed = scene.dataset.sceneParallaxSpeed || 1,
			parallaxType = scene.dataset.sceneParallaxType || `transform`,
			parallaxDuration = parallax ? scene.offsetHeight / parallaxSpeed : 0,
			reverse = stagger ? false : true;

		imagesLoaded(siteEl, function() {
			scene.magic = new ScrollMagic.Scene({
				triggerElement: scene,
				triggerHook: triggerHook,
				duration: parallaxDuration,
				offset: triggerOffset,
				reverse: reverse
			})
				.setClassToggle(scene, `in-viewport`)
				.addIndicators()
				.addTo(sceneController);

			scene.magic.on(`start`, function() {
				if (stagger) {
					gsap.staggerTo(sceneChild, {
						duration: 0.1,
						onStart: function() {
							this.target.classList.add(`in-viewport`);
						}
					}, stagger);
				}

				let parallaxProgress;

				if (parallax) {
					if (parallaxType === `transform`) {
						parallaxProgress = gsap.from(scene, {duration: 1, y: `${parallax}%`});
					} else if (parallaxType === `background`) {
						parallaxProgress = gsap.from(scene, {duration: 1, backgroundPositionY: `${parallax}%`});
					}
				}
			});
		});

	});
}

scrollAnimater.version = `1.0.0`;

export default scrollAnimater;
