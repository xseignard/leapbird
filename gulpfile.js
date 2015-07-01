var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	del = require('del'),
	sass = require('gulp-sass'),
	gutil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	uglify = require('gulp-uglify'),
	babelify = require('babelify'),
	watchify = require('watchify'),
	exorcist = require('exorcist'),
	sourcemaps = require('gulp-sourcemaps'),
	browserify = require('browserify'),
	browserSync = require('browser-sync').create();


// Browserify + watchify for faster builds
// ----------------------------------------
watchify.args.debug = true;
var bundler = watchify(browserify('./app/scripts/app.js', watchify.args));
bundler.transform(babelify.configure({
	sourceMapRelative: './app/scripts'
}));
bundler.on('update', bundle);

function bundle() {
	gutil.log('Compiling JS...');
	return bundler.bundle()
		.on('error', function (err) {
			gutil.log(err.message);
			browserSync.notify('Browserify Error!');
			this.emit('end');
		})
		.pipe(exorcist('./dist/scripts/app.js.map'))
		.pipe(source('app.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(browserSync.stream({once: true}));
}
gulp.task('bundle', function () {
	return bundle();
});

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
	.pipe(sourcemaps.write('.'))
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

/**
 * First bundle, then serve from the ./app directory
 */
gulp.task('default', ['clean', 'lint', 'styles', 'copy', 'bundle'], function () {
	browserSync.init({
		server: './dist'
	});
	gulp.watch(['./app/*.html', './app/images/**'], ['copy']);
	gulp.watch(['./app/styles/**/*.scss'], ['styles']);
});
