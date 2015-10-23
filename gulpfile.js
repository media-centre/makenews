var gulp   = require('gulp');
var parameters = require('./config/parameters')
var scss = require("gulp-scss");
var exec = require('gulp-exec');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var runSequence = require('run-sequence');
var path = require('path');
var Server = require('karma').Server;
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');

gulp.task("client:scss", function () {
    return gulp.src(parameters.client.scssSrcPath + "/**/*.scss")
          .pipe(scss({
            noCache: true,
            compass: false,
            bundleExec: true,
            sourcemap: false
          }))
          .pipe(concat(parameters.client.cssMainFile))
          .pipe(gulp.dest(parameters.client.distFolder));
});

gulp.task('client:javascript', function () {
  return browserify(parameters.client.srcPath +'/index.js', {debug: true})
        .transform(babelify)
        .bundle()
        .pipe(fs.createWriteStream(parameters.client.distFolder + '/' + parameters.client.appMainFile));
});

gulp.task('client:riot-tags', function() {
  return gulp.src(parameters.client.srcPath + "/**/*.tag")
      .pipe(riot())
      .pipe(concat(parameters.client.templatesFile))
      .pipe(gulp.dest(parameters.client.distFolder));
});

//only riot has to do this way. need to figure out later on how can we avoid copying.
gulp.task('client:copy_dependents', function() {
    gulp.src(parameters.client.clientAppPath + "/../node_modules/riot/riot+compiler.min.js")
        .pipe(gulp.dest(parameters.client.distFolder + "/riot"));

    return gulp.src(parameters.client.clientAppPath + "/../node_modules/riotgear-router/dist/rg-router.min.js")
        .pipe(gulp.dest(parameters.client.distFolder + "/riotgear-router"));

});

gulp.task('client:copy-index-html', function() {
    return gulp.src(parameters.client.clientAppPath + "/index.html")
    .pipe(gulp.dest(parameters.client.distFolder));
});

gulp.task('client:clean', function () {
    return gulp.src(parameters.client.distFolder, {read: false})
        .pipe(clean());
});

gulp.task('client:test', function (done) {
  new Server({
    configFile: __dirname + '/config/karma.conf.client.js',
    singleRun: true
  }, done).start();
});

gulp.task('client:build', function(callback) {
  runSequence('client:copy-index-html', 'client:copy_dependents', 'client:riot-tags', 'client:javascript', 'client:scss', callback);
});
// gulp.task('client:build', ['client:scss', 'client:javascript', 'client:riot-tags', 'client:copy-index-html']);



// -------------------------------server tasks -------------------------------------------
gulp.task('server:copy-js', function() {
    gulp.src(parameters.server.serverAppPath + "/**/*")
    .pipe(gulp.dest(parameters.server.distFolder));
});

gulp.task('server:clean', function () {
    gulp.src(parameters.server.distFolder, {read: false})
    .pipe(clean());

    gulp.src(parameters.server.distServerJsFolder + "/" + parameters.server.serverJsFile, {read: false})
        .pipe(clean());
});

gulp.task('server:test', function () {
  gulp.src(parameters.server.testPath + "**/*.js", {read: false})
    .pipe(exec('mocha --harmony -R spec server/test/', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    }));
});

gulp.task('server:build', ['server:copy-js']);

// -------------------------------common tasks -------------------------------------------

gulp.task('jshint', function() {
  gulp.src(parameters.client.clientAppPath + "/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));

  return gulp.src(parameters.server.serverAppPath + "/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', ['client:build', 'server:build']);
gulp.task('clean', ['client:clean', 'server:clean']);
gulp.task('test', ['client:test']);
