'use strict';

var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	del = require('del'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	babelify = require('babelify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	_ = require('lodash'),
	browserSync = require('browser-sync').create();

// Clean
// ----------------------------------------
gulp.task('clean', function (cb) {
	return del('./dist', function() { cb() });
});

// Styles
// ----------------------------------------
gulp.task('styles', function() {
	return gulp.src('./app/styles/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/styles'));
});

// Linting
// ----------------------------------------
gulp.task('lint', function () {
	return gulp.src('./app/scripts/**/*.js')
	.pipe(jshint());
});

// Copy assets & html
// ----------------------------------------
gulp.task('copy', function() {
	return gulp.src(['./app/index.html', './app/images/**'], {base: './app'})
	.pipe(gulp.dest('./dist'));
});

// Browserify + watchify for faster builds
// ----------------------------------------
var customOpts = {
	entries: ['./app/scripts/app.js'],
	debug: true
};
var opts = _.assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
b.transform(babelify);
b.on('update', function() { bundle(); browserSync.reload(); });
b.on('log', gutil.log);

function bundle() {
	return b.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(uglify())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./dist/scripts'));
}
bundle();
gulp.task('js', bundle);

// Build pipeline
// ----------------------------------------
gulp.task('pipeline', ['clean', 'styles', 'lint', 'copy', 'js']);

// BrowserSync
// ----------------------------------------
gulp.task('browserSync', function () {
	return browserSync.init({
		server: {
			baseDir: './dist',
		}
	});
});

// Watchers
// -------------------------------------------------
gulp.task('watch', ['browserSync'], function() {
	gulp.watch(['./app/*.html', './app/images/**'], ['copy']);
	gulp.watch(['./app/styles/**/*.scss'], ['styles']);
});
