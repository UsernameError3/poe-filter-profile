const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

// Setup Environment
dotenv.config();

// Build Application Context & Generate Files
const init = async () => {

    console.log('Generating Context...');

    // Execution Start Time
    const start = dayjs();
    const startDateTime = start.format('YYYY-MM-DD_HH-mm-ss')

    // Create Context Object
    let context = {
        time: start,
        league: 'affliction',
        directory: __dirname,
        file: {
            extension: '.filter',
            strictness: [
                'soft',
                'regular',
                'semi-strict',
                'strict',
                'very-strict',
                'uber-strict',
                'uber-plus-strict'
            ]
        },
        import: {},
        export: {
            files: []
        }
    }

    // Build Export Folder
    context.export.exportDirectory = `${__dirname}/exports`;
    context.export.folderPath = path.join(context.export.exportDirectory, `${context.league}_filters_${startDateTime}`);

    // Build Filter Files
    context.file.strictness.forEach(strictness => {
        let filterFilename = `${context.league}_${strictness}${context.file.extension}`
        let filterFilepath = path.join(context.export.folderPath, filterFilename)
        let filterFile = {
            type: strictness,
            filename: filterFilename,
            filepath: filterFilepath
        }
        context.export.files.push(filterFile);
    });

    // Create Export Folder
    if (!fs.existsSync(context.export.folderPath)){
        fs.mkdirSync(context.export.folderPath, { recursive: true });
    }

    // Create Filter Files
    context.export.files.forEach(file => {
        if (!fs.existsSync(file.filepath)){
            fs.writeFileSync(file.filepath, '', 'utf-8');
        }
    });

    // Return Context to Main
    return context
}

// Main Process
const main = async () => {
    let context = await init();
    
    if (context) {
        console.log('Finished Execution!');
    } else {
        console.log('Context Generation Failed!');
    }
};
main();
