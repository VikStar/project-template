'use strict';

var gulp        = require('gulp'),
	prefixer    = require('gulp-autoprefixer'),
	sass        = require('gulp-sass'),
	plumber     = require('gulp-plumber'),
	notify      = require('gulp-notify'),
	include     = require("gulp-include"),
	runSequence = require('run-sequence'),
	rimraf      = require('rimraf'),
	browserSync = require('browser-sync'),
	reload      = browserSync.reload;

var path = {
	build: {
		html:  'build/',
		js:    'build/js/',
		style: 'build/css/',
		img:   'build/img/',
		fonts: 'build/fonts/',
	},
	watch: {
		html:  ['src/**/*.html'],
		js:    ['src/js/**/*.js'],
		style: ['src/scss/**/*.scss'],
		img:   ['src/img/**/*.*'],
		fonts: ['src/fonts/**/*.*'],
	},
	src: {
		html:  ['src/html/*.html'],
		js:    ['src/js/script.js'],
		style: ['src/scss/style.scss'],
		img:   ['src/img/**/*.*'],
		fonts: ['src/fonts/**/*.*'],
	},
	clean: 'build/'
};

var onError = function(err) {
	notify.onError({
		title:    "Gulp error in " + err.plugin,
		message:  err.toString()
	})(err);
	this.emit('end');
};

gulp.task('webserver', function () {
	browserSync({server: "./build"});
});

gulp.task('clean', function(cb) {
	return rimraf(path.clean, cb);
});

gulp.task('build:html', function(){
	return gulp.src(path.src.html)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(include({hardFail: true}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('build:style', function () {
	return gulp.src(path.src.style)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sass())
		.pipe(prefixer({ browsers: ['last 10 versions'] }))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});

gulp.task('build:js', function(){
	return gulp.src(path.src.js)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(include({hardFail: true})) 
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('build:fonts', function() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});

gulp.task('build:img', function () {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img));
});

gulp.task('build', [
	'build:html',
	'build:style',
	'build:js',
	'build:fonts',
	'build:img',
]);

gulp.task('watch', function() {
	gulp.watch(path.watch.html,  ['build:html']);
	gulp.watch(path.watch.style, ['build:style']);
	gulp.watch(path.watch.js,    ['build:js']);
	gulp.watch(path.watch.img,   ['build:img']);
	gulp.watch(path.watch.fonts, ['build:fonts']);
});

gulp.task('default', ['clean'], function(cb){
	runSequence( 'build', 'watch', 'webserver', cb);
});