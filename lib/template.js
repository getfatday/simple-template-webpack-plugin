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

// Starts rendering for a given compilation
TemplatePlugin.prototype.run = function (compilation, done) {
  var self = this;
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
  chunks.forEach(function (chunk) {

    var bundle = new Bundle(self.name, compilation, chunk);
    render.call(self, bundle, function (output) {
      if (output) {
        var source = compilation.assets[bundle.filename] || new ConcatSource();
        source.add(output);
        compilation.assets[bundle.filename] = source;
      }
      count--;
      if (count === 0) done();
    });
  });
};

TemplatePlugin.prototype.apply = function(compiler) {
  compiler.plugin(this.options.event, _.bind(this.run, this));
};

module.exports = TemplatePlugin;
