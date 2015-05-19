High level template plugin for webpack
--------------------------------------

The Simple Template webpack plugin is a high level class used to
render custom output. Custom template rendering can be configured in a
webpack configuration or extended for reuse. This plugin has a few
advantages over creating a webpack template from scratch.

- It's simple. No need to deeply understand webpack's templating system. Just provide a render function.
- High level [Bundle] collates data from a chunk and it's dependencies
- Plays nicely with webpack, so all outputs are part of the compilation
- Uses webpack asset path format to render output by name, id, hash, and contenthash

## Install

```sh
npm install -D simple-template-webpack-plugin
```

## Usage example to create output with Hogan.

```js
var Hogan = require('hogan.js');
var template = Hogan.comile(fs.readFileSync('./template.html'));
var TemplatePlugin = require('simple-template-webpack-plugin');

module.exports = {
	plugins: [
  	new TemplatePlugin('[name].html', {
      render: function (bundle, cb) {
        cb(template.render(bundle.chunk));
      };
    })
	]
}
```

Templates rendered in the configured output path. If my output path is
`./dist` then I would get the following output for each chunk.

```
./dist/foo.html
./dist/bar.html
./dist/common.html
```

## Extending the template

The template plugin works best when extended. The example above can easily be extended into a new template plugin.

```js
var Hogan = require('hogan.js');
var template = Hogan.comile(fs.readFileSync('./template.html'));
var TemplatePlugin = require('simple-template-webpack-plugin');

var FooPlugin = TemplatePlugin.extend(function (bundle, cb) {
  cb(template.render(bundle.chunk));
});

module.exports = FooPlugin;
```

Add new plugin to your webpack config

```js
module.exports = {
	plugins: [
  	new FooPlugin('[name].html')
	]
}
```

## TemplatePlugin

Base template class

### `new TemplatePlugin(filename: string, [options])`

* `filename` the filename of the result file. May contain `[name]`, `[id]` and `[hash]`.
  * `[name]` the name of the chunk
  * `[id]` the number of the chunk
  * `[hash]` a hash of the rendered chunk
* `options` (optional)
  * `event` the [plugin event](http://webpack.github.io/docs/plugins.html) to render on (default: `emit`)
  * `chunks` a list of chunks to render (default: render all chunks)
  * `render` the custom render function to use with this instance
  * `end` the custom end function to use with this instance

The `TemplatePlugin` generates an output file per entry, so you must
use `[name]`, `[id]` or `[hash]` when using multiple entries.

### `TemplatePlugin.extend([render], [defaults])`

Creates an extended `TemplatePlugin` class.

* `render` (optional) the custom render function to use with this class
* `defaults` (options) the default options for this class.
  * `event` the [plugin event](http://webpack.github.io/docs/plugins.html) to render on (default: `emit`)
  * `chunks` a list of chunks to render (default: render all chunks)
  * `render` the custom render function to use with this instance
  * `end` the custom end function to use with this instance

### `templatePlugin.render(bundle, callback)`

Function used to render a bundles contents. Should pass a String to
the callback of the rendered contents

* `bundle` Bundle of the current chunk
* `callback` Function that will receive a string of the rendered
  bundle.

### `templatePlugin.end(filename, source, callback)`

Function call before the final source is added to the compilation. Should pass a [Source](https://github.com/webpack/core/blob/master/lib/Source.js) instance to
the callback.

* `filename` file name of the source to be rendered
* `source` current instance of [Source](https://github.com/webpack/core/blob/master/lib/Source.js)
* `callback` Function that will receive the final source to be emitted
  by the webpack compilation

## Bundle

High level wrapper for the chunk to be rendered.

### `bundle.ids()`

Returns the list of chunk dependency indexes

### `bundle.sources([files], callback)`

Returns a list of chunk output files with their source.

* `files` (optional) list or string of specific chunk files to retrieve
* `callback` function to be called when the source files have been
  retrieved. The results will be a map of source name as the key and
  the value will be the source data and any errors that result when
  reading the data.

```js
bundle.sources(function (results) {
  console.log(results['foo.bundle.js']);
});
>> {
  err: null,
  data: 'module.exports = {};'
}
```

### `bundle.entry()`

Returns the main source entry for the chunk.

### `bundle.dependencies([ids])`

Returns a list of module dependencies included in the chunk

* `ids` (optional) list or index of the chunks to include (default:
  include the dependencies of the current chunk and it's common
  chunks)

### `bundle.files([ids])`

Returns a list of output files emitted by the chunk

* `ids` (optional) list or index of the chunks to include (default:
  include the output files of the current chunk and it's common
  chunks)
