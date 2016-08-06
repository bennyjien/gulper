# Haunter: Gulpy HTML starter web template

+ open terminal
+ run `npm install`
+ run `gulp` to start development mode
+ run `gulp build` for production-ready website

Notes:
+ always useref external script, unbundled script will not included in _dist/_
+ _assets/images/_ are not optimized yet, use **imageoptim** or **jpegmini**
+ _uploads/_ contains non-theme-dependant images or assets
+ to generate favicons, go to http://realfavicongenerator.net/
+ to review _doc/_, run `gulp build` since _doc/_ needs bundle.js

Warning:
+ svg source without <xml> will fail silently, restart gulp if this happens

Have fun! :)

## CHANGELOG

1.0.0 (Jul 14, 2016)
+ Fresh start!
+ Inspired from Walker 2.50