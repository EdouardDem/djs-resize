/**
 * Log function
 *
 * @param function
 */
displayLog = function (text) {
	$('.results').append('<div>' + text + '</div>');
	console.log(text);
};
/**
 * Run the tests
 */
runTests = function () {

	// Set delay
	djs.resize.delay(200);

	// Init object
	djs.resize.init();


};
/**
 * Auto ruun test
 */
$(document).ready(function () {
	runTests();
});