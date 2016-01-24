const babelify = require('babelify');
const browserify = require('browserify');
const vbuffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');

const babelOutDir = 'src/chat/dist';

gulp.task('clean', (cb) => {
  del(babelOutDir).then(() => {
    cb();
  });
});

gulp.task('build', ['clean'], (cb) => {
  runSequence(['babel-build'], cb);
});

gulp.task('babel-build', () => {
    return browserify('./src/chat/js/index.js', {
      debug: true
    })
      .transform(babelify)
      .bundle()
      .on('error', (err) => { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(vbuffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(babelOutDir));
});

gulp.task('watch', function() {
    return gulp.watch(['src/chat/js/**/*'], ['build']);
});

gulp.task('default', ['build', 'watch']);
