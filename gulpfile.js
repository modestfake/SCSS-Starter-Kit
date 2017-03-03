'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');
const browserSync  = require('browser-sync').create();
const gutil        = require('gulp-util');
const ftp          = require('vinyl-ftp');
const config       = require('./config.js');

gulp.task('sass', function () {
  return gulp.src('./styles/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./styles/css'));
});

gulp.task('deploy-dev', ['sass'], function() {
  const conn = ftp.create({
    host:     config.settings.host,
    user:     config.settings.user,
    password: config.settings.password,
    parallel: 10,
    log:      gutil.log
  });

  const globs = [
    '**/*',
    '*',
    '!node_modules/**',
    '!node_modules',
    '!.git/**'
  ];

  return gulp.src(globs, {base: '.', buffer: false})
    .pipe(conn.newer(config.settings.path))
    .pipe(conn.dest(config.settings.path));
});

gulp.task('sass:watch', ['deploy-dev'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('serve', ['deploy-dev'], function () {
  browserSync.init({
    proxy: config.settings.url,
    port: 3000,
    open: 'external',
    notify: true,
    ghost: true
  });

  gulp.watch('./styles/scss/**/*.scss', ['sass:watch']);
});

gulp.task('default', ['serve']);
