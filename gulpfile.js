const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
  return new Promise((resolve, reject) => {
    src('app/scss/index.scss', { sourcemaps: true })
      .pipe(sass().on('error', reject))
      .pipe(postcss([cssnano()]))
      .pipe(dest('dist', { sourcemaps: '.' }))
      .on('end', resolve)
      .on('error', reject);
  });
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch(['*.html', 'app/html/**/*.html'], browsersyncReload);
  watch(['app/scss/**/*.scss'], series(scssTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  browsersyncServe,
  watchTask
);