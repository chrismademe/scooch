const Scooch = function (node, options = {}) {
    // Default options
    let defaultOptions = {
        autoplay: false,
        autoplayInterval: 5000,
        keyboardControls: true,
        allowFullscreen: true,
    };

    this.options = Object.assign(defaultOptions, options);

    this.node = node;
    this.slides = this.node.querySelectorAll('.scooch-slide');
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
    };

    this.next = () => {
        // Check we have a next slide
        if (this.nextSlide === null) {
            this.nextSlide = this.firstSlide;
        }

        // Hide the current slide
        this.currentSlide.style.opacity = 0;

        // Show the next slide
        this.nextSlide.style.opacity = 1;

        // Set this as previousSlide
        this.previousSlide = this.currentSlide;

        // Set the current slide
        this.currentSlide = this.nextSlide;

        // Get the next slide
        this.nextSlide = this.nextSlide.nextElementSibling;
    };

    this.previous = () => {
        // Check we have a previous slide
        if (this.previousSlide === null) {
            this.previousSlide = this.lastSlide;
        }

        // Hide the current slide
        this.currentSlide.style.opacity = 0;

        // Show the next slide
        this.previousSlide.style.opacity = 1;

        // Set this as nextSlide
        this.nextSlide = this.currentSlide;

        // Set the current slide
        this.currentSlide = this.previousSlide;

        // Update previous slide
        this.previousSlide = this.currentSlide.previousElementSibling;
    };

    // Handle Key Press
    this.handleKeyPress = (event) => {
        event.preventDefault();

        // Previous slide
        if (event.keyCode === 37) {
            this.previous();
        }

        // Next slide
        if (event.keyCode === 39 || event.keyCode === 32) {
            this.next();
        }

        // Full screen
        if (event.keyCode === 70 && this.options.allowFullscreen) {
            this.node.requestFullscreen();
        }
    };

    // Run Init
    this.init();

    // Autoplay
    if (this.options.autoplay) {
        setInterval(this.next.bind(this), this.options.autoplayInterval);
    }
};
