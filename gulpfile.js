"use strict";
var parameters = require("./config/parameters");
var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var browserify = require("browserify");
var babelify = require("babelify");
var fs = require("fs");
var runSequence = require("run-sequence");
var babel = require("gulp-babel");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");
require("babel/register");

gulp.task("client:scss", function() {
    return gulp.src([parameters.client.scssSrcPath + "/**/*.scss"])
          .pipe(sass())
          .pipe(concat(parameters.client.cssMainFile))
          .pipe(gulp.dest(parameters.client.distFolder));
});


gulp.task("client:images", function() {
    return gulp.src(parameters.client.imgSrcPath + "/**/*.*")
          .pipe(gulp.dest(parameters.client.distFolder + "/images"));
});

gulp.task("client:build-sources", function() {
    return browserify(parameters.client.srcPath + "/index.jsx", { "debug": true })
        .transform(babelify)
        .bundle()
        .pipe(fs.createWriteStream(parameters.client.distFolder + "/" + parameters.client.appMainFile));
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
    return gulp.src(parameters.client.distFolder, { "read": false })
        .pipe(clean());
});

gulp.task("client:test", function(done) {
    return gulp.src([parameters.client.testPath + "**/**/*.jsx", parameters.client.testPath + "**/**/*.js"], { "read": false })
    .pipe(mocha());
});

gulp.task("client:build", function(callback) {
    runSequence("client:copy-resources", "client:build-sources", "client:scss", callback);
});
// gulp.task("client:build", ["client:scss", "client:javascript", "client:riot-tags", "client:copy-index-html"]);

gulp.task("client:watch", function() {
    gulp.watch(parameters.client.scssSrcPath + "/**/*.scss", ["client:scss"]);
    gulp.watch([parameters.client.imgSrcPath + "/**/*.*", parameters.client.fontsPath + "/**/*.*"], ["client:copy-resources"]);
    gulp.watch(parameters.client.srcPath + "/**/*.js", ["client:build-sources", "client:test", "client:src-es-lint"]);
    gulp.watch(parameters.client.testPath + "/**/*.js", ["client:test", "client:test-es-lint"]);
    gulp.watch(parameters.client.clientAppPath + "/index.html", ["client:copy-resources"]);
});

gulp.task("client:src-eslint", function() {
    return gulp.src([parameters.client.srcPath + "/**/*.jsx", parameters.client.srcPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("client:test-eslint", function() {
    return gulp.src([parameters.client.testPath + "/**/*.jsx", parameters.client.testPath + "**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("client:eslint", ["client:src-eslint", "client:test-eslint"]);
gulp.task("client:checkin-ready", ["client:eslint", "client:test"]);
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
gulp.task("common:eslint", ["common:src-eslint", "common:test-eslint"]);
// -------------------------------server tasks -------------------------------------------
gulp.task("server:copy-js", function() {
    gulp.src(parameters.server.serverAppPath + "/src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest(parameters.server.distFolder + "/src"));

    gulp.src(parameters.server.serverAppPath + "/config/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest(parameters.server.distFolder + "/config"));

    gulp.src("./" + parameters.server.serverJsFile)
    .pipe(babel())
    .pipe(gulp.dest(parameters.server.distServerJsFolder));

});

gulp.task("server:clean", function() {
    gulp.src(parameters.server.distFolder, { "read": false })
    .pipe(clean());

    gulp.src(parameters.server.distServerJsFolder + "/" + parameters.server.serverJsFile, { "read": false })
        .pipe(clean());
});

gulp.task("server:test", function() {
    return gulp.src(parameters.server.testPath + "**/**/*.js", { "read": false })
    .pipe(mocha({ "timeout": 3000 }));
});

gulp.task("server:build", ["server:copy-js"]);

gulp.task("server:watch", function() {
    gulp.watch(parameters.server.srcPath + "/**/*.js", ["server:test", "server:src-eslint", "server:copy-js"]);
    gulp.watch(parameters.server.serverJsFile, ["server:test", "server:src-eslint", "server:copy-js"]);
    gulp.watch(parameters.server.testPath + "/**/*.js", ["server:test", "server:test-eslint"]);
});

gulp.task("server:src-eslint", function() {
    return gulp.src([parameters.server.srcPath + "/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("server:test-eslint", function() {
    return gulp.src([parameters.server.testPath + "**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task("server:eslint", ["server:src-eslint", "server:test-eslint"]);
gulp.task("server:checkin-ready", ["server:eslint", "server:test"]);

// -------------------------------common tasks -------------------------------------------

gulp.task("build", ["common:build", "client:build", "server:build"]);
gulp.task("clean", ["client:clean", "server:clean"]);
gulp.task("test", ["common:test", "client:test", "server:test"]);
gulp.task("watch", ["client:watch", "server:watch"]);
gulp.task("eslint", ["common:eslint", "client:eslint", "server:eslint"]);
gulp.task("checkin-ready", ["client:checkin-ready", "server:checkin-ready"]);
