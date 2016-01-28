# djs-resize

JavaScript library to manage window resize events.

This object manages window's resizing event. It allows you to manage callbacks order through the class djs.Callstack. So you don't need to bother with the callbacks' order of `$(window).resize( function(){} );`.

It also detects the end of the resizing events suite and trigger callbacks.
For example, we define `delay = 100`.
Then if a resize starts and no resize's event is recorded for 100ms, we will consider the resizing is done and run the callbacks.
 
## Installation

```
bower install djs-resize
```

## Dependencies

This package requires [jQuery](http://jquery.com/) and [djs-call-stack](https://github.com/EdouardDem/djs-call-stack)

If you install it with Bower, the dependencies will be included.

## Usage

### Basic usage

```javascript
//Init the object (always first)
djs.resize.init();

//Define the delay (optionnal)
djs.resize.delay(500);

//Add a callback
djs.resize.bind('callback-id', function() {
    // Code ...
});
```

### Call stacks

