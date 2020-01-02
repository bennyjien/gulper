// helper.js: helper/utility function
/* global gsap */

// gsap default animation
export const animate = {
	fadeIn: (element, duration, delay = 0) => {
		gsap.to(element, { display: `block`, autoAlpha: 1, duration: duration, delay: delay });
	},
	fadeOut: (element, duration, delay = 0) => {
		gsap.to(element, { display: `none`, autoAlpha: 0, duration: duration, delay: delay });
	},
	slideDown: (element, duration, delay = 0) => {
		gsap.set(element, { display: `block`, overflow: `visible`, autoAlpha: 1, height: `auto` });
		gsap.from(element, duration, { overflow: `hidden`, autoAlpha: 0, height: 0, duration: duration, delay: delay });
	},
	slideUp: (element, duration, delay = 0) => {
		gsap.to(element, { display: `none`, overflow: `hidden`, autoAlpha: 0, height: 0, duration: duration, delay: delay });
	}
};

// scroll to targeted id
export function smoothScroll(event, element) {
	const target = element.dataset.scrollTarget || element.hash || ``,
		targetEl = document.querySelector(`[id='${target.substring(1)}']`),
		duration = element.dataset.scrollDuration || 0.4,
		offsetEl = document.querySelector(element.dataset.scrollOffset) || ``,
		offsetY = offsetEl.offsetHeight || 0;

	if (targetEl) {
		gsap.to(window, {duration: duration, scrollTo:{ y: target, offsetY: offsetY } });
		event.preventDefault();
	}
}

// get parameter in url
export function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[[\]]/g, `\\$&`);
	const regex = new RegExp(`[?&]` + name + `(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return ``;
	return decodeURIComponent(results[2].replace(/\+/g, ` `));
}

// check if element has child
export function hasChild(element, child) {
	let node = child.parentNode;
	while (node !== null) {
		if (node == element) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

// get mouse position (http://www.window.org/js/events_properties.html#position)
export function mousePos(event) {
	let posX = 0,
		posY = 0;
	if (!event) event = window.event;
	if (event.pageX || event.pageY) {
		posX = event.pageX;
		posY = event.pageY;
	} else if (event.clientX || event.clientY) {
		posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {
		x: posX,
		y: posY
	};
}
