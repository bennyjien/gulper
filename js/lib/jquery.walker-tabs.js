/* Tab module for Walker, velocity.js required */

(function($) {

	$.walkerTabs = function(e, options) {

		var base = this;
		base.$e = $(e);
		base.$nav = base.$e.find('.tabs-nav');

		base.init = function() {

			base.options = $.extend({},$.walkerTabs.defaultOptions, options);

			var $tabsContent = base.$e.find('.content'),
				currentTabHeight = $tabsContent.outerHeight();

			$tabsContent.find('.tab:not(.is-selected)').hide();

			if (base.options.animateHeight === true) {
				$tabsContent.css('min-height', currentTabHeight);
			}

			base.$nav.delegate('li > a', 'click', function() {

				var currentTab = base.$e.find('a.is-selected').attr('href').substring(1),
					$newTab = $(this),
					tabID = $newTab.attr('href').substring(1);

				if ((tabID !== currentTab) && (base.$e.find(':animated').length === 0)) {
					base.$e.find('#'+currentTab).velocity('fadeOut', base.options.speed, function() {
						base.$e.find('.tabs-nav li a').removeClass('is-selected');
						base.$e.find('.tab').removeClass('is-selected');
						$newTab.addClass('is-selected');
						base.$e.find('#'+tabID).addClass('is-selected').velocity('fadeIn', {
							duration: base.options.speed,
							complete: function() {
								if (base.options.animateHeight === true) {
									var newHeight = base.$e.find('#'+tabID).outerHeight();
									$tabsContent.velocity({minHeight: newHeight}, base.options.speed, 'linear');
								}
							}
						});

						if (window.history && history.pushState) {
							history.replaceState('', '', '?' + base.options.urlParameter + '=' + tabID);
						}
					});
				}

				return false;
			});

			var queryString = {};
			window.location.href.replace(
				new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
				function($0, $1, $2, $3) { queryString[$1] = $3; }
			);

			if (queryString[base.options.urlParameter]) {
				var currentTab = $("a[href='#" + queryString[base.options.urlParameter] + "']");
				currentTab.closest('.tabs-nav').find('a').removeClass('is-selected');
				base.$e.find('.tab').removeClass('is-selected').hide();
				currentTab.addClass('is-selected');
				$('#' + queryString[base.options.urlParameter]).addClass('is-selected').velocity('fadeIn', {
					duration: base.options.speed,
					complete: function() {
						if (base.options.animateHeight === true) {
							var newHeight = $(this).outerHeight();
							$tabsContent.velocity({minHeight: newHeight}, base.options.speed, 'linear');
						}
					}
				});
			}
		};
		base.init();
	};

	$.walkerTabs.defaultOptions = {
		'animateHeight': true,
		'speed': 150,
		'urlParameter': 'tab'
	};

	$.fn.walkerTabs = function(options) {
		return this.each(function() {
			(new $.walkerTabs(this, options));
		});
	};

})(jQuery);
