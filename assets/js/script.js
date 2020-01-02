/* This file contains main script for website
 * Style related scripts is located in style.js
 */
/* global imagesLoaded fluidvids */

'use strict';

import elMover from './gulper.elMover.js';
import formFiler from './gulper.formFiler.js';
import formSetter from './gulper.formSetter.js';
import scrollAnimater from './gulper.scrollAnimater.js';
import scrollViewer from './gulper.scrollViewer.js';
import tabber from './gulper.tabber.js';
import toggler from './gulper.toggler.js';

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
elMover(`.js-mover`);
formFiler(`.js-form-file`);
formSetter(`.js-form-input`);
scrollAnimater(`.js-scene`);
scrollViewer(`.js-scroll`);
tabber(`.js-tab`);
toggler(`.js-toggle`);
