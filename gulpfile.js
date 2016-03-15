const babelify = require('babelify');
const browserify = require('browserify');
const vbuffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');

const jsOutDir = 'src/chat/dist';

const handleError = function(err) {
  gutil.log(
      gutil.colors.red('Browserify compile error:'),
      err.message
  );
  gutil.beep(3);
  this.emit('end');
};

gulp.task('clean', () => {
  return del(jsOutDir);
});

gulp.task('buildJS', ['clean'], (cb) => {
  runSequence(['babel-build'], cb);
});

gulp.task('babel-build', () => {
  return browserify('./src/chat/js/index.js', {
    debug: true
  }).transform(babelify)
    .bundle()
    .on('error', handleError)
    .pipe(source('build.js'))
    .pipe(vbuffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsOutDir));
});

gulp.task('watch', function() {
    return gulp.watch(['src/chat/js/**/*'], ['buildJS']);
});

gulp.task('default', ['buildJS', 'watch']);
