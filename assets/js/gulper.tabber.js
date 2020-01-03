// tabber.js: toggle visibility between tabpanel elements
// TODO: add animation after converting to GSAP3
/* OPTIONS
	data-tab-deeplink="false|true" -> whether to support deeplink or not
*/
/* EXAMPLE
  tabber(`.js-tab`, { deeplink: true });
*/

/* global getParameterByName */

function tabber(selector, options = {}) {
	const tabsEl = document.querySelectorAll(selector);

	if (!tabsEl.length) return;

	function init(tab, tabButtonsEl, tabPanelsEl, tabDeeplink, queryString) {
		// unselect all buttons and panels
		let selectedButtonEl;
		let selectedPanelEl;

		unselectTab(tabButtonsEl, tabPanelsEl);

		// if querystring, then select the corresponding button and panel
		if (tabDeeplink && queryString) {
			selectedButtonEl = tab.querySelector(`#${queryString}`);
			selectedPanelEl = tab.querySelector(`[aria-labelledby=${queryString}]`);
		}

		// if no button and panel selected, select the first one
		if (!selectedButtonEl) {
			selectedButtonEl = tab.querySelector(`[role="tab"]`);
			selectedPanelEl = tab.querySelector(`[role="tabpanel"]`);
		}

		selectedButtonEl.setAttribute(`aria-selected`, true);
		selectedPanelEl.hidden = false;
	}

	function unselectTab(tabButtonsEl, tabPanelsEl) {
		// hide all panel
		tabPanelsEl.forEach(panel => {
			panel.hidden = true;
		});
		// mark all button as unselected
		tabButtonsEl.forEach(button => {
			button.setAttribute(`aria-selected`, false);
		});
	}

	function handleButtonClick(event, tabButtonsEl, tabPanelsEl, tabDeeplink) {
		unselectTab(tabButtonsEl, tabPanelsEl);
		// mark clicked button as selected
		event.target.setAttribute(`aria-selected`, true);
		// show selected panel
		const id = event.target.id;

		tabPanelsEl = Array.from(tabPanelsEl);
		const selectedPanelEl = tabPanelsEl.find(panel => panel.getAttribute(`aria-labelledby`) === id);
		selectedPanelEl.hidden = false;
		// push tab to window URL
		if (tabDeeplink && window.history && history.pushState) {
			history.replaceState(``, ``, `?tab=${id}`);
		}
	}

	tabsEl.forEach(tab => {
		const tabButtonsEl = tab.querySelectorAll(`[role="tab"]`);
		const tabPanelsEl = tab.querySelectorAll(`[role="tabpanel"]`);
		const tabDeeplink = tab.hasAttribute(`data-tab-deeplink`) || options.deeplink;
		const queryString = getParameterByName(`tab`);

		tab.addEventListener(`click`, function(event) {
			if (event.target.matches(`[role="tab"]`)) {
				handleButtonClick(event, tabButtonsEl, tabPanelsEl, tabDeeplink);
			}
		});

		init(tab, tabButtonsEl, tabPanelsEl, tabDeeplink, queryString);
	});
}

tabber.version = `2.0.0`;
