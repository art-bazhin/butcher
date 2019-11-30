const { src, dest, parallel, series, watch } = require('gulp');

const rimraf = require('rimraf');
const zipFolder = require('zip-a-folder');

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

const resize = require('gulp-image-resize');

const SRC = './src/_includes/';
const ROOT = './src/_root/**/*'
const IMG = './src/img/';
const DIST = './dist/';

const PRODUCT_IMG_WIDTH = 450;
const GALLERY_IMG_WIDTH = 2292;

const BABEL_CONFIG = {
  presets: [
    ['@babel/env', 
      // {
      //   useBuiltIns: 'usage',
      //   corejs: 3
      // }
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

const root = function() {
  return src(ROOT)
    .pipe(copy(DIST, {
      prefix: 2
    }));
}

const assets = function() {
  return src(SRC + 'assets/**/*')
    .pipe(copy(DIST, {
      prefix: 2
    }));
}

const zip = function(cb) {
  zipFolder.zipFolder(DIST, './dist.zip', function(err) {
    if(err) {
      console.log('Failed to zip!', err);
    } else cb();
  });
}

const galleryImg = function() {
  return src(IMG + 'gallery/**/*')
    .pipe(resize({
      width : GALLERY_IMG_WIDTH,
      quality: 0.4,
      format: 'jpg'
    }))
    .pipe(dest(DIST + 'img/gallery/'));
}

const productsImg1x = function() {
  return src(IMG + 'products/**/*')
    .pipe(resize({
      width : PRODUCT_IMG_WIDTH,
      height : PRODUCT_IMG_WIDTH,
      quality: 0.7,
      format: 'jpg'
    }))
    .pipe(dest(DIST + 'img/products/'));
}

const productsImg2x = function() {
  return src(IMG + 'products/**/*')
    .pipe(resize({
      width : PRODUCT_IMG_WIDTH * 2,
      height : PRODUCT_IMG_WIDTH * 2,
      quality: 0.6,
      format: 'jpg'
    }))
    .pipe(rename(function (path) { path.basename += "@2x"; }))
    .pipe(dest(DIST + 'img/products/'));
}

const productsImg = parallel(productsImg1x, productsImg2x);

const build = series(clean, parallel(css, js, assets, productsImg, galleryImg, root));
const buildDev = series(clean, parallel(css, jsDev, assets, productsImg, galleryImg, root));

const dev = function() {
  buildDev();
  watch([IMG + 'products/**/*'], productsImg);
  watch([SRC + 'assets/**/*'], assets);
  watch([SRC + '**/*.js'], jsDev);
  watch([SRC + '**/*.pcss', SRC + '**/*.css'], css);
};

exports.default = build;
exports.dev = dev;
exports.zip = zip;

