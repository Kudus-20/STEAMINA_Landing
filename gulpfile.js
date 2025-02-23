'use strict';

var gulp          = require('gulp');
var sass          = require('gulp-sass')(require('sass'));
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var rename        = require('gulp-rename');
var rtlcss        = require('gulp-rtlcss');
var gulpif        = require('gulp-if');
var browserSync   = require('browser-sync').create();

// RTL
var enableRTL     = false;

// Paths
var Paths = {
    TEMPLATE: './template',
    SCSS: 'template/assets/scss/**/*.scss',
    CSS: 'template/assets/css/',
    JS: 'template/**/*.js',
    HTML: 'template/**/*.html'
};

// ✅ Compile Sass into CSS
gulp.task('sass', function() {
    return gulp.src(Paths.SCSS)
      .pipe(sourcemaps.init())
      .pipe(sass.sync({
          outputStyle: 'compressed' // Minified for production
      }).on('error', sass.logError)) 
      .pipe(autoprefixer({
          overrideBrowserslist: ['last 2 versions']
      }))
      .pipe(gulp.dest(Paths.CSS))
      .pipe(gulpif(enableRTL, rtlcss()))
      .pipe(gulpif(enableRTL, rename({ suffix: '-rtl' })))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(Paths.CSS));
});

// ✅ Local Development Server (Only for Running Locally)
gulp.task('serve', function(done) {
    browserSync.init({
      server: Paths.TEMPLATE
    });
    done();
});

// ✅ Watch Files for Changes (Only for Local Development)
gulp.task('watch', function(done) {
    gulp.watch(Paths.SCSS, gulp.series('sass'));
    gulp.watch(Paths.HTML).on('change', browserSync.reload);
    gulp.watch(Paths.JS).on('change', browserSync.reload);
    done();
});

// ✅ Default Task (Local Development) - Does NOT Run on Netlify
gulp.task('default', gulp.series('sass', 'serve', 'watch'));

// ✅ Netlify-Specific Build Task (Prevents Deployment Issues)
gulp.task('netlify-build', gulp.series('sass'));
