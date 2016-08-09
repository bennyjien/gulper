# Haunter: Gulpy Website Generator

Haunter is Gulp-based static webpage generator.

Haunter does:
+ Live reloading browser
+ Compile kit (http://incident57.com/codekit/help.html#kit) to HTML
+ Compile SCSS to CSS
+ Autoprefix CSS to support last 2 versions
+ Lint, concatenate and uglify JavaScript
+ Combine SVG files in assets/images/ to SVG Symbol (https://github.com/Hiswe/gulp-svg-symbols)

Haunter doesn't:
+ optimize images, use **imageoptim** or **jpegmini**
+ generate favicons, use http://realfavicongenerator.net/

Have fun! :)

## USAGE

+ open terminal
+ run `npm install`
+ run `gulp` to start development mode
+ run `gulp build` for production-ready website

## KNOWN ISSUES

+ svg source without <xml> will fail silently, close and re-run gulp if this happens
+ always useref external script, unbundled script will not included in _dist/_
+ to review _doc/_, run `gulp build` since _doc/_ needs bundle.js

## CHANGELOG

1.0.1 (Aug 6, 2016)
+ /scss: rearranged
+ style.js: remove unnecessary scripts
+ gulpfile.js: fix bugs

1.0.0 (Jul 14, 2016)
+ Fresh start!
+ Inspired from Walker 2.50


## TODO

- look at form.scss
