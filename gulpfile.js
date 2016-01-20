/*eslint no-console:0, no-path-concat:0 */
"use strict";
var parameters = require("./config/parameters");
var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");
var babelify = require("babelify"); //eslint-disable-line
var runSequence = require("run-sequence");
var babel = require("gulp-babel");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");
var exec = require("child_process").exec;
var replace = require("gulp-replace");
var argv = require("yargs").argv;
var rename = require("gulp-rename");
var del = require("del");
var cordova = require("cordova-lib").cordova.raw;
var minify = require("gulp-minify");
var cssnano = require("gulp-cssnano");
require("babel/register");


gulp.task("mobile:remove-directory", function(cb) {
    del(["." + parameters.mobile.mobilePath], function() {
        cb();
    });
});

gulp.task("mobile:init", ["mobile:remove-directory"], function(cb) {
    process.chdir(__dirname + "/dist/");
    exec("cordova create mobile com.mediaCenter.android MediaCenter", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        process.chdir("../");
        cb(err);
    });
});

gulp.task("mobile:create", ["mobile:init"], function(cb) {
    process.chdir(__dirname + parameters.mobile.mobilePath);
    exec("cordova platform add android ", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task("mobile:clean-files", function(cb) {
    del([parameters.mobile.cordovaPath + "/*"], function() {
        cb();
    });
});

gulp.task("mobile:copy-files", ["mobile:clean-files"], function() {
    return gulp.src([parameters.mobile.appPath + "/**/*"])
    .pipe(gulp.dest(parameters.mobile.cordovaPath));
});

gulp.task("mobile:build", ["mobile:copy-files"], function(cb) {
    process.chdir(__dirname + parameters.mobile.mobilePath);
    cordova
    .build()
    .then(function() {
        process.chdir("../");
        cb();
    });
});

gulp.task("mobile:emulate", function(cb) {
    process.chdir(__dirname + parameters.mobile.mobilePath);
    cordova
    .run({ "platforms": ["android"] })
    .then(function() {
        process.chdir("../");
        cb();
    });
});


gulp.task("client:scss", function() {
    return gulp.src([parameters.client.scssSrcPath + "/**/*.scss"])
          .pipe(sass())
          .pipe(concat(parameters.client.cssMainFile))
          .pipe(cssnano())
          .pipe(gulp.dest(parameters.client.distFolder));
});


gulp.task("client:images", function() {
    return gulp.src(parameters.client.imgSrcPath + "/**/*.*")
          .pipe(gulp.dest(parameters.client.distFolder + "/images"));
});

gulp.task("client:build-sources", function() {
    let clientEnvironment = argv.client_environment || "development";

    gulp.src(parameters.client.srcPath + "/index.jsx")
        .pipe(browserify({
            "debug": true,
            "transform": ["babelify"]
        }))
        .pipe(replace("__CONTENT_DISCOVERY_ENVIRONMENT__", clientEnvironment))
        .pipe(rename("app.js"))
        .pipe(minify())
        .pipe(gulp.dest(parameters.client.distFolder));
});


gulp.task("client:copy-resources", function() {
    gulp.src(parameters.client.clientAppPath + "/index.html")
    .pipe(gulp.dest(parameters.client.distFolder));

    gulp.src(parameters.client.imgSrcPath + "/**/*.*")
        .pipe(gulp.dest(parameters.client.distFolder + "/images"));

    return gulp.src(parameters.client.fontsPath + "/**/*.*")
        .pipe(gulp.dest(parameters.client.distFolder + "/fonts"));
});

gulp.task("client:clean", function() {
    del(parameters.client.distFolder);
});

gulp.task("client:test", function() {
    return gulp.src([parameters.client.testPath + "**/**/*.jsx", parameters.client.testPath + "**/**/*.js"], { "read": false })
    .pipe(mocha());
});

gulp.task("client:build", function(callback) {
    runSequence("client:copy-resources", "client:build-sources", "client:scss", callback);
});

// gulp.task("client:build", ["client:scss", "client:javascript", "client:riot-tags", "client:copy-index-html"]);

gulp.task("client:watch", function() {
    this.cssFilesPath = parameters.client.scssSrcPath + "/**/*.scss";
    this.copyFilesPath = [parameters.client.imgSrcPath + "/**/*.*", parameters.client.fontsPath + "/**/*.*"];
    this.jsFilesPath = parameters.client.srcPath + "/**/*.{js,jsx}";
    this.testJsFilesPath = parameters.client.testPath + "/**/*.js";
    this.appPath = parameters.client.clientAppPath + "/index.html";
    gulp.watch(this.cssFilesPath, ["client:scss"]);
    gulp.watch(this.copyFilesPath, ["client:copy-resources"]);
    gulp.watch(this.jsFilesPath, ["client:build-sources"]);
    gulp.watch(this.testJsFilesPath, ["client:test"]);
    gulp.watch(this.appPath, ["client:copy-resources"]);
});

gulp.task("client:src-eslint", function() {
    return gulp.src([parameters.client.srcPath + "/**/*.jsx", parameters.client.srcPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("client:test-eslint", function() {
    return gulp.src([parameters.client.testPath + "/**/*.jsx", parameters.client.testPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("client:eslint", ["client:src-eslint", "client:test-eslint"]);
gulp.task("client:checkin-ready", ["client:eslint", "client:test"]);

gulp.task("client:test-coverage", (cb) => {
    exec("./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --compilers js:babel/register -R spec " + parameters.client.testPath + "/**/**/**/*.jsx  " + parameters.client.testPath + "/**/**/**/*.js", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

//-------------------------------- functional tests --------------------------------------

gulp.task("functional:eslint", function() {
    return gulp.src([parameters.functional.serverSpecPath + "/**/*.js", parameters.functional.testServerPath + "/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("functional:test", function() {
    return gulp.src(parameters.functional.serverSpecPath + "**/**/*.js", { "read": false })
        .pipe(mocha({ "timeout": 3000 }));
});

// -------------------------------common tasks -------------------------------------------
gulp.task("common:copy-js", function() {
    gulp.src(parameters.common.srcPath + "/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest(parameters.common.distFolder + "/src"));
});

gulp.task("common:test", function() {
    return gulp.src(parameters.common.testPath + "/**/**/*.js", { "read": false })
        .pipe(mocha());
});

gulp.task("common:src-eslint", function() {
    return gulp.src([parameters.common.srcPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("common:test-eslint", function() {
    return gulp.src([parameters.common.testPath + "**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("common:build", ["common:copy-js"]);
gulp.task("common:clean", function() {
    del(parameters.common.distFolder);
});

gulp.task("common:eslint", ["common:src-eslint", "common:test-eslint"]);
gulp.task("common:checkin-ready", ["common:eslint", "common:test"]);

gulp.task("common:test-coverage", (cb) => {
    exec("./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --compilers js:babel/register -R spec " + parameters.common.testPath + "/**/**/**/*.js", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// -------------------------------server tasks -------------------------------------------
gulp.task("server:copy-js", function() {
    gulp.src([parameters.server.serverAppPath + "/src/**/*.js"])
    .pipe(babel())
    .pipe(gulp.dest(parameters.server.distFolder + "/src"));

    gulp.src(parameters.server.serverAppPath + "/config/**/*.json")
        .pipe(gulp.dest(parameters.server.distFolder + "/config"));

    gulp.src(parameters.server.serverAppPath + "/src/**/*.json")
        .pipe(gulp.dest(parameters.server.distFolder + "/src"));

    gulp.src("./" + parameters.server.serverJsFile)
    .pipe(babel())
    .pipe(gulp.dest(parameters.server.distServerJsFolder));

    gulp.src("./" + parameters.server.packageJsonFile)
    .pipe(gulp.dest(parameters.server.distServerJsFolder));

});

gulp.task("server:clean", function() {
    del(parameters.server.distFolder);
    del(parameters.server.distServerJsFolder + "/" + parameters.server.serverJsFile);
});

gulp.task("server:test", function() {
    return gulp.src(parameters.server.testPath + "**/**/*.js", { "read": false })
    .pipe(mocha({ "timeout": 3000 }));
});

gulp.task("server:build", ["server:copy-js"]);

gulp.task("server:watch", function() {
    this.srcPath = parameters.server.srcPath + "/**/*.js";
    this.serverJSFilePath = parameters.server.serverJsFile;
    this.testPath = parameters.server.testPath + "/**/*.js";
    gulp.watch(this.srcPath, ["server:src-eslint", "server:copy-js"]);
    gulp.watch(this.serverJSFilePath, ["server:src-eslint", "server:copy-js"]);
    gulp.watch(this.testPath, ["server:test", "server:test-eslint"]);
});

gulp.task("server:src-eslint", function() {
    return gulp.src([parameters.server.srcPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("server:test-eslint", function() {
    return gulp.src([parameters.server.testPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("server:eslint", ["server:src-eslint", "server:test-eslint"]);
gulp.task("server:checkin-ready", ["server:eslint", "server:test"]);
gulp.task("server:test-coverage", (cb) => {
    exec("./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --compilers js:babel/register -R spec " + parameters.server.testPath + "/**/**/**/*.js", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// ------------------------------- any other tasks ---------------------------------------

gulp.task("other:copy-ansible-scripts", function() {
    gulp.src(parameters.other.ansibleScrptsPath + "/**/*", { "base": "./other/ansible" })
        .pipe(gulp.dest(parameters.other.ansibleDistFolder));
});

gulp.task("other:dist-clean", function() {
    del([parameters.other.distFolder]);
});


// -------------------------------single task to cover client, common and server  -------------------------------------------

gulp.task("start", (cb) => {
    exec("./node_modules/forever/bin/forever start dist/server.js", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("stop", (cb) => {
    exec("./node_modules/forever/bin/forever stop dist/server.js", (err, stdout, stderr) => { //eslint-disable-line
        console.log(stdout);
        console.log(stderr);
        cb();
    });
});

gulp.task("restart", (cb) => {
    exec("./node_modules/forever/bin/forever restart dist/server.js", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("list", (cb) => {
    exec("./node_modules/forever/bin/forever list", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("build", ["common:build", "client:build", "server:build", "other:copy-ansible-scripts"]);
gulp.task("clean", ["other:dist-clean"]);
gulp.task("test", function(callback) {
    runSequence("common:test", "client:test", "server:test", callback);
});

gulp.task("watch", ["client:watch", "server:watch"]);
gulp.task("eslint", ["common:eslint", "client:eslint", "server:eslint", "functional:eslint"]);
gulp.task("checkin-ready", ["common:checkin-ready", "client:checkin-ready", "server:checkin-ready"]);

gulp.task("test-coverage", (cb) => {
    exec("./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --compilers js:babel/register -R spec " +
    parameters.server.testPath + "/**/**/**/**/**/*.js " +
    parameters.common.testPath + "/**/**/**/**/**/*.js " +
    parameters.client.testPath + "/**/**/**/**/**/*.js " + parameters.client.testPath + "/**/**/**/**/**/*.jsx ", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("clean-start", function(callback) {
    runSequence("clean", "stop", "build", "start", callback);
});
