var parameters = require('./config/parameters');

var gulp   = require('gulp');
var sass = require("gulp-sass");
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var runSequence = require('run-sequence');
var path = require('path');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
require('babel/register');

gulp.task("client:scss", function () {
    return gulp.src(parameters.client.scssSrcPath + "/**/*.scss")
          .pipe(sass())
          .pipe(concat(parameters.client.cssMainFile))
          .pipe(gulp.dest(parameters.client.distFolder));
});

gulp.task("client:images", function () {
    return gulp.src(parameters.client.imgSrcPath + "/**/*.*")
          .pipe(gulp.dest(parameters.client.distFolder + "/images"));
});

gulp.task('client:build-sources', function () {
  return browserify(parameters.client.srcPath +'/index.jsx', {debug: true})
        .transform(babelify)
        .bundle()
        .pipe(fs.createWriteStream(parameters.client.distFolder + '/' + parameters.client.appMainFile));
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
  return gulp.src([parameters.client.testPath + "**/*.jsx", parameters.client.testPath + "**/*.js"], {read: false})
    .pipe(mocha());
});

gulp.task('client:build', function(callback) {
  runSequence('client:clean', 'client:copy-index-html', 'client:build-sources', 'client:scss', 'client:images', callback);
});
// gulp.task('client:build', ['client:scss', 'client:javascript', 'client:riot-tags', 'client:copy-index-html']);

gulp.task('client:watch', function() {
    gulp.watch(parameters.client.scssSrcPath + "/**/*.scss", ['client:scss']);
    gulp.watch(parameters.client.imgSrcPath + "/**/*.*", ['client:images']);
    gulp.watch(parameters.client.srcPath + '/**/*.js', ['client:javascript', 'client:test', 'jshint']);
    gulp.watch(parameters.client.testPath +'/**/*.js', ['client:test', 'jshint']);
    gulp.watch(parameters.client.clientAppPath + "/index.html", ['client:copy-index-html']);
});



// -------------------------------server tasks -------------------------------------------
gulp.task('server:copy-js', ['server:clean'], function() {
    gulp.src(parameters.server.serverAppPath + "/src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest(parameters.server.distFolder + "/src"));

    gulp.src("./" + parameters.server.serverJsFile)
    .pipe(babel())
    .pipe(gulp.dest(parameters.server.distServerJsFolder));

});

gulp.task('server:clean', function () {
    gulp.src(parameters.server.distFolder, {read: false})
    .pipe(clean());

    gulp.src(parameters.server.distServerJsFolder + "/" + parameters.server.serverJsFile, {read: false})
        .pipe(clean());
});

gulp.task('server:test', function () {
  return gulp.src(parameters.server.testPath + "**/*.js", {read: false})
    .pipe(mocha());
});

gulp.task('server:build', ['server:copy-js']);

gulp.task('server:watch', function() {
    gulp.watch(parameters.server.srcPath + '/**/*.js', ['server:test', 'jshint', 'server:copy-js']);
    gulp.watch(parameters.server.serverJsFile, ['server:test', 'jshint', 'server:copy-js']);
    gulp.watch(parameters.server.testPath +'/**/*.js', ['server:test', 'jshint']);
});

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
gulp.task('test', ['client:test', 'server:test']);
gulp.task('watch', ['client:watch', 'server:watch']);
