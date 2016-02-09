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

First of all, the object needs to be initialized.
We can also define a delay to detect the end of the resize process.

```javascript
// Init the object (always first)
djs.resize.init();

// Define the delay (optionnal)
djs.resize.delay(500);

// Add a callback
djs.resize.bind('callback-id', function() {
    // Code ...
});
```

If you want to destroy this object, call `destroy`.

```javascript
djs.resize.destroy();
```

### Call stacks

The resize object use five stacks : `core`, `main`, `last`, `before` and `after`.
The first one is used by the others "djs" plugins. The `main` one, is the one you'll use (selected by default). The `last` is also a custom stack and will be executed after the `main` one.
The `before` and `after` are triggered before and after the resize event (regarding the "delay" option).

### Add and remove callbacks

This is the code to add a callback to the main stack :

```javascript
// Add a callback within the "main" stack
djs.resize.bind('cb-m-1', function() {
    console.log('Callback Main 1');
});

// Is equivalent to
djs.resize.bind('cb-m-2', function() {
    console.log('Callback Main 2');
}, djs.resize.stacks.main);
```

If you want to add a callback in another stack, you should write this :

```javascript
// Add to the "before" stack
djs.resize.bind('cb-1', function() {
    // Code...
}, djs.resize.stacks.before);
// Or
djs.resize.bind('cb-1', function() {
    // Code...
}, "before");

// Add to last
djs.resize.bind('cb-2', function() {
    // Code...
}, djs.resize.stacks.last);
```

If you wish to remove a callback

```javascript
// Remove from main stack
djs.resize.unbind('cb-1');
// Or
djs.resize.unbind('cb-1', djs.resize.stacks.main);

// Remove from the before stack
djs.resize.unbind('cb-before-1', djs.resize.stacks.before);
```

### Ordering the stacks

To set the order of the stacks, we can access directly the object.
For more information, see [djs-call-stack](https://github.com/EdouardDem/djs-call-stack).

```javascript
// Set the order of the main stack
djs.resize.stack().order = ['cb-m-1', 'cb-m-2', 'cb-m-3'];

// Set the order of the after stack
djs.resize.stack(djs.resize.stacks.after).order = ['cb-m-1', 'cb-m-2', 'cb-m-3'];
// Or
djs.resize.stack("after").order = ['cb-m-1', 'cb-m-2', 'cb-m-3'];
```

### Force refresh

To force a refresh, you can call the method `refresh`. This will trigger the execution of the stacks `core`, `main` and `last`.

```javascript
djs.resize.refresh();
```

### CSS classes

When resizing and when calling the method `refresh`, this object adds CSS classes to the body element. It sets `djs-resize-pending` in the first case, `djs-resizing` in the second one.
You may change these classes. To do so, call this :

```javascript
djs.resize.classes.resizing = "your-class";
djs.resize.classes.pending = "your-other-class";
```
