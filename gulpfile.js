const gulp = require('gulp');
const exec = require('child_process').execSync;
const utils = require('./utils/util.js');

const build = (cb) => {
    console.log('Building Application...');
    utils.buildFilterFile();
    cb();
}

const commitStatus = (cb) => {
    let out = exec('git diff --stat');
    out = out.toString();
    if (out.indexOf('.json') > -1) {
        console.log('build generated new files, aborting commit.');
        process.exit(1);
    }
    cb();
}

gulp.task('build', build);
gulp.task('commit-status', commitStatus);