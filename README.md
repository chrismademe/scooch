# Scooch

Scooch makes slideshows easy. You bring your own content and styling. It's super lightweight, around 1.5kb gzipped and easy to customise.

## Installation

You can either download the repo, grab the JS and CSS and link them in your HTML, or if you prefer, you can install via NPM:

```bash
npm install scoochjs --save
```

## Usage

See demo in `index.html` for a setup guide.

## Options

You can pass an optional object to set any of the below items, as the second parameter, when instantiating Scooch.

e.g.

```javascript
new Scooch(element, { autoplay: false });
```

| Key                | Description                                                | Default Value |
| ------------------ | ---------------------------------------------------------- | ------------- |
| `autoplay`         | Move to the next slide automatically                       | `false`       |
| `autoplayInterval` | How often (in MS) to change slide, if `autoplay` is `true` | `5000`        |
| `keyboardControls` | Enable keyboard controls                                   | `true`        |
| `enableFullscreen` | Allow the slideshow to be made fullscreen                  | `true`        |
| `scrollToChange`   | Move to next/previous slides by scrolling                  | `true`        |
| `swipeToChange`    | Move to next/previous slides by swiping on a touch device  | `true`        |

## Methods

| Method             | Description                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| `next()`           | Go to the next slide                                                          |
| `previous()`       | Go to the previous slide                                                      |
| `goToSlide(index)` | Go to specific slide. `index` should be the array index of the slide to goto. |

## Keyboard Controls

-   Next Slide: `Right arrow`, `space`
-   Previous Slide: `Left arrow`
-   Enter Fullscreen: `F`
-   Exit Fullscreen: `esc`

💡 Tip: Hover over the left bottom corner of the `index.html` demo page to see keyboard controls.

## Roadmap

-   Add lifecycle events (e.g. `init`, `onSlideChange` etc.)
-   Make fullscreen only affect slideshow element
