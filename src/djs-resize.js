/**
 * @author Edouard Demotes-Mainard <https://github.com/EdouardDem>
 * @license http://opensource.org/licenses/BSD-2-Clause BSD 2-Clause License
 */

/**
 * Object djs for namespace
 */
window.djs = window.djs || {};

/**
 * Cette classe permet de gérer les redimensionnement de la fenêtre
 * Elle permet d'avoir un temps latence pour détecter la fin du redimensionnement
 * Elle gère également l'ordre des appels via la classe callStack
 * La pile d'appels se gère via la propriété stack
 *
 * @requires djs.CallStack <https://github.com/EdouardDem/djs-call-stack>
 */
djs.resize = {

    /*
	 * Properties
	 */
    delay: 0, //Time to resize
    classes: {
        resizing: 'resizing',
    },
    stacks: {
        core: 'core',
        main: 'main',
        last: 'last',
    },
	namespace: 'reisze',
	initialized: false,
	$window: null,
	$body: null,
    _stacks: {},
    stack: null, //shortcut to _stacks.main
    timeout: null,

	//--------------------------------------------------------------------------
	//	INITIALIZATION
	//--------------------------------------------------------------------------
	/**
	 * Initialise la classe
	 *
	 * @return {Object}
	 */
	init: function() {
		//Check
		if (this.initialized) return this;
		//Elements constant
		this.$window = $(window);
		this.$body = $('body');
        $.each(this.stacks, function(i,e) {
            this._stacks[e] = new djs.CallStack();
        }.bind(this));
        this.stack = this._stacks.main;
		//Bind les events
        this.$window.bind('resize.'+this.namespace, function() {
			if (this.initialized) {
                //If delay
                if (this.delay>0) {
                    //Clear timeout
                    clearTimeout(this.timeout);
                    //Set new timeout
                    this.timeout = setTimeout(function () {
                        this.refresh();
                    }.bind(this), this.delay);
                } else {
                    this.refresh();
                }
            }
		}.bind(this));
		//Flag
		this.initialized = true;

		return this;
	},
	/**
	 * Désinitialise la classe
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

	//--------------------------------------------------------------------------
	//	BINDING
	//--------------------------------------------------------------------------
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

	//--------------------------------------------------------------------------
	//	METHODS
	//--------------------------------------------------------------------------

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
	},
};
