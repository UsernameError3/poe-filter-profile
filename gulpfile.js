const gulp = require('gulp');

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

gulp.task('build', build);
