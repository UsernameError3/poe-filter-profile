const fs = require('fs');
const path = require('path')
const csvToJson = require('convert-csv-to-json');

const buildFilterFile = () => {
    const errors = [];
    const fileInputName = path.resolve('data/data.csv'); 
    const fileOutputName = path.resolve('data/data.json');
    console.log('Importing: ', fileInputName);
    console.log('Exporting: ', fileOutputName);
    
    // Data Conversion
    const data = 'data';
    
    // Data Validation
    for (let i = 0; i < data.length; i++) {
        if (typeof data[i] !== "boolean") {
            errors.push();
        }
    }
    
    // Data Export
    if (errors.length) {
        throw new Error(errors.join('\n'));
    } else {
        fs.writeFileSync(fileOutputName, `${JSON.stringify(data, null, 4)}\n`);
        console.log('Finished Filter Export...');
        return;
    }
}

module.exports.buildFilterFile = buildFilterFile;
