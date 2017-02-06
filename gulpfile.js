'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');
const browserSync  = require('browser-sync').create();


gulp.task('sass', function () {
  return gulp.src('./styles/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(rename('style.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./styles/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./styles/scss/**/*.scss', ['sass']);
});

gulp.task('bs', function(){
  browserSync.init({
    proxy: 'http://odezhinka.com/',
    port: 3000,
    open: 'external',
    notify: true,
    ghost: true,
    files: ['./styles/scss/**/*.scss']
  });

  browserSync.watch(['./styles/scss/**/*.scss']).on('change', browserSync.reload);
});

gulp.task('default', ['sass:watch', 'bs']);
