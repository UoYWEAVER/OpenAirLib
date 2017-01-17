# BBC / UoY Audio WeaverLib
The BBC Audio Toolkit -> WeaverLib; extends the [Web Audio API](http://webaudio.github.io/web-audio-api/) to provide a OpenAirLibNode and OpenAirLibInfo modules.

The library is divided into several modules: `core` contains promise-based file loaders; 'effects' contains the OpenAirLib client.

## Installation
Library modules (core, effects, ...) are made available on the `WeaverLib` base object. This object can be installed with npm (and required/imported) or by including the minified library in an HTML document, making the `WeaverLib` object available to subsequent scripts.

To install with the minified library:
```html
<script src="js/weaverlib.js"></script>
```


## Examples
These following examples assume the `WeaverLib` base object has been imported. The examples are ES6 compliant. Full documentation of the library with examples can be found in */doc/index.html*.

Load and decode multiple audio files asynchronously:

```javascript
const context = new AudioContext();
const audioLoader = new WeaverLib.core.AudioLoader(context);

audioLoader.load([
  'url/to/audio/1.m4a',
  'url/to/audio/2.m4a'
]).then((decodedAudioArray) => {
  // Use the decoded audio (decodedAudioArray[0], decodedAudioArray[1])
}).catch((error) => {
  console.log(error);
});;
```

## Development
This library is written in modular [ES6](http://es6-features.org/) and uses [npm](https://www.npmjs.com/) for dependency management.

Build (lint, test, generate documentation, and package) the library:
```
npm run build
```

In order to aid development, the library can be hosted locally (at `localhost:8080`) and automatically re-packaged whenever a source file is changed:
```
npm start
```

### Code Style and Linting
Code is written in ES6 and is styled following the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). Furthermore, [ESLint](http://eslint.org/) is used to lint all code, ensuring it meets these guidelines.

Linting can be run with `npm run lint`. Linting is also performed as part of the build process.

###  Library Structure and Tests
The source ES6 files are located in the */src* directory. Modules (core, effects, ...) are grouped within directories of the same name. Each module contains an *_index.js* file that exports public classes. The indexes are then exported on the global `WeaverLib` object in *weaverlib.js*.

Tests are written using the [jasmine](https://github.com/jasmine/jasmine) testing framework. Tests are located in the */test* directory within subdirectories mirroring those of */src*. For example, the tests covering */src/core/event-target.js* are */test/core/event-target.spec.js*. Tests output HTML coverage reports to the */test/_coverage* directory on completion.

Tests can be run once with `npm run test` or run whenever a covered file changes with `npm run watch:test`. Tests are also run as part of the build process.

### Documentation
All classes, constructors, methods and properties are documented in-place with block comments in [ESDoc](https://esdoc.org/) format. HTML API documentation is generated from these comments to the */doc* directory.

Documentation can be generated or updated with `npm run doc`. Documentation is also generated as part of the build process.

### Packaging
The entry point for the build process is the */src/weaverlib.js* file. The entry point and referenced files are packaged with [webpack](https://webpack.github.io/) and transpiled with [Babel](https://babeljs.io/) to ES5 compliant code. The packaged library is output at */dist/weaverlib.js*.

The library can be packaged with `npm run webpack`. The library is also packaged as part of the build process.
