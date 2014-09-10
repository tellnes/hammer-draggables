# hammer-draggables

This is an extension for [Hammer.js](http://eightmedia.github.io/hammer.js/)
which implements draggable elements.

## Usage

```js
var Draggables = require('hammer-draggables')

var dr = new Draggables($('ul'), { handle: 'LI' })
dr.on('start', function (event, dragging) {
  console.log('start', dragging)
})
dr.on('move', function (event, dragging) {
  console.log('move', dragging)
})
dr.on('end', function (event, dragging) {
  console.log('end', dragging)
})
```

## Install

    $ npm install hammer-draggables
    
    $ bower install https://github.com/tellnes/hammer-draggables.git

## License

MIT
