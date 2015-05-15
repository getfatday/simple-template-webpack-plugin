module.exports = function(grunt) {
	'use strict';
	var options = {
		data: {
			pkg: grunt.file.readJSON('package.json')
		},
		init: true,
		jitGrunt: true
	};
	require('load-grunt-config')(grunt, options);
};
