var chai = require('chai');
var expect = chai.expect;
var Bundle = require('../lib/bundle');
var helper = require('./helper');
var path = require('path');
var run = helper.run;
var clean = helper.clean;
var stats;
var chunk;

describe('With a Bundle', function () {

  before(function (done) {
    clean(function () {
      run(function (err, s) {
        stats = s;
        chunk = stats.compilation.chunks.filter(function (chunk) {
          return chunk.name === 'foo';
        }).shift();
        done();
      });
    });
  });

  after(clean);

	it('should initialized with arguments', function () {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    expect(bundle.name).to.equal('[name].render.js');
    expect(bundle.compilation).to.equal(stats.compilation);
    expect(bundle.chunk).to.equal(chunk);
    expect(bundle.filename).to.equal('foo.render.js');
	});
	it('should list chunk ids', function () {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    var ids = bundle.ids();
    expect(ids.length).to.deep.equal(2);
    expect(ids.indexOf(bundle.chunk.id)).to.not.equal(-1);
	});
	it('should list chunk entry file', function () {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    expect(path.basename(bundle.entry())).to.equal('foo.js');
	});
	it('should list chunk dependencies', function () {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    expect(bundle.dependencies().map(path.basename).sort())
    .to.deep.equal([
      'foo.js',
      'foo.less',
      'foo.mustache',
      'hogan.js',
      'compiler.js',
      'template.js'
    ].sort());
	});
	it('should list files', function () {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    expect(bundle.files().map(path.basename).sort())
    .to.deep.equal([
      'common.bundle.js',
      'common.bundle.js.map',
      'foo.bundle.js',
      'foo.bundle.css',
      'foo.bundle.js.map',
      'foo.bundle.css.map'
    ].sort());
	});
	it('should list files per chunk index', function () {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    expect(bundle.files(2).map(path.basename).sort())
    .to.deep.equal([
      'common.bundle.js',
      'common.bundle.js.map'
    ].sort());
	});
	it('should list file sources', function (done) {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    bundle.sources(function (results) {
      var keys = Object.keys(results).sort();
      expect(keys)
      .to.deep.equal([
        'common.bundle.js',
        'common.bundle.js.map',
        'foo.bundle.js',
        'foo.bundle.css',
        'foo.bundle.js.map',
        'foo.bundle.css.map'
      ].sort());
      keys.forEach(function (key) {
        var result = results[key];
        expect(!result.error).to.equal(true);
        expect(result.data).to.be.a('string');
      });
      done();
    });
	});
	it('should list specific file sources', function (done) {
    var bundle = new Bundle('[name].render.js', stats.compilation, chunk);
    bundle.sources(bundle.files(2), function (results) {
      var keys = Object.keys(results).sort();
      expect(keys)
      .to.deep.equal([
        'common.bundle.js',
        'common.bundle.js.map'
      ].sort());
      done();
    });
	});
});
