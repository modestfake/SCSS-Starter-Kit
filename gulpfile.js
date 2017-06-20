'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('del');

process.env.NODE_ENV = 'development';

// Path, related to the root,
// where both .css and .scss style files
// will be stored
const path = './styles/';

gulp.task('sass', function () {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src(path + 'scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('style.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(path + 'css'));
  }

  return gulp.src(path + 'scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path + 'css'));
});

gulp.task('sass:watch', function () {
  watch(path + 'scss/**/*.scss', function () {
    gulp.start('sass')
  });
});

gulp.task('build', function () {
  process.env.NODE_ENV = 'production';

  clean(path + 'css/style.css.map')
    .then(function () {
      gulp.start('sass');
    });
});

gulp.task('default', ['sass:watch']);
