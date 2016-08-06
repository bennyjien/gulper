/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */

jQuery(document).ready(function($) {

	var $win = $(window);
	var $body = $('body');

	// svg polyfill
	svg4everybody();

	// sticky polyfill
	$('.sticky').Stickyfill();

	// input[type="file"] custom
	 /* <div class="input-file">
			<input type="file" id="file" name="file" data-multiple-caption="{count} files selected" multiple>
			<label for="file"><span class="button">Browse files</span> <span class="caption">No file selected&hellip;</span></label>
		</div>
	 */
	$('.input-file').each(function() {
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

	// scroll function (link will scroll to href)
	/* data-scroll-offset="[selector]"
	*/
	var scrollFunction = function() {
		$('.scroll').on('click', function(e) {
			var $this = $(this);
			var $scrollID = $($this.attr('href'));
			var $offset = $($this.data('scroll-offset'));
			var offset = $offset.height();
			$scrollID.velocity('scroll', { offset: -offset });
			e.preventDefault();
		});
	};

	// switch function (link will switch href and unswitch others from same data-switch-group, think tabs)
	 /* data-switch-group="[name]" -> switch grouping
	 	data-switch-scroll="[selector]" -> toggle scroll to
	 */
	var switchFunction = function() {
		$('.switch').on('click', function(e) {
			var $this = $(this),
				$switchTarget = $($this.attr('href')),
				$switchGroup = $('[data-switch-group="'+$switchTarget.data('switch-group')+'"]'),
				$switchScroll = $($this.data('switch-scroll'));

			if (!$switchTarget.hasClass('is-switched')) {
				$switchGroup.removeClass('is-switched');
				$this.addClass('is-switched');
				$switchTarget.addClass('is-switched');
				$switchScroll.velocity('scroll');
			}
			e.preventDefault();
		});
	};

	// toggle function (link will toggle href, think checkbox)
	// modifier: .toggle-hover
	 /* data-toggle-target="[selector]" -> toggle target
		data-toggle-area="[selector]" -> toggle will end if mouse click outside this area or leave this area
		data-toggle-scroll="[selector]" -> toggle scroll to
		data-toggle-focus="[selector]" -> toggle will focus on targeted form
		data-untoggle-duration="[duration]" -> how long toggling off in ms, used for closing animation
	 */
	var toggleFunction = function() {
		$('.toggle').not('.toggle-hover').on('click', function(e) {
			var $this = $(this),
				toggleTarget = $this.data('toggle-target') ? $this.data('toggle-target') : $this.attr('href'),
				$toggleTarget = $(toggleTarget),
				$toggleArea = $($this.data('toggle-area')),
				$toggleScroll = $($this.data('toggle-scroll')),
				$toggleFocus = $($this.data('toggle-focus')),
				untoggleDuration = $this.data('untoggle-duration'),
				bodyClass = toggleTarget.substring(1),
				preventDefault = $this.data('toggle-target') ? false : true;

			if ($this.hasClass('is-toggled') || $toggleTarget.hasClass('is-toggled')) {
				$this.removeClass('is-toggled');
				$toggleTarget.removeClass('is-toggled');
				if (untoggleDuration) {
					$body.addClass(bodyClass+'-is-untoggling');
					setTimeout(function() {
						$body.removeClass(bodyClass+'-is-toggled').removeClass(bodyClass+'-is-untoggling');
					}, untoggleDuration);
				} else {
					$body.removeClass(bodyClass+'-is-toggled');
				}
			} else {
				$toggleTarget.addClass('is-toggled');
				$this.addClass('is-toggled');
				$body.addClass(bodyClass+'-is-toggled');
				$toggleScroll.velocity('scroll');
				$toggleFocus.focus();
			}

			$body.on('click touchend', function(e) {
				if (!$this.is(e.target) && $this.has(e.target).length === 0 && !$toggleArea.is(e.target) && $toggleArea.has(e.target).length === 0) {
					$this.removeClass('is-toggled');
					$toggleTarget.removeClass('is-toggled');
					if (untoggleDuration) {
						$body.addClass(bodyClass+'-is-untoggling');
						setTimeout(function() {
							$body.removeClass(bodyClass+'-is-toggled').removeClass(bodyClass+'-is-untoggling');
						}, untoggleDuration);
					} else {
						$body.removeClass(bodyClass+'-is-toggled');
					}
				}
			});

			if (preventDefault === true) {
				e.preventDefault();
			}
		});

		$('.toggle-hover').on('mouseenter touchstart', function() {
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
		$('.mover').each(function() {
			var $this = $(this);
			$this.before("<div class='mover-source'></div>");

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
	scrollFunction();
	switchFunction();
	toggleFunction();
	moverFunction();

});
