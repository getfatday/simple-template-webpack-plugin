module.exports = function (grunt, options) {
	'use strict';
	return {
		test: {
			options: {
				reporter: 'spec',
				timeout: 4000
			},
			src: ['test/**/test_*.js']
		}
	};
};
