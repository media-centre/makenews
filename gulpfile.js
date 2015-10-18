var gulp   = require('gulp');
var parameters = require('./config/parameters')
var scss = require("gulp-scss");
var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var runSequence = require('run-sequence');
var path = require('path');
var Server = require('karma').Server;

gulp.task("client:scss", function () {
    return gulp.src(parameters.client.scss_src_path + "/**/*.scss")
          .pipe(scss({
            noCache: true,
            compass: false,
            bundleExec: true,
            sourcemap: false
          }))
          .pipe(concat(parameters.client.css_main_file))
          .pipe(gulp.dest(parameters.client.dist_folder));
});

gulp.task('client:javascript', function () {
  return browserify(parameters.client.src_path +'/index.js', {debug: true})
        .transform(babelify)
        .bundle()
        .pipe(fs.createWriteStream(parameters.client.dist_folder + '/' + parameters.client.app_main_file));
});

gulp.task('client:riot-tags', function() {
  return gulp.src(parameters.client.src_path + "/**/*.tag")
      .pipe(riot())
      .pipe(concat(parameters.client.templates_file))
      .pipe(gulp.dest(parameters.client.dist_folder));
});

//only riot has to do this way. need to figure out later on how can we avoid copying.
gulp.task('client:copy_dependents', function() {
    return gulp.src(parameters.client.client_app_path + "/../node_modules/riot/riot.min.js")
        .pipe(gulp.dest(parameters.client.dist_folder + "/riot"));

});

gulp.task('client:copy-index-html', function() {
    return gulp.src(parameters.client.client_app_path + "/src/index.html")
    .pipe(gulp.dest(parameters.client.dist_folder));
});

gulp.task('client:clean', function () {
    return gulp.src(parameters.client.dist_folder, {read: false})
        .pipe(clean());
});

gulp.task('client:test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.client.js',
    singleRun: true
  }, done).start();
});

gulp.task('client:build', function(callback) {
  runSequence('client:copy-index-html', 'client:copy_dependents', 'client:riot-tags', 'client:javascript', 'client:scss', callback);
});
// gulp.task('client:build', ['client:scss', 'client:javascript', 'client:riot-tags', 'client:copy-index-html']);



// -------------------------------server tasks -------------------------------------------
gulp.task('server:copy-js', function() {
    gulp.src(parameters.server.server_app_path + "/src/**/*.js")
    .pipe(gulp.dest(parameters.server.dist_folder));

    gulp.src(parameters.server.server_app_path + "/src/" + parameters.server.server_js_file)
    .pipe(gulp.dest(parameters.server.dist_server_js_folder));
});

gulp.task('server:clean', function () {
    gulp.src(parameters.server.dist_folder, {read: false})
    .pipe(clean());

    gulp.src(parameters.server.dist_server_js_folder + "/" + parameters.server.server_js_file, {read: false})
        .pipe(clean());
});

gulp.task('server:build', ['server:copy-js']);

// -------------------------------common tasks -------------------------------------------
gulp.task('build', ['client:build', 'server:build']);
gulp.task('clean', ['client:clean', 'server:clean']);
