const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cheerio = require('gulp-cheerio');
const csswring = require('csswring');
const customProperties = require("postcss-custom-properties");
const del = require('del');
const env = require('gulp-environments');
const gulp = require('gulp');
const hash = require('gulp-hash');
// const hologram = require('gulp-hologram');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const svgstore = require('gulp-svgstore');
const webpack = require('webpack-stream');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  // Send error to notification center or command line with gulp-notify
  notify.onError({
    title: "Compile Error 🔥",
    message: "<%= error %>",
  }).apply(this, args);

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    // Keep gulp from hanging on this task
    this.emit('end');
  }
}

gulp.task('browsersync', () => {
  browserSync.init({
    proxy: 'kequote.dev',
    open: false // let's not auto-open as sometimes gulp crashes.
  });
});

gulp.task('sass', ['clean:sass'], () => {
  const processors = [
    autoprefixer({ browsers: ['last 2 version', 'ie 11'] }),
    csswring,
    customProperties({ preserve: true, strict: false }),
    require('postcss-object-fit-images')
  ];

  return gulp.src('assets/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', handleErrors))
    .pipe(postcss(processors))
    .pipe(hash())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/scss/dist'))
    .pipe(hash.manifest('manifest.json'))
    .pipe(gulp.dest('assets/scss/dist'))
    .pipe(env.development(browserSync.stream()));
});

gulp.task('svg', () => {
  return gulp.src('assets/images/svg/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio(function($) {
      $('[fill]').removeAttr('fill');
      $('style').remove();
      $('svg').addClass('svg-map');
      $('svg').attr('focusable', false);
    }))
    .pipe(rename('svg-icons.svg'))
    .pipe(gulp.dest('assets/images'));
});

gulp.task('scripts', ['clean:scripts'], () => {
  // The path doesn't actually matter; it just uses the webpack config.
  return gulp.src('assets/js/src/global/index.js')
    .pipe(webpack(require('./webpack.config.js'), require('webpack')))
    .on('error', handleErrors)
    .pipe(gulp.dest('assets/js/dist/'));
});

gulp.task('clean:scripts', () => {
  return del(['assets/js/dist/']);
});

gulp.task('clean:sass', () => {
  return del(['assets/scss/dist/']);
});

gulp.task('watch', () => {
  gulp.watch('./assets/scss/**/*.scss', ['sass']);
  gulp.watch('./assets/js/src/**/*.js', ['scripts']);
  gulp.watch('./assets/images/svg/*.svg', ['svg']);
});

gulp.task('production', ['sass', 'svg', 'scripts']);

gulp.task('default', ['sass', 'svg', 'scripts', 'browsersync', 'watch']);