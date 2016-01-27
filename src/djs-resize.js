/**
 * @author Edouard Demotes-Mainard <https://github.com/EdouardDem>
 * @license http://opensource.org/licenses/BSD-2-Clause BSD 2-Clause License
 */

/**
 * Object djs for namespace
 */
window.djs = window.djs || {};

/**
 * This object manages window's resizing.
 * It allows to have a delay to detect the end of the resizing.
 * It also allows to manage callbacks order through the class djs.Callstack
 *
 * @see https://github.com/EdouardDem/djs-resize
 * @requires djs.CallStack <https://github.com/EdouardDem/djs-call-stack>
 */
djs.resize = {

	/* =========================================================================
	 * 	PROPERTIES
	 * ====================================================================== */
	/**
	 * Delay used to detect the end of the resize.
	 * For example, if we define delay = 100, then if a resize starts and no resize's event is recorded for 100ms,
	 * we will consider the resizing is done and run the callbacks.
	 * To disables this feature, delay should be set to 0.
	 *
	 * @var {Integer}
	 */
    delay: 0,

	/**
	 * CSS classes used to tag the body while processing
	 *
	 * @var {Object}
	 */
    classes: {
        resizing: 'resizing'
    },

	/**
	 * Names and order of the call stacks used by this object
	 *
	 * @var {Object}
	 */
    stacks: {
        core: 'core',
        main: 'main',
        last: 'last'
    },

	/**
	 * Namespace used to bind events
	 *
	 * @var {String}
	 */
	namespace: 'djs-resize',

	/**
	 * Flag used to determine if the object is initialized
	 *
	 * @var {Boolean}
	 */
	initialized: false,

	/**
	 * The jQuery window object
	 *
	 * @var {Object}
	 */
	$window: null,

	/**
	 * The jQuery body object
	 *
	 * @var {Object}
	 */
	$body: null,

	/**
	 * Object containing the instances of djs.Callstack
	 *
	 * @var {Object}
	 */
    _stacks: {},

	/**
	 * Shortcut to _stack.main
	 *
	 * @var {Object}
	 */
    stack: null,

	/**
	 * Object used to get inactivity delay
	 *
	 * @var {Object}
	 */
    timeout: null,




	/* =========================================================================
	 * 	INITIALIZATION
	 * ====================================================================== */
	/**
	 * Initialize the object
	 *
	 * @return {Object}
	 */
	init: function() {

		// Check if already initialized
		if (this.initialized) return this;

		// Objects
		this.$window = $(window);
		this.$body = $('body');

		// Initialize the call stacks
		$.each(this.stacks, function(i,e) {
            this._stacks[e] = new djs.CallStack();
        }.bind(this));

		// Short cut to the main stack
        this.stack = this._stacks.main;

		// Bind the resize event
        this.$window.bind('resize.'+this.namespace, function() {

			// Check if initialized
			if (this.initialized) {

                // If a delay is defined, we set a timeout to trigger call stacks
                if (this.delay>0) {

                    // Clear timeout of previous resize's event
                    clearTimeout(this.timeout);

                    // Set new timeout
                    this.timeout = setTimeout(function () {

						// Call the refresh
                        this.refresh();

                    }.bind(this), this.delay);

                }

				// If no delay, just call the refresh function
				else {
                    this.refresh();
                }

            }

		}.bind(this));

		// Set the flag to prevent another initialization
		this.initialized = true;

		// Return self
		return this;
	},

	/**
	 * Destroy the object
 	 *
	 * @return {Object}
	 */
    uninit: function() {
		//Check
		if (!this.initialized) return this;
		//Unbind les events
		this.$window.unbind('resize.'+this.namespace);
        this.stack = null;
        this._stacks = {};
		//Flag
		this.initialized = false;

 		return this;
   	},
	/**
	 * Réinitialise la classe
 	 *
	 * @return {Object}
	 */
    reinit: function() {
		return this.uninit().init();
   	},



	/* =========================================================================
	 * 	BINDING
	 * ====================================================================== */
	/**
	 * Ajoute une function à la pile
	 *
     * @param {String} namespace
     * @param {Function} callback
     * @param {String} stackName
	 * @return {Object}
	 */
	bind: function(namespace, callback, stackName) {
        //Default
        if (stackName==null) stackName = this.stacks.main;
        //add
		this._stacks[stackName].add(namespace, callback);
		return this;
	},
	/**
	 * Supprime une function de la pile
 	 *
     * @param {String} namespace
     * @param {String} stackName
	 * @return {Object}
	 */
    unbind: function(namespace, stackName) {
        //Default
        if (stackName==null) stackName = this.stacks.main;
        //Delete
		this._stacks[stackName].delete(namespace);
 		return this;
    },



	/* =========================================================================
	 * 	METHODS
	 * ====================================================================== */

	/**
	 * Execute les piles
 	 *
	 * @return {Object}
	 */
	refresh: function() {
        //Body class
        this.$body.addClass(this.classes.resizing);
        //Run all stacks
        $.each(this.stacks, function(i,e) {
            this._stacks[e].run();
        }.bind(this));
        //Body class
        this.$body.removeClass(this.classes.resizing);

        return this;
	}
};
