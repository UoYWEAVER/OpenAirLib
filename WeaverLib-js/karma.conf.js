module.exports = function(config) {
  config.set({
    files: ['./src/weaverlib.js', {
      pattern: './test/**/*.spec.js',
      watched: false,
      included: true,
      served: true
    }],
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'test/**/*.js': ['webpack']
    },
    browsers: [
      'Firefox',
      'Chrome'
    ],
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'test/_coverage/'
    },
    frameworks: ['jasmine'],
    webpack: {
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            cacheDirectory: false,
            presets: ['es2015'],
            plugins: [
              'transform-runtime',
              ['__coverage__', { only: 'src/' }]
            ]
          }
        }]
      },
      devtool: '#inline-source-map',
      watch: true
    },
    webpackServer: {
      noInfo: true
    }
  });
};
