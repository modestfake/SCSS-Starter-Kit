const gulp = require('gulp')
const watch = require('gulp-watch')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('del')
const svgSprite = require('gulp-svg-sprites')
const gutil = require('gulp-util')

const { src, build } = require('./configs')

process.env.NODE_ENV = 'development'

// Path, related to the root,
// where both .css and .scss style files
// will be stored

gulp.task('sass', () => {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src(`${src.path + src.scss}/main.scss`)
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(rename('style.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(`${build.path + build.css}`))
  }

  return gulp.src(`${src.path + src.scss}/main.scss`)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(build.path + build.css))
})

gulp.task('sprite', () => {
  return gulp.src(`${src.path + src.svg}/*.svg`)
    .pipe(svgSprite({
      mode: 'symbols',
      common: 'svg',
      svgId: 'svg-%f',
      preview: { symbols: 'index.html' },
      svg: { symbols: 'symbols.svg' },
      templates: { scss: true }
    }))
    .pipe(gulp.dest(build.path + build.svg))
})

const { cyan, yellow } = gutil.colors
const logChange = e => gutil.log(
  'File',
  cyan(e.path.split('\\').pop()),
  yellow(e.event)
)

// Watchers
gulp.task('sass:watch', () => {
  watch(`${src.path + src.scss}/**/*.scss`, () => {
    gulp.start('sass')
  })
})

gulp.task('svg:watch', () => {
  watch(`${src.path + src.svg}/*.svg`, e => {
    logChange(e)
    gulp.start('sprite')
  })
})

gulp.task('build', () => {
  process.env.NODE_ENV = 'production'

  clean(`${build.path + build.css}/style.css.map`)
    .then(() => gulp.start('sass'))
    .then(() => gulp.start('sprite'))
})

gulp.task('default', ['sass:watch', 'svg:watch'])
