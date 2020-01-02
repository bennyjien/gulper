// tabber.js: the tab function
// TODO: add animation after converting to GSAP3
/*
	data-tab-deeplink="false|true" -> whether to support deeplink or not
*/

import { getParameterByName } from './helper.js';

function tabber(selector, options = {}) {
	const $tabs = document.querySelectorAll(selector);

	if (!$tabs.length) return;

	function init(tab, $tabButtons, $tabPanels, tabDeeplink, queryString) {
		// unselect all buttons and panels
		let $selectedButton;
		let $selectedPanel;

		unselectTab($tabButtons, $tabPanels);

		// if querystring, then select the corresponding button and panel
		if (tabDeeplink && queryString) {
			$selectedButton = tab.querySelector(`#${queryString}`);
			$selectedPanel = tab.querySelector(`[aria-labelledby=${queryString}]`);
		}

		// if no button and panel selected, select the first one
		if (!$selectedButton) {
			$selectedButton = tab.querySelector(`[role="tab"]`);
			$selectedPanel = tab.querySelector(`[role="tabpanel"]`);
		}

		$selectedButton.setAttribute(`aria-selected`, true);
		$selectedPanel.hidden = false;
	}

	function unselectTab($tabButtons, $tabPanels) {
		// hide all panel
		$tabPanels.forEach(panel => {
			panel.hidden = true;
		});
		// mark all button as unselected
		$tabButtons.forEach(button => {
			button.setAttribute(`aria-selected`, false);
		});
	}

	function handleButtonClick(e, $tabButtons, $tabPanels, tabDeeplink) {
		unselectTab($tabButtons, $tabPanels);
		// mark clicked button as selected
		e.target.setAttribute(`aria-selected`, true);
		// show selected panel
		const id = e.target.id;

		$tabPanels = Array.from($tabPanels);
		const $selectedPanel = $tabPanels.find(panel => panel.getAttribute(`aria-labelledby`) === id);
		$selectedPanel.hidden = false;
		// push tab to window URL
		if (tabDeeplink && window.history && history.pushState) {
			history.replaceState(``, ``, `?tab=${id}`);
		}
	}

	$tabs.forEach(tab => {
		const $tabButtons = tab.querySelectorAll(`[role="tab"]`);
		const $tabPanels = tab.querySelectorAll(`[role="tabpanel"]`);
		const tabDeeplink = tab.hasAttribute(`data-tab-deeplink`) || options.deeplink;
		const queryString = getParameterByName(`tab`);

		tab.addEventListener(`click`, function(e) {
			if (e.target.matches(`[role="tab"]`)) {
				handleButtonClick(e, $tabButtons, $tabPanels, tabDeeplink);
			}
		});

		init(tab, $tabButtons, $tabPanels, tabDeeplink, queryString);
	});
}

tabber.version = `2.0.0`;

export default tabber;
