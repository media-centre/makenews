
module.exports = function(config) {
  config.set({
    basePath: '../server',
    frameworks: ['mocha', 'chai', 'browserify'],
    files: [
      'src/js/**/*.js',
      'test/**/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'src/js/**/*.js' : "browserify",
      'test/**/*.js' : "browserify"
    },
    browserify: {
        debug: true,
        transform: [
          ['babelify', {plugins: ['babel-plugin-espower']}]
        ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    // web server port
    port: 9875,
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
