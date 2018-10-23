/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */
/* global window document history MouseEvent getParameterByName hasChild svg4everybody Stickyfill fluidvids TweenMax ScrollMagic */

(function() {

	const $body = document.querySelector('body');

	let windowWidth = document.documentElement.clientWidth;

	// svg polyfill
	svg4everybody();

	// preload images
	imagesLoaded(document.querySelector('#site-container'), function() {
		document.body.classList.remove('is-loading');
	});

	// sticky polyfill
	const stickyElements = document.getElementsByClassName('js-sticky');

	for (let i = stickyElements.length - 1; i >= 0; i -= 1) {
		Stickyfill.add(stickyElements[i]);
	}

	// fluidvids
	fluidvids.init({
		selector: ['.js-fluidvids'],
		players: ['www.youtube.com']
	});

	// tween animation
	const Animate = {
		fadeIn: (element, duration, delay = 0) => {
			TweenMax.to(element, duration, { display: 'block', autoAlpha: 1, delay: delay });
		},
		fadeOut: (element, duration, delay = 0) => {
			TweenMax.to(element, duration, { display: 'none', autoAlpha: 0, delay: delay });
		},
		slideDown: (element, duration, delay = 0) => {
			TweenMax.set(element, { display: 'block', overflow: 'visible', autoAlpha: 1, height: 'auto' });
			TweenMax.from(element, duration, { overflow: 'hidden', autoAlpha: 0, height: 0, delay: delay });
		},
		slideUp: (element, duration, delay = 0) => {
			TweenMax.to(element, duration, { display: 'none', overflow: 'hidden', autoAlpha: 0, height: 0, delay: delay });
		}
	}
	const animate = Object.create(Animate);

	// scroll to targeted id
	function scrollTo(event, element) {
		const scrollTarget = element.dataset.scrollTarget || element.hash || '',
			$scrollTarget = document.querySelector(`[id='${scrollTarget.substring(1)}']`),
			scrollDuration = element.dataset.scrollDuration || 0.4,
			$offset = document.querySelector(element.dataset.scrollOffset) || '',
			offsetY = $offset.offsetHeight || 0;

		if ($scrollTarget) {
			TweenMax.to(window, scrollDuration, { scrollTo:{ y: scrollTarget, offsetY: offsetY } });
			event.preventDefault();
		}
	}

	// scroller function
	/* data-scroll-target="[selector]" -> scroll to target
	   data-scroll-offset="[selector]" -> offset of selector height
	   data-scroll-duration="[duration]" -> how long is scrolling animation
	*/
	const scrollFunction = function(event) {
		const $scrolls = document.querySelectorAll('.js-scroll');

		$scrolls.forEach(scroll => scroll.addEventListener('click', function(event) { scrollTo(event, this); }));
	}();

	// init ScrollMagic
	const sceneController = new ScrollMagic.Controller(),
		$scenes = document.querySelectorAll('.js-scene');

	$scenes.forEach(scene => {
		new ScrollMagic.Scene({ triggerElement: scene, reverse: false })
			.setClassToggle(scene, 'in-viewport')
			.addIndicators()
			.addTo(sceneController);
	});

	// tab function, can use scroll to function
	/* data-tab-type="normal|collapse" -> collapse tab can be closed individually
	   data-tab-group="[name]" -> tab grouping
	   data-tab-duration="[second]" -> how long is tab animation if tab method is auto
	*/
	const tabFunction = function() {
		const $tabs = document.querySelectorAll('.js-tab');

		function tabInit() {
			const $tabTargets = document.querySelectorAll('.js-tab-target'),
				$firstTabs = document.querySelectorAll('[data-tab-group]:first-child'),
				$firstTabTargets = document.querySelectorAll('[data-tab-group].js-tab-target:first-child'),
				queryString = getParameterByName('tab'),
				$this = document.querySelector(`a[href="#${queryString}"]`),
				$tabTarget = $this && document.querySelector($this.hash);

			$tabTargets.forEach(element => element.style.display = 'none');
			$firstTabTargets.forEach(element => element.style.display = 'block');
			$firstTabs.forEach(element => element.classList.add('is-tabbed'));

			if (queryString && $tabTarget) {
				const $tabGroup = document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					$tabTargetGroup = document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"].js-tab-target`);

				$tabTargetGroup.forEach(element => element.style.display = 'none');
				$tabGroup.forEach(element => element.classList.remove('is-tabbed'));
				$this.classList.add('is-tabbed');
				$tabTarget.style.display = 'block';
				$tabTarget.classList.add('is-tabbed');
			}
		}

		function tabSwitch(event, $this) {
			const $tabTarget = document.querySelector($this.hash);

			if ($tabTarget) {
				const $tabGroup =  document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					$tabTargetGroup = document.querySelectorAll(`.js-tab-target[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					tabType = $this.dataset.tabType || 'tab',
					tabTarget = $this.hash.substring(1),
					tabDuration = $this.dataset.tabDuration || 0.2,
					tabScrollTarget = $this.dataset.scrollTarget;

				if (!$tabTarget.classList.contains('is-tabbed')) {
					let closeDuration = 0;

					$tabTargetGroup.forEach(element => {
						if (element.classList.contains('is-tabbed')) {
							closeDuration = tabDuration/2;
						}
					});

					TweenMax.to($tabTargetGroup, closeDuration, { display: 'none', height: 0, overflow: 'hidden', autoAlpha: 0, onComplete:
					function() {
						animate.slideDown($tabTarget, tabDuration);
					}});
					$tabGroup.forEach(element => element.classList.remove('is-tabbed'));
					$this.classList.add('is-tabbed');
					$tabTarget.classList.add('is-tabbed');

					if (tabScrollTarget) {
						setTimeout(function() {
							scrollTo(event, $this);
						}, closeDuration + tabDuration);
					}

					if (window.history && history.pushState) {
						history.replaceState('', '', '?tab' + '=' + tabTarget);
					}
				} else {
					if (tabType === 'collapse') {
						$tabTargetGroup.forEach(element => {
							animate.slideUp(element, tabDuration);
						});
						$this.classList.remove('is-tabbed');
						$tabTarget.classList.remove('is-tabbed');

						if (window.history && history.pushState) {
							history.replaceState('', '', '?');
						}
					}
				}

				event.preventDefault();
			}
		}

		tabInit();
		$tabs.forEach(tab => tab.addEventListener('click', function(event) { tabSwitch(event, this); }));
	}();

	// toggle function, can use scroll to function
	/* data-toggle-trigger="click|hover" -> how will toggle be triggered
			data-toggle-target="[selector]" -> toggle target
			data-toggle-area="[selector]" -> toggle will end outside this area
			data-toggle-animation="slide|manual" -> how toggle is handled
			data-toggle-duration="[second]" -> how long is toggle animation
			data-toggle-focus="[selector]" -> toggle will focus on targeted form
			data-toggle-iteration="infinite|once" -> once will only trigger toggle once
			data-toggle-state="undefined|toggled" -> toggle state on page load
			data-toggle-keyclose="false|true" -> toggle target can be closed by keydown
			data-scroll-target="[selector]" -> scroll to target
	*/
	const toggleFunction = function() {
		const $toggles = $body.querySelectorAll('.js-toggle');

		function toggleInit($this) {
			const eventClick = new MouseEvent('click'),
				eventMouse = new MouseEvent('mouseenter');

			if ($this.dataset.toggleState === 'toggled') {
				toggleOpen(eventClick, $this);
				toggleOpen(eventMouse, $this);
			}
		}

		function toggleOpen(event, $this) {
			const toggleTrigger = $this.dataset.toggleTrigger || 'click',
				toggleTarget = $this.dataset.toggleTarget || $this.hash,
				$toggleTarget = document.querySelector(toggleTarget),
				$toggleArea = document.querySelector($this.dataset.toggleArea) || $this,
				$toggleFocus = document.querySelector($this.dataset.toggleFocus),
				toggleAnimation = $this.dataset.toggleAnimation || 'slide',
				toggleDuration = $this.dataset.toggleDuration || 0.2,
				toggleIteration = $this.dataset.toggleIteration || 'infinite',
				toggleScrollTarget = $this.dataset.scrollTarget,
				toggleKeyclose = $this.dataset.toggleKeyclose || false,
				bodyClass = toggleTarget.substring(1),
				preventDefault = $this.dataset.toggleTarget ? false : true;

			let clickPrevent = false;

			if (toggleTarget === $this.hash) clickPrevent = true;
			if (!$toggleTarget) return false;
			if (!$this.classList.contains('js-toggle')){
				return false;
			}

			if (event.type === 'mouseenter' || event.type === 'touchstart') {
				if (toggleTrigger === 'hover') {
					const $toggleLinkToggled = $toggleArea.querySelectorAll('.js-toggle.is-toggled');

					if (toggleIteration === 'once') {
						$this.classList.remove('js-toggle');
					}

					$toggleLinkToggled.forEach(toggle => {
						if (toggle !== $this) {
							toggle.classList.remove('is-toggled');
						}
					});

					const $toggleAllToggled = $toggleArea.querySelectorAll('.is-toggled'),
						$toggleCurrentToggled = [];

					$toggleAllToggled.forEach(toggle => {
						if (toggle !== $this && toggle !== $toggleTarget) {
							$toggleCurrentToggled.push(toggle);
						}
					});

					if (toggleAnimation === 'slide') {
						$toggleCurrentToggled.forEach(toggle => {
							animate.slideUp(toggle, toggleDuration/2);
						});
					}

					$toggleCurrentToggled.forEach(toggle => toggle.classList.remove('is-toggled'));

					if ($this.classList.contains('is-toggled') === false) {
						$this.classList.add('is-toggled');
						$toggleTarget.classList.add('is-toggled');
						if (toggleAnimation === 'slide') {
							animate.slideDown($toggleTarget, toggleDuration, toggleDuration/2);
						}
					}

					$toggleArea.addEventListener('mouseleave', function(event) {
						toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
					});
					$body.addEventListener('click', function(event) {
						toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
					});
					$body.addEventListener('touchend', function(event) {
						toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
					});
				}
			} else if (event.type === 'click') {
				if (toggleTrigger === 'hover' && clickPrevent === true) {
					event.preventDefault();
				}
				else if (toggleTrigger === 'click') {
					if (toggleIteration === 'once') {
						$this.classList.replace('js-toggle', 'js-toggle-inactive');
					}

					if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled') || window.getComputedStyle($toggleTarget).getPropertyValue('display') !== 'none') {
						if (!hasChild($this, $toggleArea)) {
							var $toggler = document.querySelectorAll('.'+bodyClass+'-toggler');

							$toggler.forEach(element => {
								element.classList.replace('js-toggle-inactive', 'js-toggle');
								element.classList.remove('is-toggled');
								element.classList.remove(bodyClass+'-toggler');
								element.classList.add('is-untoggling');
							});
							$toggleTarget.classList.remove('is-toggled');
							$toggleTarget.classList.add('is-untoggling');
							$body.classList.add(bodyClass+'-is-untoggling');
							setTimeout(function() {
								$toggler.forEach(element => {
									element.classList.remove('is-untoggling');
								});
								$toggleTarget.classList.remove('is-untoggling');
								$body.classList.remove(bodyClass+'-is-toggled', bodyClass+'-is-untoggling');
							}, toggleDuration);
							if (toggleAnimation === 'slide') {
								animate.slideUp($toggleTarget, toggleDuration/2);
							}
						}
					} else {
						$this.classList.add('is-toggling');
						$toggleTarget.classList.add('is-toggling');
						$body.classList.add(bodyClass+'-is-toggling');

						setTimeout(function() {
							$this.classList.remove('is-toggling');
							$this.classList.add('is-toggled');
							$this.classList.add(bodyClass+'-toggler');
							$toggleTarget.classList.remove('is-toggling');
							$toggleTarget.classList.add('is-toggled');
							$body.classList.remove(bodyClass+'-is-toggling');
							$body.classList.add(bodyClass+'-is-toggled');

							if ($toggleFocus) {
								$toggleFocus.focus();
							}
						}, toggleDuration);

						if (toggleScrollTarget) {
							scrollTo(event, $this);
						}
						if (toggleAnimation === 'slide') {
							animate.slideDown($toggleTarget, toggleDuration);
						}

						$body.addEventListener('click', function(event) {
							toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
						});
						$body.addEventListener('touchend', function(event) {
							toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
						});

						if (toggleKeyclose === 'true') {
							document.addEventListener('keydown', function(event) {
								if (event.keyCode === 27) {
									toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
								}
							});
						}
					}

					if (preventDefault === true) {
						event.preventDefault();
					}
				}
			}
		}

		function toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass) {
			if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled')) {
				if ((toggleTrigger === 'hover' && event.type !== 'click') || (toggleTrigger === 'click' && event.type === 'keydown')) {
					$this.classList.remove('is-toggled');
					$this.classList.add('is-untoggling');
					$toggleTarget.classList.remove('is-toggled');
					$toggleTarget.classList.add('is-untoggling');
					setTimeout(function() {
						$this.classList.remove('is-untoggling');
						$toggleTarget.classList.remove('is-untoggling');
					}, toggleDuration);
					if (toggleAnimation === 'slide') {
						animate.slideUp($toggleTarget, toggleDuration/2);
					}
				} else {
					if ($this !== event.target && !hasChild($this, event.target) && $toggleArea !== event.target && !hasChild($toggleArea, event.target)) {
						$this.classList.remove('is-toggled');
						$this.classList.add('is-untoggling');
						$toggleTarget.classList.remove('is-toggled');
						$toggleTarget.classList.add('is-untoggling');
						$body.classList.add(bodyClass+'-is-untoggling');
						setTimeout(function() {
							$this.classList.remove('is-untoggling');
							$toggleTarget.classList.remove('is-untoggling');
							$body.classList.remove(bodyClass+'-is-toggled', bodyClass+'-is-untoggling');
						}, toggleDuration);
						if (toggleAnimation === 'slide') {
							animate.slideUp($toggleTarget, toggleDuration/2);
						}
					}
				}
			}
		}

		$toggles.forEach(toggle => {
			toggleInit(toggle);
			toggle.addEventListener('click', function(event) { toggleOpen(event, this); });
			toggle.addEventListener('mouseenter', function(event) { toggleOpen(event, this); });
			toggle.addEventListener('touchstart', function(event) { toggleOpen(event, this); });
		});
	}();

	// mover function (will move elements depending of breakpoints)
	/* data-mover-breakpoint="[width]" -> mover breakpoint width
	   data-mover-target="[selector]" -> mover will append selected element to this selector
	*/
	const moverFunction = function() {
		const $movers = document.querySelectorAll('.js-mover');

		function moverStart(element) {
			const $this = element;

			$this.insertAdjacentHTML('beforebegin', '<div class="js-mover-source"></div>');

			const $moverSource = $this.previousElementSibling,
				$moverTarget = document.querySelector($this.dataset.moverTarget),
				moverBreakpoint = $this.dataset.moverBreakpoint;
			let windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= moverBreakpoint) {
				$moverTarget.appendChild($this);
			}

			window.addEventListener('resize', function() {
				windowWidth = document.documentElement.clientWidth;

				if (windowWidth >= moverBreakpoint) {
					if ($this.parentNode !== $moverTarget) {
						$moverTarget.appendChild($this);
					}
				} else {
					if ($this.parentNode !== $moverSource) {
						$moverSource.parentNode.insertBefore($this, $moverSource.nextSibling);
					}
				}
			});
		}

		$movers.forEach(mover => moverStart(mover));
	}();

	// unwrapper function: fixing calculation bug because of scrollbar
	const unwrapperFunction = function(event) {
		const $unwrapper = document.querySelectorAll('.js-unwrapper');
		let math = `calc(50% - ${windowWidth}px/2)`;

		function unwrapperInit() {
			windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= 1152) {
				math = `calc(50% - ${windowWidth}px/2)`;

				$unwrapper.forEach(element => {
					element.style.marginLeft = math;
					element.style.marginRight = math;
				});
			} else {
				$unwrapper.forEach(element => {
					element.style.marginLeft = null;
					element.style.marginRight = null;
				});
			}
		}

		unwrapperInit();
		window.addEventListener('resize', unwrapperInit);
	}();

	// form file function
	/* EXAMPLE
		<div class="form-file js-form-file">
			<label class="form-file-label">File</label>
			<div class="form-file-input">
				<input type="file" id="checkout-attachment" class="input" name="file-attachment" data-multiple-placeholder="{count} files selected" multiple>
				<label for="file-attachment" class="label"><span class="button">Browse files</span> <span class="placeholder">No file selected&hellip;</span> <a href="#" class="remove" title="Remove attachment">&times;</a></label>
			</div>
		</div>
	*/
	const formFileFunction = function() {
		const $formFile = document.querySelectorAll('.js-form-file');

		$formFile.forEach(element => {
			const $fileInput = element.querySelector('.form-file-input'),
				$input = $fileInput.querySelector('.input'),
				$label = $fileInput.querySelector('.label'),
				$remove = $fileInput.querySelector('.remove'),
				labelDefault = $label.innerHTML;

			function addFile($this, event) {
				let $files = $this.files,
					fileName = '',
					fileSize = 0;

				for (let file of $files) {
					fileSize += file.size;
				}
				fileSize = Math.round(fileSize/1024/1024 * 100) / 100;

				if ($this.files && $this.files.length > 1) {
					fileName = `${($this.getAttribute('data-multiple-placeholder') || '').replace('{count}', $this.files.length)} (${fileSize}MB)`;
				} else if (event.target.value) {
					fileName = `${event.target.value.split('\\').pop()} <span class="filesize">(${fileSize}MB)</span>`;
				}

				if (fileName) {
					const $labelCaption = $label.querySelector('.placeholder');
					$labelCaption.innerHTML = fileName;
					$label.classList.add('has-placeholder');
				} else {
					removeFile(event);
				}
			}

			function removeFile(event) {
				$input.value = '';
				$label.innerHTML = labelDefault;
				$label.classList.remove('has-placeholder');
				event.preventDefault();
			}

			$input.addEventListener('change', function(event) {
				addFile(this, event);
			});

			if ($remove) {
				$remove.addEventListener('click', function(event) {
					removeFile(event);
				});
			}

		});
	}();

})();
