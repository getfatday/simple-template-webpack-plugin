module.exports = function (grunt, options) {
	return {
		files: [
			'Gruntfile.js',
			'grunt/*.js',
			'test/*.js',
			'lib/**/*.js'
		],
		options: {
			laxbreak: true,
			laxcomma: true,
			debug: true,
			globals: {
				console: true,
				define: true,
				require: true
			}
		}
	};
};
