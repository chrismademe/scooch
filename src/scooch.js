const Scooch = function (node, options = {}) {
    // Default options
    let defaultOptions = {
        autoplay: false,
        autoplayInterval: 5000,
        keyboardControls: true,
        allowFullscreen: true,
        scrollToChange: true
    };

    this.options = Object.assign(defaultOptions, options);

    this.node = node;
    this.slides = Array.from(this.node.querySelectorAll('.scooch__slide'));
    this.firstSlide = this.slides[0];
    this.lastSlide = this.slides[this.slides.length - 1];
    this.currentSlide = null;
    this.nextSlide = null;
    this.previousSlide = null;

	/**
	 * Init
	 *
	 * Takes care of setting up the slider
	 */
    this.init = () => {
        // Setup the first slide
        this.firstSlide.style.opacity = 1;

        // Register it as the current and previous slides
        this.currentSlide = this.firstSlide;
        this.previousSlide = this.lastSlide;

        // Get the next slide
        this.nextSlide = this.firstSlide.nextElementSibling;

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
        // Check the slide index exists
        if (!this.slides[index]) return;
        let slide = this.slides[index];

        // Check if it matches lastSlide
        this.previousSlide =
            slide === this.firstSlide ? this.lastSlide : this.slides[index - 1];

        // Check if it matches firstSlide
        this.nextSlide =
            slide === this.lastSlide ? this.firstSlide : this.slides[index + 1];

        // Hide the currentSlide
        this.currentSlide.style.opacity = 0;

        // Set new slide
        this.currentSlide = slide;
        this.currentSlide.style.opacity = 1;
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
        let verticalDirection = event.deltaY > 0 ? 'up' : 'down';
        let horizontalDirection = event.deltaX > 0 ? 'right' : 'left';

        // Next
        if ( event.deltaY !== 0 && verticalDirection === 'down' ) this.next();
        if ( event.deltaX !== 0 && horizontalDirection === 'right' ) this.next();

        // Previous
        if ( event.deltaY !== 0 && verticalDirection === 'up' ) this.previous();
        if ( event.deltaX !== 0 && horizontalDirection === 'left' ) this.previous();
    }

    // Debounce
    this.debounce = (fn, d) => {
        let timer;
        return function() {
            let context = this;
            let args = arguments;
            clearTimeout(timer);

            timer = setTimeout(() => {
                fn.apply(context, args);
            }, d);
        }
    }

    // Run Init
    this.init();

    // Autoplay
    if (this.options.autoplay) {
        setInterval(this.next.bind(this), this.options.autoplayInterval);
    }
};
