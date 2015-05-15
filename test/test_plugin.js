var chai = require('chai');
var expect = chai.expect;
var Plugin = require('../lib/template');
var glob = require('glob');
var path = require('path');
var helper = require('./helper');
var wp = helper.wp;
var compilation = helper.compilation;
var compiler = helper.compiler;
var clean = helper.clean;

describe('With Template Plugin', function () {

  beforeEach(clean);

	it('should initialized with default options', function () {
		var p = new Plugin('foo.js');
		expect(p.name).to.equal('foo.js');
		expect(p.options).to.be.a('object');
	});
	it('should initialized with custom options', function () {
		var stats = {
			assets: false
		};
		var p = new Plugin('foo.js', {
			stats: stats
		});
		expect(p.options).to.be.a('object');
		expect(p.options.stats).to.be.a('object');
		expect(p.options.stats.assets).to.equal(false);
	});
  it('should run compilation', function (done) {
		var p = new Plugin('foo.js');
		p.run(compilation(), done);
	});
	it('should render a template', function (done) {
    wp(new Plugin('output.render.js', {
      render: function (bundle, cb) {
        cb(bundle.filename);
      }
    }), function (err, stats) {
      expect(!err).to.equal(true);
      glob('./test/fixtures/dist/*.render.js', { matchBase: true }, function (err, files) {
        expect(files.map(path.basename)).to.deep.equal([
          'output.render.js'
        ]);
        done();
      });
    });
  });
	it('should render templates with webpack path format', function (done) {
    wp(new Plugin('[name].render.js', {
      render: function (bundle, cb) {
        cb(bundle.filename);
      }
    }), function (err, stats) {
      expect(!err).to.equal(true);
      glob('./test/fixtures/dist/*.render.js', { matchBase: true }, function (err, files) {
        expect(files.map(path.basename)).to.deep.equal([
          'bar.render.js',
          'common.render.js',
          'foo.render.js'
        ]);
        done();
      });
    });
  });
	it('should render specified chunks', function (done) {
    wp(new Plugin('[name].render.js', {
      render: function (bundle, cb) {
        cb(bundle.filename);
      },
      chunks: ['foo']
    }), function (err, stats) {
      expect(!err).to.equal(true);
      glob('./test/fixtures/dist/*.render.js', { matchBase: true }, function (err, files) {
        expect(files.map(path.basename)).to.deep.equal([
          'foo.render.js'
        ]);
        done();
      });
    });
  });
	it('should extend the template class', function (done) {
    var Foo = Plugin.extend(function (bundle, cb) {
      cb(bundle.filename);
    }, { foo: 'bar' });

    var foo = new Foo('[name].render.js');
    expect(foo.options.foo).to.equal('bar');

    foo = new Foo('[name].render.js', { foo: 'boo'});
    expect(foo.options.foo).to.equal('boo');

    wp(foo, function (err, stats) {
      expect(!err).to.equal(true);
      glob('./test/fixtures/dist/*.render.js', { matchBase: true }, function (err, files) {
        expect(files.map(path.basename)).to.deep.equal([
          'bar.render.js',
          'common.render.js',
          'foo.render.js'
        ]);
        done();
      });
    });
  });
	it('should extend the template class with options only', function (done) {
    var Foo = Plugin.extend({
      render: function (bundle, cb) {
        cb(bundle.filename);
      },
      foo: 'bar'
    });

    wp(new Foo('[name].render.js'), function (err, stats) {
      expect(!err).to.equal(true);
      glob('./test/fixtures/dist/*.render.js', { matchBase: true }, function (err, files) {
        expect(files.map(path.basename)).to.deep.equal([
          'bar.render.js',
          'common.render.js',
          'foo.render.js'
        ]);
        done();
      });
    });
  });
	it('should extend the template class with contructor', function () {
    var Foo = Plugin.extend({
      constructor: function () {
        this.foo = 'bar';
      }
    });

    var foo = new Foo('[name].render.js');
    expect(foo.foo).to.equal('bar');
  });
});
