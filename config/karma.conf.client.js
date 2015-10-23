
module.exports = function(config) {
  config.set({
    basePath: '../client',
    frameworks: ['mocha', 'chai', 'browserify', 'sinon'],
    files: [
      '../node_modules/riot/riot+compiler.min.js',
      'src/js/**/*.js',
      'test/**/*.js',
      'src/js/**/*.tag'
    ],
    exclude: [
    ],
    preprocessors: {
        "test/**/*.js": "browserify",
        "src/js/**/*.js": "browserify",
        "src/js/**/*.tag": "browserify"
    },
    browserify: {
        debug: true,
        transform: [
          ['babelify', {plugins: ['babel-plugin-espower']}],
          ['riotify']
        ]
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
