var inherits = require('inherits')
  , EventEmitter = require('events').EventEmitter
  , Hammer = require('hammerjs')

module.exports = Draggables
Draggables.Dragging = Dragging

function elementMatches(element, selector) {
  if (!selector) return element
  switch (selector[0]) {
  case '#':
    return element.id === selector.slice(1)
  case '.':
    return element.classList.contains(selector.slice(1))
  default:
    return element.nodeName === selector.toUpperCase()
  }
}

function Draggables(obj, options) {
  EventEmitter.call(this)

  options = options || {}
  if (obj.length) obj = obj[0]
  if (obj.nodeName) obj = new Hammer(obj, options)
  this.hammer = obj
  this.element = options.element || obj.element

  this.draggable = options.draggable || ''
  this.handle = options.handle || this.draggable
  this.axis = options.axis || false
  this.revert = !!options.revert

  if (options.previous) {
    this.previous = options.previous
    this.previous.next = this
  }
  if (options.next) {
    this.next = options.next
    this.next.previous = this
  }

  var self = this

  this.startHandler = function (event) {
    self.start(event)
  }
  this.moveHandler = function (event) {
    self.move(event)
  }
  this.endHandler = function (event) {
    self.end(event)
  }

  this.hammer.on('dragstart', this.startHandler)
}
inherits(Draggables, EventEmitter)


Draggables.prototype.destroy = function () {
  this.hammer.off('dragstart', this.startHandler)
  this.element = null
  if (this.previous) this.previous.next = this.next
  if (this.next) this.next.previous = this.previous
  this.previous = null
  this.next = null
}

Draggables.prototype.match = function (event) {
  var element = event.target
    , match

  while (element && !elementMatches(element, this.handle)) {
    if (element === this.hammer.element) return
    if (element === this.element) return
    element = element.parentNode
  }

  while (element && !elementMatches(element, this.draggable)) {
    if (element === this.hammer.element) return
    if (element === this.element) return
    element = element.parentNode
  }

  match = element
  while (element) {
    if (element === this.element) return match
    element = element.parentNode
  }

  return
}

Draggables.prototype.start = function (event) {
  if (!event.gesture) return

  var element = this.match(event)
  if (!element) return

  this.hammer.on('drag', this.moveHandler)
  this.hammer.on('dragend', this.endHandler)

  this.dragging = new Dragging(this, element)
  this.emit('start', event, this.dragging)
  this.dragging.updatePosition(event)
}

Draggables.prototype.move = function (event) {
  if (!event.gesture) return
  event.preventDefault()
  event.stopPropagation()
  event.gesture.stopPropagation()
  event.gesture.preventDefault()

  this.dragging.updatePosition(event)
  this.emit('move', event, this.dragging)
}

Draggables.prototype.end = function (event) {
  if (!event.gesture) return

  if (this.revert) {
    this.dragging.reset()
  }

  this.hammer.off('drag', this.moveHandler)
  this.hammer.off('dragend', this.endHandler)
 
  this.emit('end', event, this.dragging)

  this.dragging = null
}


function Dragging(draggables, element) {
  this.draggables = draggables
  this.element = element

  this.offset = { left: 0, top: 0 }

  element.style.position = 'relative'
}

Dragging.prototype.updatePosition = function (event) {
  if (!this.draggables.axis || this.draggables.axis === 'x') {
    this.left = event.gesture.deltaX + this.offset.left
    this.element.style.left = this.left + 'px'
  }
  if (!this.draggables.axis || this.draggables.axis === 'y') {
    this.top = event.gesture.deltaY + this.offset.top
    this.element.style.top = this.top + 'px'
  }
}

Dragging.prototype.reset = function () {
  this.element.style.position = ''
  this.element.style.left = ''
  this.element.style.top = ''
}
