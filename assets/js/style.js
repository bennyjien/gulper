/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */
/* global window document history MouseEvent getParameterByName hasChild equalheight anime ScrollMagic imagesLoaded Pikaday */

(function() {
	const $body = document.querySelector('body'),
		$site = document.querySelector('#site-container'),
		sceneController = new ScrollMagic.Controller({
			refreshInterval: 0 // if 100 has bug on parallax, 0 has better performance, must recalculate on resize
		});

	let windowWidth = document.documentElement.clientWidth;

	// preload images
	imagesLoaded($site, function() {
		document.body.classList.remove('site-loading');
	});

	// anime stock animation
	const animate = {
		fadeIn: (element, duration, delay = 0) => {
			anime.remove(element);
			element.style.display = 'block';
			element.style.opacity = 0;

			anime({
				targets: element,
				duration,
				delay,
				opacity: 1,
				easing: 'easeOutQuad'
			});
		},
		fadeOut: (element, duration, delay = 0) => {
			anime.remove(element);

			anime({
				targets: element,
				duration,
				delay,
				opacity: 0,
				easing: 'easeOutQuad',
				complete: function() {
					anime.set(element, {
						display: 'none'
					});
				}
			});
		},
		slideDown: (element, duration, delay = 0) => {
			anime.remove(element);
			element.style.display = 'block';
			element.style.height = 'auto';
			const targetHeight = element.offsetHeight;
			element.style.height = 0;
			element.style.overflow = 'hidden';
			element.style.opacity = 0;

			anime({
				targets: element,
				duration,
				delay,
				height: targetHeight,
				opacity: 1,
				easing: 'easeOutQuad'
			});
		},
		slideUp: (element, duration, delay = 0) => {
			anime.remove(element);
			element.style.overflow = 'hidden';

			anime({
				targets: element,
				duration,
				delay,
				height: 0,
				opacity: 0,
				easing: 'easeOutQuad',
				complete: function() {
					anime.set(element, {
						display: 'none'
					});
				}
			});
		}
	};

	// scroll to targeted id
	function scrollTo(event, element) {
		const scrollY = window.scrollY,
			scrollTarget = element.dataset.scrollTarget || element.hash || '',
			$scrollTarget = document.querySelector(`[id='${scrollTarget.substring(1)}']`),
			scrollTargetY = $scrollTarget.getBoundingClientRect().top,
			scrollDuration = element.dataset.scrollDuration || 400,
			$offset = document.querySelector(element.dataset.scrollOffset) || '',
			offsetY = $offset.offsetHeight || 0;

		const prop = {
			y: 0
		};

		if ($scrollTarget) {
			anime({
				targets: prop,
				y: scrollTargetY + scrollY - offsetY,
				round: 1,
				duration: scrollDuration,
				easing: 'easeOutQuad',
				update: function() {
					window.scrollTo(0, prop.y);
				}
			});
			event.preventDefault();
		}
	}

	// scroller function
	/* data-scroll-target="[selector]" -> scroll to target
	   data-scroll-offset="[selector]" -> offset of selector height
	   data-scroll-duration="[duration]" -> how long is scrolling animation
	*/
	const scrollFunction = function() {
		const $scrolls = document.querySelectorAll('.js-scroll');

		// add .in-viewport for .js-scroll links (too mark current selected)
		function elementClass(scroll) {
			const scrollTarget = scroll.dataset.scrollTarget || scroll.hash || '',
				$scrollTarget = document.querySelector(`[id='${scrollTarget.substring(1)}']`);
			let scrollTargetHeight = $scrollTarget.offsetHeight;

			function updateDuration() {
				scrollTargetHeight = $scrollTarget.offsetHeight;
				return scrollTargetHeight;
			}

			imagesLoaded($scrollTarget, function() {
				const scene = new ScrollMagic.Scene({ triggerElement: $scrollTarget, triggerHook: 0.5, duration: scrollTargetHeight, reverse: true })
					.setClassToggle([scroll, $scrollTarget], 'in-viewport')
					// .addIndicators()
					.addTo(sceneController);

				window.addEventListener('resize', updateDuration);
				scene.duration(updateDuration);
			});
		}

		$scrolls.forEach(scroll => {
			scroll.addEventListener('click', function(event) {
				scrollTo(event, this);
			});

			elementClass(scroll);
		});
	};

	// init ScrollMagic Scene
	/* data-scene-stagger="[second]" -> staggering children duration
	/* data-scene-parallax="[percent]" -> how much does the element will be shifted
	/* data-scene-parallax-speed="[number]" -> how fast does the element will be shifted
	/* data-scene-parallax-type="[tranform|background]" -> what to shift
	*/
	function scrollAnimation(element) {
		const $scenes = document.querySelectorAll(element);

		$scenes.forEach(scene => {
			const sceneChild = scene.children,
				stagger = scene.dataset.sceneStagger || 0,
				parallax = scene.dataset.sceneParallax || 0,
				parallaxSpeed = scene.dataset.sceneParallaxSpeed || 1,
				parallaxType = scene.dataset.sceneParallaxType || 'transform',
				parallaxDuration = parallax ? scene.offsetHeight/parallaxSpeed : 0,
				reverse = stagger ? false : true,
				triggerHook = 0.8;

			let parallaxAnimation;

			imagesLoaded($site, function() {
				scene.magic = new ScrollMagic.Scene({ triggerElement: scene, triggerHook: triggerHook, duration: parallaxDuration, reverse: reverse })
					.setClassToggle(scene, 'in-viewport')
					.addIndicators()
					.addTo(sceneController);

				scene.magic.on('start', function() {
					if (stagger) {
						anime({
							targets: sceneChild,
							display: 'block',
							delay: (el, i) => {
								setTimeout(function() {
									el.classList.add('in-viewport');
								}, i * stagger);
								return i * stagger;
							}
						});
					}

					if (parallax) {
						if (parallaxType === 'transform') {
							anime.set(scene, {
								translateY: `${parallax}%`
							});
						} else if (parallaxType === 'background') {
							anime.set(scene, {
								backgroundPositionY: `${parallax}%`
							});
						}

						parallaxAnimation = anime({
							targets: scene,
							backgroundPositionY: 0,
							translateY: 0,
							duration: parallaxDuration,
							easing: 'linear',
							autoplay: false
						});
					}
				});

				scene.magic.on('progress', function(event) {
					if (parallax) {
						parallaxAnimation.seek(parallaxDuration * event.progress);
					}
				});
			});

		});
	}

	scrollAnimation('.js-scene');

	// tab function, can use scroll to function
	/* data-tab-type="normal|collapse" -> collapse tab can be closed individually
	   data-tab-group="[name]" -> tab grouping
	   data-tab-duration="[second]" -> how long is tab animation if tab method is auto
	*/
	const tabFunction = function() {
		const $tabs = document.querySelectorAll('.js-tab-link');

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
					tabDuration = $this.dataset.tabDuration || 0,
					tabScrollTarget = $this.dataset.scrollTarget;

				if (!$tabTarget.classList.contains('is-tabbed')) {
					anime({
						targets: $tabTargetGroup,
						duration: 0,
						opacity: 0,
						complete: function() {
							anime.set($tabTargetGroup, {
								display: 'none',
								overflow: 'hidden'
							});
							animate.slideDown($tabTarget, tabDuration);
						}
					});

					$tabGroup.forEach(element => element.classList.remove('is-tabbed'));
					$this.classList.add('is-tabbed');
					$tabTarget.classList.add('is-tabbed');

					if (tabScrollTarget) {
						setTimeout(function() {
							scrollTo(event, $this);
						}, tabDuration);
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
	const toggleFunction = function(element) {
		const $toggles = $body.querySelectorAll(element),
			togglesClass = element.substring(1);

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
				toggleDuration = $this.dataset.toggleDuration || 200,
				toggleIteration = $this.dataset.toggleIteration || 'infinite',
				toggleScrollTarget = $this.dataset.scrollTarget,
				toggleKeyclose = $this.dataset.toggleKeyclose || false,
				bodyClass = toggleTarget.substring(1),
				preventDefault = $this.dataset.toggleTarget ? false : true;

			let clickPrevent = false;

			if (toggleTarget === $this.hash) clickPrevent = true;
			if (!$toggleTarget) return false;
			if (!$this.classList.contains(togglesClass)){
				return false;
			}

			if (event.type === 'mouseenter' || event.type === 'touchstart') {
				if (toggleTrigger === 'hover') {
					const $toggleLinkToggled = $toggleArea.querySelectorAll(`${element}.is-toggled`);

					if (toggleIteration === 'once') {
						$this.classList.remove(togglesClass);
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
					} else if (toggleAnimation === 'fade') {
						$toggleCurrentToggled.forEach(toggle => {
							animate.fadeOut(toggle, toggleDuration/2);
						});
					}

					$toggleCurrentToggled.forEach(toggle => toggle.classList.remove('is-toggled'));

					if ($this.classList.contains('is-toggled') === false) {
						$this.classList.add('is-toggled');
						$toggleTarget.classList.add('is-toggled');
						if (toggleAnimation === 'slide') {
							animate.slideDown($toggleTarget, toggleDuration, toggleDuration/2);
						} else if (toggleAnimation === 'fade') {
							animate.fadeIn($toggleTarget, toggleDuration, toggleDuration/2);
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
						$this.classList.replace(togglesClass, `${togglesClass}-inactive`);
					}

					if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled') || window.getComputedStyle($toggleTarget).getPropertyValue('display') !== 'none') {
						if (!hasChild($this, $toggleArea)) {
							var $toggler = document.querySelectorAll('.'+bodyClass+'-toggler');

							$toggler.forEach(element => {
								element.classList.replace(`${togglesClass}-inactive`, togglesClass);
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
							} else if (toggleAnimation === 'fade') {
								animate.fadeOut($toggleTarget, toggleDuration/2);
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
						} else if (toggleAnimation === 'fade') {
							animate.fadeIn($toggleTarget, toggleDuration);
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
					} else if (toggleAnimation === 'fade') {
						animate.fadeOut($toggleTarget, toggleDuration/2);
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
						} else if (toggleAnimation === 'fade') {
							animate.fadeOut($toggleTarget, toggleDuration/2);
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
	};

	toggleFunction('.js-toggle');
	// note: require more research
	// toggleFunction('.js-popup', {
	// 	animation: 'fade',
	// 	keyclose: true
	// });


	// mover function (will move elements depending of breakpoints)
	/* data-mover-breakpoint="[width]" -> mover breakpoint width
	   data-mover-target="[selector]" -> mover will append selected element to this selector
	*/
	const moverFunction = function(element) {
		const $movers = document.querySelectorAll(element);

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
	};

	moverFunction('.js-mover');

	// unwrapper function: fixing calculation bug because of scrollbar
	const unwrapperFunction = function(element) {
		const $unwrapper = document.querySelectorAll(element);
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
	};

	unwrapperFunction('.js-unwrapper');

	// form interaction
	const formInteraction = function() {
		const $formLabel = document.querySelectorAll('.js-form-input');

		$formLabel.forEach( element => {
			let $input = element.querySelectorAll('.input');

			$input.forEach(input => {
				input.addEventListener('focus', function() {
					this.parentNode.classList.add('is-filled');
				});

				input.addEventListener('blur', function() {
					var input = this;
					setTimeout(function() {
						if (input.value === '') input.parentNode.classList.remove('is-filled');
					}, 100);
				});

				window.addEventListener('load', function() {
					const parent = input.closest('.form-input-field');

					if (parent) {
						parent.classList.add('is-loaded');
						if (input.value) {
							parent.classList.add('is-filled');
						}
					}
				});

				// show password
				const $passwordInput = element.querySelector('.form-input-password .input'),
					$passwordShower = element.querySelector('.form-input-password .action');

				function showPassword() {
					if ($passwordInput.type === 'password') {
						$passwordInput.type = 'text';
					} else {
						$passwordInput.type = 'password';
					}
				}

				if ($passwordShower) {

					$passwordShower.addEventListener('click', function(event) {
						showPassword();
						event.preventDefault();
					});
				}

				// pikaday support
				const $inputDate = element.querySelector('.form-input-date');

				if ($inputDate) {
					const $fieldInput = $inputDate.querySelector('.input');
					let $dateFormat = $fieldInput.dataset.dateFormat ? $fieldInput.dataset.dateFormat : 'DD-MM-YYYY';
					let $minDate = $fieldInput.dataset.minDate;
					new Pikaday({
						field: $fieldInput,
						format: $dateFormat,
						minDate: $minDate ? new Date($minDate) : new Date()
					});
				}
			});

		});
	}();

	// form file function
	/* EXAMPLE
		<div class="form-file js-form-file">
			<label class="form-file-heading" for="file-attachment">File</label>
			<div class="form-file-field">
				<input type="file" id="file-attachment" class="input" name="file-attachment" data-multiple-placeholder="{count} files selected" multiple>
				<label for="file-attachment" class="label"><span class="button">Browse files</span> <span class="placeholder">No file selected&hellip;</span> <a href="#" class="remove" title="Remove attachment">&times;</a></label>
			</div>
		</div>
	*/
	const formFileFunction = function() {
		const $formFile = document.querySelectorAll('.js-form-file');

		$formFile.forEach(element => {
			const $fileField = element.querySelector('.form-file-field'),
				$input = $fileField.querySelector('.input'),
				$label = $fileField.querySelector('.label'),
				$remove = $fileField.querySelector('.remove'),
				$placeholder = $label.querySelector('.placeholder'),
				labelDefault = $placeholder.innerHTML;

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
					$placeholder.innerHTML = fileName;
					$label.classList.add('has-placeholder');
				} else {
					removeFile(event);
				}
			}

			function removeFile(event) {
				$input.value = '';
				$placeholder.innerHTML = labelDefault;
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
