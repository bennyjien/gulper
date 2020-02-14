/* This file contains main script for website */
/* global imagesLoaded fluidvids directionClass elementMover equalHeighter formFiler formSetter popper scrollAnimater scrollMonitor tabber toggler */

'use strict';

// vendor: check if images are loaded
imagesLoaded(`#site-container`, function() {
	document.body.classList.remove(`site-loading`);
});

// vendor: responsive video
fluidvids.init({
	selector: [`.js-video`],
	players: [`www.youtube.com`]
});

// gulper scripts
// directionClass(`.button`);
elementMover(`.js-mover`);
formFiler(`.js-form-file`);
formSetter(`.js-form-input`);
popper(`.js-popup-inline`, {
	animation: `css`,
	bodyClass: `popup-inline`,
	area: `child`,
	escape: true,
});
popper(`.js-popup-modal`, {
	animation: `css`,
	bodyClass: `popup-inline`,
	area: `#site-container`,
});
popper(`.js-toggle`);
scrollAnimater(`.js-scene`);
scrollMonitor(`.js-scroll`);
tabber(`.js-tab`);
