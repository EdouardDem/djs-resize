/**
 * Log function
 *
 * @param function
 */
displayLog = function (text) {
	$('.results').prepend('<div>' + text + '</div>');
	console.log(text);
};
/**
 * Run the tests
 */
runTests = function () {

	// Init object
	djs.resize.init();

	// Set delay
	djs.resize.delay(500);

	// Add clallback to stack
	djs.resize.stack().add('cb-1', function() {
		displayLog('Callback 1');
	});


};
/**
 * Auto ruun test
 */
$(document).ready(function () {
	runTests();
});