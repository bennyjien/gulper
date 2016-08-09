var gulp = require('gulp');
var gulpIf = require('gulp-if');
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var kit = require('gulp-kit');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var prettify = require('gulp-prettify');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var svg2png = require('gulp-svg2png');
var svgSymbols = require('gulp-svg-symbols');
var svgo = require('gulp-svgo');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>'
	}).apply(this, args);
	this.emit('end');
}

// Starting browserSync server
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist/',
		},
		browser: "google chrome",
		notify: {
			styles: {
				borderRadius: '8px 0 0',
				bottom: '0',
				top: 'auto'
			}
		}
	});
});

// Compiling stuffs
gulp.task('kit-js-dist', function() {
	return gulp.src('kit/**/*.kit')
		.pipe(kit())
		.pipe(prettify({indent_size: 4}))
		.pipe(useref({ searchPath: './' }))
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulp.dest('dist/'));
});

gulp.task('kit', function() {
	return gulp.src('kit/**/*.kit')
		.pipe(kit().on('error', handleErrors))
		.pipe(gulp.dest('dist/'));
		// .pipe(browserSync.stream());
});

gulp.task('kit-reload', ['kit'], function() {
	browserSync.reload();
});

gulp.task('sass', function() {
	return gulp.src('scss/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', handleErrors))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});

gulp.task('js-hint', function() {
	gulp.src(['js/style.js', 'js/script.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail')).on('error', handleErrors);
});

gulp.task('js', function() {
	gulp.run('js-hint');

	return gulp.src('js/**/*')
		.pipe(gulp.dest('dist/js/'));
		// .pipe(browserSync.stream());
});

gulp.task('js-reload', ['js'], function() {
	browserSync.reload();
});

gulp.task('doc-kit', function() {
	return gulp.src('_doc/*.kit')
		.pipe(kit())
		.pipe(gulp.dest('dist/_doc/'));
		// .pipe(browserSync.stream());
});

gulp.task('doc-kit-reload', ['doc-kit'], function() {
	browserSync.reload();
});

gulp.task('doc-sass', function() {
	return gulp.src('_doc/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', handleErrors))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe(gulp.dest('dist/_doc/'))
		.pipe(browserSync.stream());
});

// Generating SVG Symbol
// gulp.task('svg-fallback', function() {
// 	return gulp.src('assets/images/**/*.svg')
// 		.pipe(svg2png())
// 		.pipe(rename({ prefix: 'svg-symbols.svg.' }))
// 		.pipe(gulp.dest('dist/assets/images/'));
// });

// gulp.task('svg-sprite', ['svg-fallback'], function() {
// 	return gulp.src('assets/images/**/*.svg')
// 	.pipe(svgo())
// 	.pipe(svgSymbols({ className: '.icon-%f' }))
// 	.pipe(gulp.dest('dist/assets/images/'))
// 	.pipe(browserSync.stream());
// });

gulp.task('svg-sprite', function() {
	return gulp.src('assets/images/**/*.svg')
	.pipe(svgo())
	.pipe(svgSymbols())
	.pipe(gulp.dest('dist/assets/images/'))
	.pipe(browserSync.stream());
});

// Copying assets & uploads
gulp.task('root', function() {
	return gulp.src('root/**/*')
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});

gulp.task('assets', function() {
	return gulp.src(['assets/**/*', '!assets/**/*.svg'])
		.pipe(gulp.dest('dist/assets/'))
		.pipe(browserSync.stream());
});

gulp.task('uploads', function() {
	return gulp.src('uploads/**/*')
		.pipe(gulp.dest('dist/uploads/'))
		.pipe(browserSync.stream());
});

// Watching for changes
gulp.task('watch', function() {
	gulp.watch('kit/**/*.kit', ['kit-reload']);
	gulp.watch('scss/*.scss', ['sass']);
	gulp.watch('js/**/*.js', ['js-reload']);
	gulp.watch('_doc/*.kit', ['doc-kit-reload']);
	gulp.watch('_doc/*.scss', ['doc-sass']);
	gulp.watch('root/**/*', ['root']);
	gulp.watch(['assets/**/*', '!assets/images/**/*.svg'], ['assets']);
	gulp.watch('assets/images/**/*.svg', ['svg-sprite']);
	gulp.watch('uploads/**/*', ['uploads']);
});

// Cleaning unused assets
gulp.task('clean', function() {
	return del.sync('dist/');
});

// Building Sequence
gulp.task('default', function() {
	runSequence(['kit', 'sass', 'js', 'doc-kit', 'doc-sass', 'root', 'assets', 'svg-sprite', 'uploads', 'browserSync', 'watch']);
});

gulp.task('build', function() {
	runSequence('clean', 'kit-js-dist', ['sass', 'doc-kit', 'doc-sass', 'root', 'assets', 'svg-sprite', 'uploads']);
});