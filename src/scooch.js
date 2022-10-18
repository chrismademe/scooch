const Scooch = function (node, options = {}) {
	// Default options
	let defaultOptions = {
		autoplay: false,
		autoplayInterval: 5000,
		keyboardControls: true,
		allowFullscreen: true,
		scrollToChange: true,
		swipeToChange: true,
	};

	this.options = Object.assign(defaultOptions, options);

	this.node = node;
	this.slides = Array.from(this.node.querySelectorAll('.scooch__slide'));
	this.firstSlide = this.slides[0];
	this.lastSlide = this.slides[this.slides.length - 1];
	this.currentSlide = null;
	this.nextSlide = null;
	this.previousSlide = null;
	this.swipeInitialX = null;
	this.swipeInitialY = null;
	this.timer = null;

	/**
	 * Init
	 *
	 * Takes care of setting up the slider
	 */
	this.init = () => {
		// Setup the first slide
		this.firstSlide.setAttribute('aria-current', true);

		// Register it as the current and previous slides
		this.currentSlide = this.firstSlide;
		this.previousSlide = this.lastSlide;

		// Get the next slide
		this.nextSlide = this.firstSlide.nextElementSibling;

		// Stop the container moving if we swipe
		if (this.options.swipeToChange) {
			this.node.addEventListener('touchstart', this.handleStartSwipe.bind(this), false);
			this.node.addEventListener('touchmove', this.handleSwipe.bind(this), false);
		}

		// Setup Key Press listeners
		if (this.options.keyboardControls) {
			document.addEventListener('keyup', this.handleKeyPress.bind(this));
		}

		// Setup Scroll Listeners
		if (this.options.scrollToChange) {
			window.addEventListener('wheel', this.debounce(this.handleScroll, 300).bind(this));
		}
	};

	this.next = () => {
		this.goToSlide(this.slides.indexOf(this.nextSlide));
	};

	this.previous = () => {
		this.goToSlide(this.slides.indexOf(this.previousSlide));
	};

	this.goToSlide = (index) => {
		if (this.options.autoplay) {
			/**
			 * Clear the current timer
			 *
			 * This stops odd behaviour where you can manually switch to a slide right before
			 * the current timer runs out and it will immediate move on the next slide again
			 */
			clearTimeout(this.timer);
		}

		// Check the slide index exists
		if (!this.slides[index]) return;
		let slide = this.slides[index];

		// Check if it matches lastSlide
		this.previousSlide = slide === this.firstSlide ? this.lastSlide : this.slides[index - 1];

		// Check if it matches firstSlide
		this.nextSlide = slide === this.lastSlide ? this.firstSlide : this.slides[index + 1];

		// Hide the currentSlide
		this.currentSlide.removeAttribute('aria-current');

		// Set new slide
		this.currentSlide = slide;
		this.currentSlide.setAttribute('aria-current', true);

		// Setup a new timer
		if (this.options.autoplay) {
			this.timer = setTimeout(this.next.bind(this), this.options.autoplayInterval);
		}
	};

	// Handle Key Press
	this.handleKeyPress = (event) => {
		event.preventDefault();

		// Previous slide
		if (event.keyCode === 37 || event.keyCode === 38) {
			this.previous();
		}

		// Next slide
		if (event.keyCode === 39 || event.keyCode === 32 || event.keyCode === 40) {
			this.next();
		}

		// Full screen
		if (event.keyCode === 70 && this.options.allowFullscreen) {
			document.body.requestFullscreen();
		}
	};

	// Handle Scroll
	this.handleScroll = (event) => {
		// Next
		if (event.deltaY !== 0 && event.deltaY < 0) this.next();
		if (event.deltaX !== 0 && event.deltaX > 0) this.next();

		// Previous
		if (event.deltaY !== 0 && event.deltaY > 0) this.previous();
		if (event.deltaX !== 0 && event.deltaX < 0) this.previous();
	};

	// Handle Start Swipe
	this.handleStartSwipe = (event) => {
		this.swipeInitialX = event.touches[0].clientX;
		this.swipeInitialY = event.touches[0].clientY;
	};

	// Handle Swipe
	this.handleSwipe = (event) => {
		event.preventDefault();

		// Bail if no touch
		if (this.swipeInitialX === null || this.swipeInitialY === null) return;

		let swipeCurrentX = event.touches[0].clientX;
		let swipeCurrentY = event.touches[0].clientY;
		let swipeDiffX = this.swipeInitialX - swipeCurrentX;
		let swipeDiffY = this.swipeInitialY - swipeCurrentY;

		// Only detect horizontal swipes
		if (Math.abs(swipeDiffX) > Math.abs(swipeDiffY)) {
			if (swipeDiffX > 0) {
				this.next();
			} else {
				this.previous();
			}
		}

		// Clean up
		this.swipeInitialX = null;
		this.swipeInitialY = null;
	};

	// Debounce
	this.debounce = (fn, d) => {
		let timer;
		return function () {
			let context = this;
			let args = arguments;
			clearTimeout(timer);

			timer = setTimeout(() => {
				fn.apply(context, args);
			}, d);
		};
	};

	// Run Init
	this.init();

	// Autoplay
	if (this.options.autoplay) {
		this.timer = setTimeout(this.next.bind(this), this.options.autoplayInterval);
	}
};

window.dispatchEvent(new CustomEvent('scooch:init'));
