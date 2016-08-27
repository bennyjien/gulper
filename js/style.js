/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */

jQuery(document).ready(function($) {

	var $win = $(window);
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
	 	data-switch-scroll="[selector]" -> toggle scroll to
	 */
	var switchFunction = function() {
		$('.js-switch').on('click', function(e) {
			var $this = $(this),
				$switchTarget = $($this.attr('href')),
				$switchGroup = $('[data-switch-group="'+$switchTarget.data('switch-group')+'"]'),
				switchMethod = $this.data('switch-method') ? $this.data('switch-method') : 'auto',
				switchDuration = $this.data('switch-duration') ? $this.data('switch-duration') : 0.2,
				switchScroll = $this.data('switch-scroll');

			if (!$switchTarget.hasClass('is-switched')) {
				if (switchMethod === 'auto') {
					TweenMax.to('.js-switch-target', switchDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0, onComplete: function() {
						TweenMax.set($switchTarget, { display: 'block', overflow: 'visible', autoAlpha: 1, height: 'auto' });
						TweenMax.from($switchTarget, switchDuration, { overflow: 'hidden', autoAlpha: 0, height: 0 });
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
			}
			e.preventDefault();
		});
	};

	// toggle function (link will toggle href, think checkbox)
	// modifier: .toggle-hover
	 /* data-toggle-target="[selector]" -> toggle target
		data-toggle-area="[selector]" -> toggle will end if mouse click outside this area or leave this area
		data-toggle-method="auto|manual" -> how toggle is handled
		data-toggle-duration="[duration]" -> how long toggling off in ms, used for closing animation
		data-toggle-scroll="[selector]" -> toggle scroll to
		data-toggle-focus="[selector]" -> toggle will focus on targeted form
	 */
	var toggleFunction = function() {
		$('.js-toggle').not('.js-toggle-hover').on('click', function(e) {
			var $this = $(this),
				toggleTarget = $this.data('toggle-target') ? $this.data('toggle-target') : $this.attr('href'),
				$toggleTarget = $(toggleTarget),
				$toggleArea = $($this.data('toggle-area')),
				$toggleFocus = $($this.data('toggle-focus')),
				toggleMethod = $this.data('toggle-method') ? $this.data('toggle-method') : 'auto',
				toggleDuration = $this.data('toggle-duration') ? $this.data('toggle-duration') : 0.4,
				toggleScroll = $this.data('toggle-scroll'),
				bodyClass = toggleTarget.substring(1),
				preventDefault = $this.data('toggle-target') ? false : true;

			if ($this.hasClass('is-toggled') || $toggleTarget.hasClass('is-toggled')) {
				$this.removeClass('is-toggled');
				$toggleTarget.removeClass('is-toggled');
				$body.removeClass(bodyClass+'-is-toggled');
				if (toggleMethod === 'auto') {
					TweenMax.to($toggleTarget, toggleDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
				}
			} else {
				$toggleTarget.addClass('is-toggled');
				$this.addClass('is-toggled');
				$body.addClass(bodyClass+'-is-toggled');
				TweenMax.to(window, toggleDuration, { scrollTo: toggleScroll });
				$toggleFocus.focus();
				if (toggleMethod === 'auto') {
					TweenMax.set($toggleTarget, { display: 'block', overflow: 'visible', autoAlpha: 1, height: 'auto' });
					TweenMax.from($toggleTarget, toggleDuration, { overflow: 'hidden', autoAlpha: 0, height: 0 });
				}
			}

			$body.on('click touchend', function(e) {
				if (!$this.is(e.target) && $this.has(e.target).length === 0 && !$toggleArea.is(e.target) && $toggleArea.has(e.target).length === 0) {
					$this.removeClass('is-toggled');
					$toggleTarget.removeClass('is-toggled');
					$body.removeClass(bodyClass+'-is-toggled');
					if (toggleMethod === 'auto') {
						TweenMax.to($toggleTarget, toggleDuration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0 });
					}
				}
			});

			if (preventDefault === true) {
				e.preventDefault();
			}
		});

		$('.js-toggle-hover').on('mouseenter touchstart', function() {
			var $this = $(this),
				toggleTarget = $this.data('toggle-target') ? $this.data('toggle-target') : $this.attr('href'),
				$toggleTarget = $(toggleTarget),
				$toggleArea = $this.data('toggle-area') ? $($this.data('toggle-area')) : $this,
				bodyClass = toggleTarget.substring(1);

			$toggleArea.find('.is-toggled').removeClass('is-toggled');

			$this.addClass('is-toggled');
			$toggleTarget.addClass('is-toggled');
			$body.addClass(bodyClass+'-is-toggled');

			$toggleArea.on('mouseleave', function() {
				$this.removeClass('is-toggled');
				$toggleTarget.removeClass('is-toggled');
				$body.removeClass(bodyClass+'-is-toggled');
			});

			$body.on('click touchend', function(e) {
				if (!$this.is(e.target) && $this.has(e.target).length === 0 && !$toggleTarget.is(e.target) && $toggleTarget.has(e.target).length === 0) {
					$this.removeClass('is-toggled');
					$toggleTarget.removeClass('is-toggled');
					$body.removeClass(bodyClass+'-is-toggled');
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
				winWidth = $win.width();

			if (winWidth >= moverBreakpoint) {
				$this.appendTo($moverTarget);
			}

			$win.resize(function() {
				winWidth = $win.width();

				if (winWidth >= moverBreakpoint) {
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

	// run functions
	scrollToFunction();
	switchFunction();
	toggleFunction();
	moverFunction();

});
