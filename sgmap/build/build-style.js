const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css')

gulp.task('common', function (done) {
  gulp.src('../src/assets/scss/base.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 8']
    }))
    .pipe(cleanCSS())
    .pipe(rename('common.css'))
    // .pipe(minifycss())
    .pipe(gulp.dest('../common'));
  done()
})
gulp.task('default', gulp.series('common'));
