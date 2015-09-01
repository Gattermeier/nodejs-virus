var gulp = require('gulp');
var uglify = require('gulp-uglify');
var decompress = require('gulp-decompress');

gulp.task('decompress', function() {
  gulp.src('*.{tar,tar.bz2,tar.gz,zip}')
    .pipe(decompress())
    .pipe(gulp.dest('./'));
});

gulp.task('uglify', function() {
  gulp.src('src/*.js')
    .pipe(uglify({
      compress: false
    }))
    .pipe(gulp.dest('build'));
});


gulp.task('default', ['decompress', 'uglify']);
