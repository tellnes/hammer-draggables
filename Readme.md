# hammer-dragables

This is an extension for [Hammer.js](http://eightmedia.github.io/hammer.js/)
which implements draggable elements.

## Usage

```js
var Dragables = require('hammer-dragables')

var dr = new Dragables($('ul'), { handle: 'LI' })
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

    $ npm install hammer-dragables
    
    $ bower install https://github.com/tellnes/hammer-dragables.git 

## License

MIT
