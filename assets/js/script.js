/* This file contains main script for website */
/* global imagesLoaded fluidvids elementMover equalHeighter formFiler formSetter popper scrollAnimater scrollViewer tabber toggler */

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
elementMover(`.js-mover`);
formFiler(`.js-form-file`);
formSetter(`.js-form-input`);
popper(`.js-popup-inline`, {
	duration: 0.2,
	bodyClass: `popup-inline`,
	area: `child`,
	escape: true,
});
popper(`.js-popup-modal`, {
	duration: 0.2,
	bodyClass: `popup-inline`,
	area: `#site-container`,
});
popper(`.js-toggle`);
scrollAnimater(`.js-scene`);
scrollViewer(`.js-scroll`);
tabber(`.js-tab`);
