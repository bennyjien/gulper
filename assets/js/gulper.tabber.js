// tabber.js: toggle visibility between tabpanel elements
// TODO: add animation
/* OPTIONS
	data-tab-deeplink="false|true" -> whether to support deeplink or not
*/
/* HTML EXAMPLE
  <div class="js-tab" data-tab-deeplink>
		<div role="tablist" aria-label="Programming Languages">
			<button id="js" role="tab">JavaScript</button>
			<button id="ruby" role="tab">Ruby</button>
			<button id="php" role="tab">PHP</button>
		</div>
		<div>
			<div aria-labelledby="js" role="tabpanel">
				<p>JavaScript is tabbed!</p>
			</div>
			<div aria-labelledby="ruby" role="tabpanel">
				<p>Ruby is tabbed!</p>
			</div>
			<div aria-labelledby="php" role="tabpanel">
				<p>PHP is tabbed!</p>
			</div>
		</div>
	</div>
*/
/* JS EXAMPLE
  tabber(`.js-tab`, { deeplink: true });
*/

/* global getParameterByName */

function tabber(selector, options = {}) {
	const tabsEl = document.querySelectorAll(selector);

	if (!tabsEl.length) return;

	function init(element, params) {
		// unselect all buttons and panels
		let selectedButtonEl;
		let selectedPanelEl;

		unselectTab(params);

		// if querystring, then select the corresponding button and panel
		if (params.tabDeeplink && params.queryString) {
			selectedButtonEl = element.querySelector(`#${params.queryString}`);
			selectedPanelEl = element.querySelector(`[aria-labelledby=${params.queryString}]`);
		}

		// if no button and panel selected, select the first one
		if (!selectedButtonEl) {
			selectedButtonEl = element.querySelector(`[role="tab"]`);
			selectedPanelEl = element.querySelector(`[role="tabpanel"]`);
		}

		selectedButtonEl.setAttribute(`aria-selected`, true);
		selectedPanelEl.hidden = false;
	}

	function unselectTab(params) {
		// hide all panel
		params.tabPanelsEl.forEach(element => {
			element.hidden = true;
		});
		// mark all button as unselected
		params.tabButtonsEl.forEach(element => {
			element.setAttribute(`aria-selected`, false);
		});
	}

	function handleButtonClick(event, params) {
		unselectTab(params);
		// mark clicked button as selected
		event.target.setAttribute(`aria-selected`, true);
		// show selected panel
		const id = event.target.id;

		params.tabPanelsEl = Array.from(params.tabPanelsEl);
		const selectedPanelEl = params.tabPanelsEl.find(panel => panel.getAttribute(`aria-labelledby`) === id);
		selectedPanelEl.hidden = false;
		// push tab to window URL
		if (params.tabDeeplink && window.history && history.pushState) {
			history.replaceState(``, ``, `?tab=${id}`);
		}
	}

	tabsEl.forEach(element => {
		const tabButtonsEl = element.querySelectorAll(`[role="tab"]`);
		const tabPanelsEl = element.querySelectorAll(`[role="tabpanel"]`);
		const tabDeeplink = element.hasAttribute(`data-tab-deeplink`) || options.deeplink;
		const queryString = getParameterByName(`tab`);

		const params = {
			tabButtonsEl,
			tabPanelsEl,
			tabDeeplink,
			queryString
		};

		element.addEventListener(`click`, function(event) {
			if (event.target.matches(`[role="tab"]`)) {
				handleButtonClick(event, params);
			}
		});

		init(element, params);
	});
}

tabber.version = `2.0.0`;
