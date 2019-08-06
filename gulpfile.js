var gulp = require('gulp');
var gulpIf = require('gulp-if');
var notify = require('gulp-notify');
var kit = require('gulp-kit-2');
var prettify = require('gulp-prettify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var useref = require('gulp-useref');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var svgSymbols = require('gulp-svg-symbols');
var svgmin = require('gulp-svgmin');
var del = require('del');
var browserSync = require('browser-sync').create();

function HandleErrors() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>'
	}).apply(this, args);
	this.emit('end');
}

// Starting browserSync server
function BrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: 'dist/',
		},
		notify: {
			styles: {
				borderRadius: '8px 0 0',
				bottom: '0',
				top: 'auto'
			}
		}
	});
	done();
}

function BrowserReload(done) {
	browserSync.reload();
	done();
}

function Kit(done) {
	gulp.src('**/*.kit')
		.pipe(kit().on('error', HandleErrors))
		.pipe(gulp.dest('dist/'));
	done();
}

function Sass(done) {
	gulp.src(['**/*.scss', '!node_modules/**/*.scss'])
		.pipe(sass({ outputStyle: 'compressed' }).on('error', HandleErrors))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
	done();
}

function Js(done) {
	// gulp.run('js-hint');
	gulp.src('assets/js/**/*')
		.pipe(gulp.dest('dist/assets/js/'));
	done();
}

// Copying assets & uploads
function Root(done) {
	gulp.src(['root/**/*', 'root/**/.*'])
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
	done();
}

function Assets(done) {
	gulp.src(['assets/**/*', '!assets/images/**/*.svg', '!assets/js/**/*', '!assets/{css,css/**}'])
		.pipe(gulp.dest('dist/assets/'))
		.pipe(browserSync.stream());
	done();
}

function Svg(done) {
	gulp.src('assets/images/**/*.svg')
		.pipe(svgmin({
			plugins: [{
				cleanupIDs: false
			}, {
				removeViewBox: false
			}]
		}))
		.pipe(gulp.dest('dist/assets/images/'))
		.pipe(browserSync.stream());
	done();
}

function SvgSprite(done) {
	gulp.src('assets/images/symbols/**/*.svg')
		.pipe(svgmin({
			plugins: [{
				removeViewBox: false
			}, {
				removeAttrs: {
					attrs: '*:(stroke|fill):((?!^none$).)*'
				}
			}]
		}))
		.pipe(svgSymbols())
		.pipe(gulp.dest('dist/assets/images/'))
		.pipe(browserSync.stream());
	done();
}

function Uploads(done) {
	gulp.src('uploads/**/*')
		.pipe(gulp.dest('dist/uploads/'))
		.pipe(browserSync.stream());
	done();
}

function Watch(done) {
	gulp.watch('**/*.kit', gulp.series(Kit, BrowserReload));
	gulp.watch(['**/*.scss', '!node_modules/**/*.scss'], Sass);
	gulp.watch('assets/js/**/*.js', gulp.series(Js, BrowserReload));
	gulp.watch('root/**/*', Root);
	gulp.watch(['assets/**/*', '!assets/images/**/*.svg', '!assets/{js,js/**}', '!assets/{css,css/**}'], Assets);
	gulp.watch('assets/images/**/*.svg', gulp.series(Svg, SvgSprite));
	gulp.watch('uploads/**/*', Uploads);
	done();
}

// Cleaning dist
function Clean(done) {
	del.sync('dist/');
	done();
}

// Compiling stuffs
function Compile(done) {
	gulp.src('**/*.kit')
		.pipe(kit())
		.pipe(prettify({indent_char: '\t', indent_size: 1, preserve_newlines: true, unformatted: ['a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u', 'strike', 'big', 'small', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'svg','br', 'label', 'input', 'script', 'time'], wrap_line_length: 0}))
		.pipe(useref({ searchPath: './' }))
		.pipe(gulpIf('assets/js/bundle.js', babel({ presets: ['@babel/env'] })))
		.pipe(gulpIf('assets/js/bundle.js', uglify()))
		.pipe(gulp.dest('dist/'));
	done();
}

const dev = gulp.series(Kit, Sass, Js, Root, Assets, Svg, SvgSprite, Uploads, BrowserSync, Watch);
const build = gulp.series(Clean, Compile, gulp.parallel(Sass, Root, Assets, Svg, SvgSprite, Uploads));

exports.build = build;
exports.default = dev;
