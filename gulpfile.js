const gulp = require('gulp');
const exec = require('child_process').execSync;

const build = (cb) => {
    console.log('Fetching Remote Resources...');

    // https://github.com/NeverSinkDev/FilterBlade-Public-Assets
    baseTypesURL = 'https://raw.githubusercontent.com/NeverSinkDev/FilterBlade-Public-Assets/main/FbPoe1Configs/BaseTypes.csv'
    itemModsURL = 'https://raw.githubusercontent.com/NeverSinkDev/FilterBlade-Public-Assets/main/FbPoe1Configs/Mods.csv'
    enchantments = 'https://raw.githubusercontent.com/NeverSinkDev/FilterBlade-Public-Assets/main/FbPoe1Configs/Enchantments.csv'

    // Create Logic to Store Item Data to Cache
    console.log('Build Complete...');
    return cb()
}

const commitStatus = (cb) => {
    let out = exec('git diff --stat');
    out = out.toString();
    if (out.indexOf('.json') > -1) {
        console.log('Build generated new files, aborting commit...');
        process.exit(1);
    }
    cb();
}

gulp.task('build', build);
gulp.task('commit-status', commitStatus);
