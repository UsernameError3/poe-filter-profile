const gulp = require('gulp');

const build = (cb) => {
    console.log('Building Application...');
    cb();
}

gulp.task('build', build);
