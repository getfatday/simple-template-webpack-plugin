var config = require('./fixtures/webpack.config');
var plugins = config.plugins.slice();
var webpack = require('webpack');
var rimraf = require('rimraf');

var wp = function (plugin, cb) {
	config.plugins = plugins.slice().concat(plugin);
	return webpack(config, cb);
};

var run = function (cb) {
  return webpack(config, cb);
};

var compilation = function (toJson) {
	return {
    chunks: [],
		getStats: function () {
			return {
				toJson: toJson || function (options) {
					return {};
				}
			};
		}
	};
};

var compiler = function (compilation, cb) {
	return {
		plugin: function (event, fn) {
			fn(compilation, cb);
		}
	};
};

var clean = function (done) {
  rimraf('./test/fixtures/dist', done);
};

module.exports = {
  wp: wp,
  run: run,
  clean: clean,
  compilation: compilation,
  compiler: compiler
};
