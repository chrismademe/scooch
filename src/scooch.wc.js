class Scooch extends HTMLElement {
	connectedCallback() {
		// Default options
		this.options = {
			autoplay: this.dataset.autoplay || false,
			autoplayInterval: this.dataset['autoplay-interval'] || 5000,
			keyboardControls: this.dataset['keyboard-controls'] || true,
			allowFullscreen: this.dataset.fullscreen || true,
			scrollToChange: this.dataset.scroll || true,
			swipeToChange: this.dataset.swipe || true
		};

		this.slides = Array.from(this.querySelectorAll('.scooch__slide'));
		this.firstSlide = this.slides[0];
		this.lastSlide = this.slides[this.slides.length - 1];
		this.currentSlide = null;
		this.nextSlide = null;
		this.previousSlide = null;
		this.swipeInitialX = null;
		this.swipeInitialY = null;
		this.isChangingSlide = false;
		this.init();
	}

	/**
	 * Init
	 *
	 * Takes care of setting up the slider
	 */
	init() {
		// Setup the first slide
		this.firstSlide.setAttribute('aria-current', true);

		// Register it as the current and previous slides
		this.currentSlide = this.firstSlide;
		this.previousSlide = this.lastSlide;

		// Get the next slide
		this.nextSlide = this.firstSlide.nextElementSibling;

		// Stop the container moving if we swipe
		if (this.options.swipeToChange) {
			this.addEventListener(
				'touchstart',
				this.handleStartSwipe.bind(this),
				false
			);
			this.addEventListener(
				'touchmove',
				this.handleSwipe.bind(this),
				false
			);
		}

		// Setup Key Press listeners
		if (this.options.keyboardControls) {
			document.addEventListener('keyup', this.handleKeyPress.bind(this));
		}

		// Setup Scroll Listeners
		if (this.options.scrollToChange) {
			window.addEventListener(
				'wheel',
				this.debounce(this.handleScroll, 300).bind(this)
			);
		}

		// Autoplay
		if (this.options.autoplay) {
			setInterval(this.next.bind(this), this.options.autoplayInterval);
		}
	}

	next() {
		this.goToSlide(this.slides.indexOf(this.nextSlide));
	}

	previous() {
		this.goToSlide(this.slides.indexOf(this.previousSlide));
	}

	goToSlide(index) {
		// Check the slide index exists and we're not changing slides already
		if (!this.slides[index] || this.isChangingSlide) return;
		let slide = this.slides[index];

		// Set flag to stop changing slides more than once at the same time
		this.isChangingSlide = true;

		// Check if it matches lastSlide
		this.previousSlide =
			slide === this.firstSlide ? this.lastSlide : this.slides[index - 1];

		// Check if it matches firstSlide
		this.nextSlide =
			slide === this.lastSlide ? this.firstSlide : this.slides[index + 1];

		// Hide the currentSlide
		this.currentSlide.removeAttribute('aria-current');

		// Set new slide
		this.currentSlide = slide;
		this.currentSlide.setAttribute('aria-current', true);
		this.isChangingSlide = false;
	}

	// Handle Key Press
	handleKeyPress(event) {
		event.preventDefault();

		// Previous slide
		if (event.keyCode === 37 || event.keyCode === 38) {
			this.previous();
		}

		// Next slide
		if (
			event.keyCode === 39 ||
			event.keyCode === 32 ||
			event.keyCode === 40
		) {
			this.next();
		}

		// Full screen
		if (event.keyCode === 70 && this.options.allowFullscreen) {
			document.body.requestFullscreen();
		}
	}

	// Handle Scroll
	handleScroll(event) {
		// Next
		if (event.deltaY !== 0 && event.deltaY < 0) this.next();
		if (event.deltaX !== 0 && event.deltaX > 0) this.next();

		// Previous
		if (event.deltaY !== 0 && event.deltaY > 0) this.previous();
		if (event.deltaX !== 0 && event.deltaX < 0) this.previous();
	}

	// Handle Start Swipe
	handleStartSwipe(event) {
		this.swipeInitialX = event.touches[0].clientX;
		this.swipeInitialY = event.touches[0].clientY;
	}

	// Handle Swipe
	handleSwipe(event) {
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
	}

	// Debounce
	debounce(fn, d) {
		let timer;
		return function () {
			let context = this;
			let args = arguments;
			clearTimeout(timer);

			timer = setTimeout(() => {
				fn.apply(context, args);
			}, d);
		};
	}
}

if (window.customElements) {
	window.customElements.define('scooch-carousel', Scooch);
}
