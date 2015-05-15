var _ = require('lodash');
var path = require('path');
var fs = require('fs');

function Bundle(name, compilation, chunk) {
  this.name = name;
  this.filename = compilation.getPath(name, { chunk: chunk });
  this.compilation = compilation;
  this.chunk = chunk;
}

Bundle.prototype.ids = function () {
  return this.chunk.ids.slice().reverse();
};

Bundle.prototype.sources = function (files, cb) {
  if (typeof files === 'function') {
    cb = files;
    files = null;
  }
  files = files || this.files();
  if (!(files instanceof Array)) files = [files];
  var compilation = this.compilation;
  var count = files.length;
  var results = {};
  files.forEach(function (f) {

    if (results.hasOwnProperty(f)) return;
    results[f] = true;

    var fp = path.join(compilation.options.output.path, f);
    fs.readFile(fp, function (err, data) {
      results[f] = {
        error: err,
        data: (data) ? data.toString() : data
      };
      count--;
      if (count === 0) cb(results);
    });
  });
};

Bundle.prototype.entry = function () {
  return this.chunk.modules[0].resource;
};

Bundle.prototype.dependencies = function (ids) {
  ids = ids || this.ids();
  if (!(ids instanceof Array)) ids = [ids];
  var compilation = this.compilation;
  var paths = {};
  var modules = [];
  ids.forEach(function (index) {
    modules = modules.concat(compilation.chunks[index].modules.slice());
  });
  return _.uniq(modules.map(function (m) {
    return m.resource;
  }));
};

Bundle.prototype.files = function (ids) {
  ids = ids || this.ids();
  if (!(ids instanceof Array)) ids = [ids];
  var compilation = this.compilation;
  var files = [];
  ids.forEach(function (index) {
    files = files.concat(compilation.chunks[index].files.slice());
  });
  return files;
};

module.exports = Bundle;
