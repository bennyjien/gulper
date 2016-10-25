/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */

jQuery(document).ready(function($) {

	var $window = $(window);
	var $body = $('body');

	// svg polyfill
	svg4everybody();

	// sticky polyfill
	$('.js-sticky').Stickyfill();

	// input[type="file"] custom
	 /* <div class="input-file">
			<input type="file" id="file" name="file" data-multiple-caption="{count} files selected" multiple>
			<label for="file"><span class="button">Browse files</span> <span class="caption">No file selected&hellip;</span></label>
		</div>
	 */
	$('.js-input-file').each(function() {
		var $input  = $(this).find('input'),
			$label = $input.next('label'),
			labelVal = $label.html();

		$input.on('change', function(e) {
			var fileName = '';

			if (this.files && this.files.length > 1) {
				fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
			}
			else if (e.target.value) {
				fileName = e.target.value.split('\\').pop();
			}

			if (fileName) {
				$label.find('.caption').html(fileName).addClass('has-caption');
			}
			else {
				$label.html(labelVal);
			}
		});
	});

	// init ScrollMagic
	var sceneController = new ScrollMagic.Controller();

	$('.js-scene').each(function() {
	    var scene = new ScrollMagic.Scene({ triggerElement: this, reverse: false })
	        .setClassToggle(this, 'in-viewport')
			.addIndicators()
	        .addTo(sceneController);
	});

	// scroll to function (link will scroll to href)
	/* data-scroll-offset="[selector]" -> offset of selector height
	*/
	var scrollToFunction = function() {
		$('.js-scroll').on('click', function(e) {
			var $this = $(this);
			var scrollTarget = $this.attr('href');
			var $offset = $($this.data('scroll-offset'));
			var offset = $offset.height();
			TweenMax.to(window, 0.5, { scrollTo:{ y: scrollTarget, offsetY: offset } });
			e.preventDefault();
		});
	};

	// switch function (link will switch href and unswitch others from same data-switch-group, think tabs)
	 /* data-switch-group="[name]" -> switch grouping
	 	data-switch-method="auto|manual" -> how switch is handled
	 	data-switch-duration="[second]" -> how long is switch animation if switch method is auto
	 	data-switch-scroll="[selector]" -> switch scroll to
	 */
	var switchFunction = function() {
		$('.js-switch').on('click', function(e) {
			var $this = $(this),
				$switchTarget = $($this.attr('href')),
				$switchGroup = $('[data-switch-group="'+$switchTarget.data('switch-group')+'"]'),
				$switchTargetGroup = $switchGroup.filter('.js-switch-target'),
				switchTarget = $this.attr('href').substring(1),
				switchMethod = $this.data('switch-method') ? $this.data('switch-method') : 'auto',
				switchDuration = $this.data('switch-duration') ? $this.data('switch-duration') : 0.2,
				switchScroll = $this.data('switch-scroll');

			if (!$switchTarget.hasClass('is-switched')) {
				if (switchMethod === 'auto') {
					TweenMax.to($switchTargetGroup, switchDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, onComplete: function() {
						TweenMax.set($switchTarget, { display: 'block', overflow: 'visible', autoAlpha: 1 });
						TweenMax.from($switchTarget, switchDuration, { overflow: 'hidden', autoAlpha: 0 });
						$switchGroup.removeClass('is-switched');
						$this.addClass('is-switched');
						$switchTarget.addClass('is-switched');
					}});
				} else {
					$switchGroup.removeClass('is-switched');
					$this.addClass('is-switched');
					$switchTarget.addClass('is-switched');
				}
				TweenMax.to(window, switchDuration, { scrollTo: switchScroll });

				if (window.history && history.pushState) {
					history.replaceState('', '', '?switch' + '=' + switchTarget);
				}
			}
			e.preventDefault();
		});

		var queryString = {};
		window.location.href.replace(
			new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
			function($0, $1, $2, $3) { queryString[$1] = $3; }
		);

		if (queryString['switch']) {
			var $this = $("a[href='#" + queryString['switch'] + "']"),
				$switchTarget = $($this.attr('href')),
				$switchGroup = $('[data-switch-group="'+$switchTarget.data('switch-group')+'"]'),
				$switchTargetGroup = $switchGroup.filter('.js-switch-target');
			$switchGroup.removeClass('is-switched');
			$this.addClass('is-switched');
			$switchTarget.addClass('is-switched');
		}
	};

	// toggle function (link will toggle href, think checkbox)
	// modifier: .toggle-hover
	 /* data-toggle-target="[selector]" -> toggle target
		data-toggle-area="[selector]" -> toggle will end if mouse click outside this area or leave this area
		data-toggle-method="auto|manual" -> how toggle is handled, default is auto
		data-toggle-duration="[second]" -> how long is toggle animation
		data-toggle-scroll="[selector]" -> toggle scroll to
		data-toggle-focus="[selector]" -> toggle will focus on targeted form
	 */
	 var toggleFunction = function() {
 		$('.js-toggle').on('click mouseenter touchstart', function(event){
 			var $this = $(this),
 				toggleTarget = $this.data('toggle-target') ? $this.data('toggle-target') : $this.attr('href'),
 				$toggleTarget = $(toggleTarget),
 				$toggleArea = $this.data('toggle-area') ? $($this.data('toggle-area')) : $this,
 				$toggleFocus = $($this.data('toggle-focus')),
 				toggleMethod = $this.data('toggle-method') ? $this.data('toggle-method') : 'auto',
 				toggleDuration = $this.data('toggle-duration') ? $this.data('toggle-duration') : 0.25,
 				toggleScroll = $this.data('toggle-scroll'),
 				bodyClass = toggleTarget.substring(1),
 				preventDefault = $this.data('toggle-target') ? false : true;

 			if (event.type === 'mouseenter' || event.type === 'touchstart') {
 				if ($this.hasClass('js-toggle-hover')) {
 					$toggleArea.find('.js-toggle-hover.is-toggled').not($this).removeClass('is-toggled');
 					if (toggleMethod === 'auto') {
 						TweenMax.to($toggleArea.find('.is-toggled').not($this).not($toggleTarget), toggleDuration/2, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
 					}
 					$toggleArea.find('.is-toggled').not($this).not($toggleTarget).removeClass('is-toggled');

 					if ($this.hasClass('is-toggled') === false) {
 						$this.addClass('is-toggled');
 						$toggleTarget.addClass('is-toggled');
 						$body.addClass(bodyClass+'-is-toggled');
 						if (toggleMethod === 'auto') {
 							TweenMax.set($toggleTarget, { display: 'block', overflow: 'visible', autoAlpha: 1, height: 'auto' });
 							TweenMax.from($toggleTarget, toggleDuration, { overflow: 'hidden', autoAlpha: 0, height: 0, delay: toggleDuration/2 });
 						}
 					}

 					$toggleArea.on('mouseleave', function() {
 						$this.removeClass('is-toggled');
 						$toggleTarget.removeClass('is-toggled');
 						$body.removeClass(bodyClass+'-is-toggled');
 						if (toggleMethod === 'auto') {
 							TweenMax.to($toggleTarget, toggleDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
 						}
 					});
 				}
 			} else if (event.type === 'click') {
				if (!$this.hasClass('js-toggle-hover')) {
	 				if ($this.hasClass('is-toggled') || $toggleTarget.hasClass('is-toggled')) {
	 					if ($this.has($toggleArea).length === 0) {
	 						$this.removeClass('is-toggled').addClass('is-untoggling');
	 						$toggleTarget.removeClass('is-toggled').addClass('is-untoggling');
	 						$body.addClass(bodyClass+'-is-untoggling');
	 						setTimeout(function() {
	 							$this.removeClass('is-untoggling');
	 							$toggleTarget.removeClass('is-untoggling');
	 							$body.removeClass(bodyClass+'-is-toggled').removeClass(bodyClass+'-is-untoggling');
	 						}, toggleDuration*1000);
	 						if (toggleMethod === 'auto') {
	 							TweenMax.to($toggleTarget, toggleDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
	 						}
	 					}
	 				} else {
	 					$toggleTarget.addClass('is-toggled');
	 					$this.addClass('is-toggled');
	 					$body.addClass(bodyClass+'-is-toggled');
	 					TweenMax.to(window, toggleDuration, { scrollTo: toggleScroll });
	 					if (toggleMethod === 'auto') {
	 						TweenMax.set($toggleTarget, { display: 'block', overflow: 'visible', autoAlpha: 1, height: 'auto' });
	 						TweenMax.from($toggleTarget, toggleDuration, { overflow: 'hidden', autoAlpha: 0, height: 0 });
	 					}
						$toggleFocus.focus();
	 				}

	 				if (preventDefault === true) {
						event.preventDefault();
	 				}
				}
 			}

 			$body.on('click touchend', function(e) {
 				if (!$this.is(e.target) && $this.has(e.target).length === 0 && !$toggleArea.is(e.target) && $toggleArea.has(e.target).length === 0) {
 					$this.removeClass('is-toggled').addClass('is-untoggling');
 					$toggleTarget.removeClass('is-toggled').addClass('is-untoggling');
 					$body.addClass(bodyClass+'-is-untoggling');
 					setTimeout(function() {
 						$this.removeClass('is-untoggling');
 						$toggleTarget.removeClass('is-untoggling');
 						$body.removeClass(bodyClass+'-is-toggled').removeClass(bodyClass+'-is-untoggling');
 					}, toggleDuration*1000);
 					if (toggleMethod === 'auto') {
 						TweenMax.to($toggleTarget, toggleDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
 					}
 				}
 			});
 		});
 	};

	// mover function (will move elements depending of breakpoints)
	 /* data-mover-breakpoint="[width]" -> mover breakpoint width
		data-mover-target="[selector]" -> mover will append selected element to this selector
	 */
	var moverFunction = function() {
		$('.js-mover').each(function() {
			var $this = $(this);
			$this.before("<div class='js-mover-source'></div>");

			var $moverSource = $this.prev(),
				$moverTarget = $($this.data('mover-target')),
				moverBreakpoint = $this.data('mover-breakpoint'),
				windowWidth = $window.width();

			if (windowWidth >= moverBreakpoint) {
				$this.appendTo($moverTarget);
			}

			$window.resize(function() {
				windowWidth = $window.width();

				if (windowWidth >= moverBreakpoint) {
					if ($this.parent() !== $moverTarget) {
						$this.appendTo($moverTarget);
					}
				} else {
					if ($this.prev() !== $moverSource) {
						$this.insertAfter($moverSource);
					}
				}
			});
		});
	};

	// equalling heights function
	var equalheight = function(container) {
		var $this,
			currentHighest = 0,
			currentRowStart = 0,
			currentDiv,
			rowDivs = [],
			topPosition = 0;

		$(container).each(function() {
			$this = $(this);
			$this.css('min-height', '0');
			topPosition = $this.position().top;

			if (currentRowStart !== topPosition) {
				for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
					rowDivs[currentDiv].css('min-height', currentHighest);
				}
				rowDivs.length = 0;
				currentRowStart = topPosition;
				currentHighest = $this.outerHeight();
				rowDivs.push($this);
			} else {
				rowDivs.push($this);
				currentHighest = (currentHighest < $this.outerHeight()) ? ($this.outerHeight()) : (currentHighest);
			}

			for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
				rowDivs[currentDiv].css('min-height', currentHighest);
			}
		});
	};

	// run functions
	scrollToFunction();
	switchFunction();
	toggleFunction();
	moverFunction();

});
