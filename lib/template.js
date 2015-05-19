var _ = require('lodash');
var Bundle = require('./bundle');
var ConcatSource = require("webpack/lib/ConcatSource");
var util = require('util');

var TemplatePlugin = function(name, options) {
  this.options = _.extend({}, this.constructor.DEFAULTS, options);
  this.name = name;
};

TemplatePlugin.DEFAULTS = {
  event: 'emit',
  chunks: false
};

// Extend plugin
TemplatePlugin.extend = function (render, defaults) {
  if (typeof render === 'object') {
    defaults = render;
    render = false;
  }
  var P = this;
  var C = function () {
    P.apply(this, arguments);
    if (this.options.constructor) {
      this.options.constructor.apply(this, arguments);
    }
  };
  util.inherits(C, P);
  C.DEFAULTS = _.extend({}, P.DEFAULTS, defaults);
  if (render) C.prototype.render = render;
  return C;
};

// Default render method does nothing. Should override or specify in
// in options
TemplatePlugin.prototype.render = function (bundle, cb) { cb(); };

// Default end method does nothing. Should override or specify in in
// options
TemplatePlugin.prototype.end = function (filename, sources, cb) { cb(sources); };

// Starts rendering for a given compilation
TemplatePlugin.prototype.run = function (compilation, done) {
  var self = this;
  var sources = {};
  var chunks = compilation.chunks.slice().filter(function (chunk) {
    return self.options.chunks
         ? self.options.chunks.indexOf(chunk.name) !== -1
         : true;
  });
  var count = chunks.length;
  if (count === 0) {
    done();
    return;
  }
  var render = this.options.render || this.render;
  var end = this.options.end || this.end;
  chunks.forEach(function (chunk) {

    var bundle = new Bundle(self.name, compilation, chunk);
    render.call(self, bundle, function (output) {

      var source = sources[bundle.filename] || new ConcatSource();
      if (output) source.add(output);
      sources[bundle.filename] = source;

      count--;
      if (count === 0) {
        var keys = Object.keys(sources);
        var length = keys.length;
        if (length === 0) {
          done();
          return;
        }
        keys.forEach(function (filename) {
          end.call(self, filename, sources[filename], function (source) {
            compilation.assets[filename] = source;
            length--;
            if (length === 0) done();
          });
        });
      }
    });
  });
};

TemplatePlugin.prototype.apply = function(compiler) {
  compiler.plugin(this.options.event, _.bind(this.run, this));
};

module.exports = TemplatePlugin;
