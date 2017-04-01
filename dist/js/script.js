/* This file contains main script for website
 * Style related scripts is located in style.js
 */
/* global document jQuery */

// initialize when document is ready
jQuery(document).ready(function($) {

	// initialize Flickity
	var $slider = $('.js-slider').find('.slides').flickity({
		imagesLoaded: true,
		pageDots: false
	});

	var sliderFlick = $slider.data('flickity');
	var $sliderNav = $slider.siblings('.slides-nav');
	var $sliderNavButton = $sliderNav.find('.bullet');

	$slider.on('cellSelect', function() {
		$sliderNavButton.filter('.is-selected').removeClass('is-selected');
		$sliderNavButton.eq(sliderFlick.selectedIndex).addClass('is-selected');
	});

	$sliderNav.on('click', '.bullet', function(e) {
		var index = $(this).index();
		$slider.flickity('select', index);
		e.preventDefault();
	});

	// initialize magnificPopup
	$('.js-popup-link').magnificPopup({
		type: 'inline',
		mainClass: 'mfp-animation',
		removalDelay: 200
	});

});
