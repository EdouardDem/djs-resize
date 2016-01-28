/**
 * @author Edouard Demotes-Mainard <https://github.com/EdouardDem>
 * @license http://opensource.org/licenses/BSD-2-Clause BSD 2-Clause License
 */

/**
 * Object djs for namespace
 */
window.djs = window.djs || {};

/**
 * This object manages window's resizing event.
 * It detects the end of the resizing events suite and trigger callbacks.
 * It also allows to manage callbacks order through the class djs.Callstack
 * This object is "chainable".
 *
 * @see https://github.com/EdouardDem/djs-resize
 * @requires djs.CallStack <https://github.com/EdouardDem/djs-call-stack>
 */
djs.resize = {

	/* ========================================================================
	 * 	CONSTANTS
	 * ====================================================================== */
	/**
	 * CSS classes used to tag the body while processing
	 *
	 * @const
	 * @var {Object}
	 */
	classes: {
		resizing: 'djs-resizing'
	},

	/**
	 * Names and order of the call stacks used by this object
	 *
	 * @const
	 * @var {Object}
	 */
	stacks: {
		core: 'core',
		main: 'main',
		last: 'last'
	},

	/* ========================================================================
	 * 	PROPERTIES
	 * ====================================================================== */
	/**
	 * Delay used to detect the end of the resize.
	 * For example, if we define delay = 100, then if a resize starts and no resize's event is recorded for 100ms,
	 * we will consider the resizing is done and run the callbacks.
	 * To disables this feature, delay should be set to 0.
	 *
	 * @private
	 * @var {Integer}
	 */
	_delay: 0,

	/**
	 * Namespace used to bind events
	 *
	 * @private
	 * @var {String}
	 */
	_namespace: 'djs-resize',

	/**
	 * Flag used to determine if the object is initialized
	 *
	 * @private
	 * @var {Boolean}
	 */
	_initialized: false,

	/**
	 * The jQuery window object
	 *
	 * @private
	 * @var {Object}
	 */
	_$window: null,

	/**
	 * The jQuery body object
	 *
	 * @private
	 * @var {Object}
	 */
	_$body: null,

	/**
	 * Object containing the instances of djs.Callstack
	 *
	 * @private
	 * @var {Object}
	 */
	_stacks: {},

	/**
	 * Object used to get inactivity delay
	 *
	 * @private
	 * @var {Object}
	 */
	_timeout: null,


	/* ========================================================================
	 * 	INITIALIZATION
	 * ====================================================================== */
	/**
	 * Initialize the object
	 *
	 * @return {Object}
	 */
	init: function () {

		// Check if already initialized
		if (this._initialized) return this;

		// Objects
		this._$window = $(window);
		this._$body = $('body');

		// Initialize the call stacks
		$.each(this.stacks, function (i, e) {
			this._stacks[e] = new djs.CallStack();
		}.bind(this));

		// Bind the resize event
		this._$window.bind('resize.' + this._namespace, function () {

			// Check if initialized
			if (this._initialized) {

				// If a delay is defined, we set a timeout to trigger call stacks
				if (this._delay > 0) {

					// Clear timeout of previous resize's event
					clearTimeout(this._timeout);

					// Set new timeout
					this._timeout = setTimeout(function () {

						// Call the refresh
						this.refresh();

					}.bind(this), this._delay);

				}

				// If no delay, just call the refresh function
				else {
					this.refresh();
				}

			}

		}.bind(this));

		// Set the flag to prevent another initialization
		this._initialized = true;

		// Return self
		return this;
	},

	/**
	 * Destroy the object (if initialized)
	 *
	 * @return {Object}
	 */
	destroy: function () {

		// Check if already initialized
		if (!this._initialized) return this;

		// Unbind the events
		this._$window.unbind('resize.' + this._namespace);

		// Reset the stacks
		this._stacks = {};

		// Unset the flag
		this._initialized = false;

		// Return self
		return this;
	},
	/**
	 * Re-initialize the object
	 *
	 * @return {Object}
	 */
	reinit: function () {
		// Destroy and init
		return this.destroy().init();
	},


	/* ========================================================================
	 * 	BINDING
	 * ====================================================================== */
	/**
	 * Add a callback to a stack. Default, to the main stack
	 *
	 * @param {String} namespace
	 * @param {Function} callback
	 * @param {String} stackName (default : djs.resize.stacks.main)
	 * @return {Object}
	 */
	bind: function (namespace, callback, stackName) {

		// Default value for stackName
		if (stackName == null) stackName = this.stacks.main;

		// Push the callback to the stack
		this._stacks[stackName].add(namespace, callback);

		// Return self
		return this;
	},
	/**
	 * Remove a callback to a stack. Default, from the main stack
	 *
	 * @param {String} namespace
	 * @param {String} stackName (default : djs.resize.stacks.main)
	 * @return {Object}
	 */
	unbind: function (namespace, stackName) {

		// Default value for stackName
		if (stackName == null) stackName = this.stacks.main;

		//Delete callback from the stack
		this._stacks[stackName].delete(namespace);

		// Return self
		return this;
	},


	/* ========================================================================
	 * 	METHODS
	 * ====================================================================== */
	/**
	 * Runs all the stacks.
	 * Subroutine of the resize event.
	 * Call this function to force refresh
	 *
	 * @return {Object}
	 */
	refresh: function () {

		// Add flag to body (for CSS use)
		this._$body.addClass(this.classes.resizing);

		// Run all stacks
		$.each(this.stacks, function (i, e) {
			this._stacks[e].run();
		}.bind(this));

		// Remove flag from body
		this._$body.removeClass(this.classes.resizing);

		// Return self
		return this;
	},

	/**
	 * Define the delay used to detect the end of the resize.
	 *
	 * @param {Integer} delay
	 * @return {Object}
	 */
	delay: function (delay) {
		this._delay = delay;
		return this;
	},

	/**
	 * Returns the main stack
	 *
	 * @return {Object}
	 */
	stack: function () {
		return this._stacks.main;
	}
};
