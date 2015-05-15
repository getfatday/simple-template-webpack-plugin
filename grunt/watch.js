module.exports = function (grunt, options) {
	return {
		files: [
			'Gruntfile.js',
			'grunt/*',
			'test/*',
			'index.js'
		],
		tasks: ['build']
	};
};
