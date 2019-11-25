const { src, dest, parallel, series, watch } = require('gulp');
const rimraf = require('rimraf');

const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const copy = require('gulp-copy');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const easyImport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const cssnano = require('cssnano');

const SRC = './src/_includes/';
const IMG = './src/img/';
const DIST = './dist/';

const BABEL_CONFIG = {
  presets: [
    ['@babel/env', {
        useBuiltIns: 'entry',
        corejs: 3
      }
    ]
  ]
};

const clean = function(cb) {
  rimraf.sync(DIST);
  rimraf.sync('./dist.zip');
  cb();
};

const css = function() {
  return src(SRC + 'styles/main.pcss')
    .pipe(postcss([
      easyImport({ extensions: ['.css', '.pcss'] }), 
      precss, 
      autoprefixer, 
      cssnano
    ]))
    .pipe(rename('style.css'))
    .pipe(dest(DIST));
}

const jsDev = function() {
  return src(SRC + 'blocks/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(babel(BABEL_CONFIG))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(DIST))
}

const js = function() {
  return src(SRC + 'blocks/**/*.js')
    .pipe(concat('script.js'))
    .pipe(babel(BABEL_CONFIG))
    .pipe(uglify())
    .pipe(dest(DIST))
}

const assets = function() {
  return src(SRC + 'assets/**/*')
    .pipe(copy(DIST, {
      prefix: 2
    }));
}

const build = series(clean, parallel(css, js, assets));
const buildDev = series(clean, parallel(css, jsDev, assets));

const dev = function() {
  buildDev();
  watch([SRC + 'assets/**/*'], assets);
  watch([SRC + '**/*.js'], jsDev);
  watch([SRC + '**/*.pcss', SRC + '**/*.css'], css);
};

exports.default = build;
exports.dev = dev;

