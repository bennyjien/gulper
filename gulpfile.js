const gulp = require(`gulp`);
const fileInclude = require(`gulp-file-include`);
const gulpIf = require(`gulp-if`);
const rename = require(`gulp-rename`);
const notify = require(`gulp-notify`);
const prettify = require(`gulp-prettify`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const cssnano = require(`cssnano`);
const useref = require(`gulp-useref`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const svgSymbols = require(`gulp-svg-symbols`);
const svgmin = require(`gulp-svgmin`);
const del = require(`del`);
const browserSync = require(`browser-sync`).create();

const prod = (process.title === `gulp build`) ? true : false;

function HandleErrors() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: `Compile Error`,
		message: `<%= error.message %>`
	}).apply(this, args);
	this.emit(`end`);
}

// Starting browserSync server
function BrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: `dev/`,
		},
		browser: `google chrome`,
		notify: {
			styles: {
				borderRadius: `8px 0 0`,
				bottom: `0`,
				top: `auto`
			}
		}
	});
	done();
}

function BrowserReload(done) {
	browserSync.reload();
	done();
}

function FileInclude(done) {
	gulp.src(`[^_]*.html`)
		.pipe(fileInclude({
			prefix: `<!-- @`,
			suffix: ` -->`,
			basepath: `@file`
		}))
		.pipe(gulp.dest(`dev/`));
	done();
}

function Sass(done) {
	gulp.src([`**/*.scss`, `!node_modules/**/*.scss`])
		.pipe(sass({ outputStyle: `expanded` }).on(`error`, HandleErrors))
		.pipe(postcss([autoprefixer({ cascade: false })]))
		.pipe(rename({suffix: `.min`}))
		.pipe(gulp.dest(`dev/`))
		.on(`end`, function() {
			browserSync.stream();
			done();
		});
}

function ProduceSass(done) {
	gulp.src([`**/*.scss`, `!node_modules/**/*.scss`])
		.pipe(sass({ outputStyle: `expanded` }).on(`error`, HandleErrors))
		.pipe(postcss([autoprefixer({ cascade: false })]))
		.pipe(rename({suffix: `.min`}))
		.pipe(postcss([cssnano()]))
		.pipe(gulp.dest(`dist/`));
	done();
}

function Js(done) {
	gulp.src(`assets/js/**/*`)
		.pipe(gulp.dest(`dev/assets/js/`));
	done();
}

// Copying assets & uploads
function Root(done) {
	gulp.src([`root/**/*`, `root/**/.*`])
		.pipe(gulp.dest(`dev/`))
		.on(`end`, function() {
			browserSync.stream();
			done();
		});
}

function ProduceRoot(done) {
	gulp.src([`root/**/*`, `root/**/.*`])
		.pipe(gulp.dest(`dist/`));
	done();
}

function Assets(done) {
	gulp.src([`assets/**/*`, `!assets/images/**/*.svg`, `!assets/js/**/*`, `!assets/{css,css/**}`])
		.pipe(gulp.dest(`dev/assets/`))
		.on(`end`, function() {
			browserSync.stream();
			done();
		});
}

function ProduceAssets(done) {
	gulp.src([`assets/**/*`, `!assets/images/**/*.svg`, `!assets/js/**/*`, `!assets/{css,css/**}`])
		.pipe(gulp.dest(`dist/assets/`));
	done();
}

function Svg(done) {
	gulp.src(`assets/images/**/*.svg`)
		.pipe(svgmin({
			plugins: [{
				cleanupIDs: false
			}, {
				removeViewBox: false
			}]
		}))
		.pipe(gulp.dest(`dev/assets/images/`))
		.on(`end`, function() {
			browserSync.stream();
			done();
		});
}

function ProduceSvg(done) {
	gulp.src(`assets/images/**/*.svg`)
		.pipe(svgmin({
			plugins: [{
				cleanupIDs: false
			}, {
				removeViewBox: false
			}]
		}))
		.pipe(gulp.dest(`dist/assets/images/`));
	done();
}

function SvgSprite(done) {
	gulp.src(`assets/images/symbols/**/*.svg`)
		.pipe(svgmin({
			plugins: [{
				removeViewBox: false
			}, {
				removeAttrs: {
					attrs: `*:(stroke|fill):((?!^none$).)*`
				}
			}]
		}))
		.pipe(svgSymbols())
		.pipe(gulp.dest(`dev/assets/images/`))
		.on(`end`, function() {
			browserSync.stream();
			done();
		});
}

function ProduceSvgSprite(done) {
	gulp.src(`assets/images/symbols/**/*.svg`)
		.pipe(svgmin({
			plugins: [{
				removeViewBox: false
			}, {
				removeAttrs: {
					attrs: `*:(stroke|fill):((?!^none$).)*`
				}
			}]
		}))
		.pipe(svgSymbols())
		.pipe(gulp.dest(`dist/assets/images/`));
	done();
}

function Uploads(done) {
	gulp.src(`uploads/**/*`)
		.pipe(gulp.dest(`dev/uploads/`))
		.on(`end`, function() {
			browserSync.stream();
			done();
		});
}

function ProduceUploads(done) {
	gulp.src(`uploads/**/*`)
		.pipe(gulp.dest(`dist/uploads/`));
	done();
}

// Watching

function Watch(done) {
	gulp.watch(`*.html`, gulp.series(FileInclude, BrowserReload));
	gulp.watch([`**/*.scss`, `!node_modules/**/*.scss`], Sass);
	gulp.watch(`assets/js/**/*.js`, gulp.series(Js, BrowserReload));
	gulp.watch(`root/**/*`, Root);
	gulp.watch([`assets/**/*`, `!assets/images/**/*.svg`, `!assets/{js,js/**}`, `!assets/{css,css/**}`], Assets);
	gulp.watch(`assets/images/**/*.svg`, gulp.series(Svg, SvgSprite));
	gulp.watch(`uploads/**/*`, Uploads);
	done();
}

// Cleaning dist
function Clean(done) {
	del.sync(`dist/`);
	done();
}

// Compiling stuffs
function ProduceHTMLJS(done) {
	gulp.src(`[^_]*.html`)
		.pipe(fileInclude({
			prefix: `<!-- @`,
			suffix: ` -->`,
			basepath: `@file`
		}))
		.pipe(prettify({indent_char: `\t`, indent_size: 1, preserve_newlines: true, unformatted: [`a`, `span`, `img`, `code`, `pre`, `sub`, `sup`, `em`, `strong`, `b`, `i`, `u`, `strike`, `big`, `small`, `pre`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `svg`,`br`, `label`, `input`, `script`, `time`], wrap_line_length: 0}))
		.pipe(useref({ searchPath: `./` }))
		.pipe(gulp.dest(`dist/`))
		.on(`end`, function() {
			done();
		});
}

function minifyJS(done) {
	gulp.src(`dist/assets/js/*.js`)
		.pipe(gulpIf(`script.js`, babel({
			presets: [`@babel/preset-env`],
			// plugins: [`@babel/plugin-transform-runtime`]
		})))
		.pipe(uglify())
		.pipe(gulp.dest(`dist/assets/js/`));
	done();
}

const dev = gulp.series(Clean, FileInclude, Sass, Js, Root, Assets, Svg, SvgSprite, Uploads, BrowserSync, Watch);
const build = gulp.series(Clean, ProduceHTMLJS, minifyJS, gulp.parallel(ProduceSass, ProduceRoot, ProduceAssets, ProduceSvg, ProduceSvgSprite, ProduceUploads));

exports.build = build;
exports.default = dev;
