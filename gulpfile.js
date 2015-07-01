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
b.on('update', bundle);
b.on('log', gutil.log);

function bundle(prod) {
	gutil.log('Compiling JS...');

	if (prod) {
		return b.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/scripts'));
	}
	else {
		return b.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(browserSync.reload({stream: true}));
	}
}

gulp.task('js:dev', function () {
	return bundle(false);
});

gulp.task('js:prod', function () {
	return bundle(true);
});
// Build pipeline
// ----------------------------------------
gulp.task('build', ['clean', 'styles', 'lint', 'copy', 'js:prod'], function() {
	return gutil.log('Done building');
});

// Watchers
// -------------------------------------------------
gulp.task('watch', ['clean', 'styles', 'lint', 'copy', 'js:dev'], function() {
	browserSync.init({
		server: {
			baseDir: './dist',
		}
	});
	gulp.watch(['./app/*.html', './app/images/**'], ['copy']);
	gulp.watch(['./app/styles/**/*.scss'], ['styles']);
});
