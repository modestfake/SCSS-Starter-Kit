const gulp = require('gulp')
const pump = require('pump')
const browserify = require('browserify')
const clean = require('del')

const gulpLoadPlugins = require('gulp-load-plugins')
const $ = gulpLoadPlugins()

const { src, build, styles, js, svg } = require('./config')

process.env.NODE_ENV = 'development'

gulp.task('sass', () => {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src(`${src}/${styles.src}/main.scss`)
      .pipe($.sourcemaps.init())
      .pipe($.sass({ outputStyle: 'compressed' }).on('error', $.sass.logError))
      .pipe($.rename('style.css'))
      .pipe($.size({title: 'styles'}))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(`${build}/${styles.build}`))
  }

  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ]

  return gulp.src(`${src}/${styles.src}/main.scss`)
    .pipe($.sass({ outputStyle: 'compressed' }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.size({title: 'styles'}))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest(`${build}/${styles.build}`))
})

gulp.task('js', () => {
  pump([
    gulp.src(`${src}/${js.src}/*.js`, {read: false}),
    $.tap(file => {
      $.util.log(`bundling ${file.path}`)
      file.contents = browserify(file.path, {debug: true}).bundle()
    }),
    $.buffer(),
    $.sourcemaps.init({ loadMaps: true }),
    $.uglify(),
    $.sourcemaps.write('./'),
    gulp.dest(`${build}/${js.build}`)
  ])
})

gulp.task('sprite', () => {
  return gulp.src(`${src}/${svg.src}/*.svg`)
    .pipe($.svgSprites({
      mode: 'symbols',
      common: 'svg',
      svgId: 'svg-%f',
      preview: { symbols: 'index.html' },
      svg: { symbols: 'symbols.svg' },
      templates: { scss: true }
    }))
    .pipe(gulp.dest(`${build}/${svg.build}`))
})

const { cyan, yellow } = $.util.colors
const logChange = e => $.util.log(
  'File',
  cyan(e.path.split('\\').pop()),
  yellow(e.event)
)

// Watchers
gulp.task('sass:watch', () => {
  $.watch(`${src}/${styles.src}/**/*.scss`, () => {
    gulp.start('sass')
  })
})

gulp.task('js:watch', () => {
  $.watch(`${src}/${js.src}/**/*.js`, () => {
    gulp.start('js')
  })
})

gulp.task('svg:watch', () => {
  $.watch(`${src}/${svg.src}/*.svg`, e => {
    logChange(e)
    gulp.start('sprite')
  })
})

// Util tasks
gulp.task('clean', () => {
  process.env.NODE_ENV = 'production'
  clean.sync([
    `${build}/${styles.build}/*`,
    `${build}/${svg.build}/*`
  ], { force: true })
})

gulp.task('serve', () => {
  gulp.src('./')
    .pipe($.webserver({
      livereload: true,
      fallback: './index.html',
      open: true
    }))
})

gulp.task('default', ['sass:watch', 'js:watch', 'svg:watch'])
gulp.task('build', ['clean', 'sass', 'js', 'sprite'])
