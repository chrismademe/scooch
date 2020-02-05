# Scooch

Scooch makes slideshows easy. You bring your own content and styling. It's super lightweight, around 1kb gzipped and easy to customise.

## Usage

See demo in `index.html` for a setup guide. **Note** If fullscreen is enabled, the whole body of the document is made fullscreen. I'd like to address this in a future update.

## Options

You can pass an optional object to set any of the below items when instantiating Scooch as the second parameter.

e.g.

```javascript
new Scooch(element, { autoplay: false })
```

| Key | Description | Default Value |
|---|---|---|
| `autoplay ` | Move to the next slide automatically | `false` |
| `autoplayInterval` | How often (in MS) to change slide, if `autoplay` is `true` | 5000 |
| `keyboardControls` | Enable keyboard controls | `true` |
| `enableFullscreen` | Allow the slideshow to be made fullscreen | `true` |

## Roadmap

- Add lifecycle events (e.g. `init`, `onSlideChange` etc.)
- Make fullscreen only affect slideshow element