const dotenv = require('dotenv');

// Setup Environment
dotenv.config();

const init = () => {
    // Load Contextual Information
    console.log('Init');
    return
}

const main = () => {
    let context = init();
    console.log(context);
    console.log('Main');
};

main();
