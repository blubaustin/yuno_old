require('fs')
    .readdirSync(__dirname)
    .filter(filename => filename !== 'index.js')
    .forEach(filename => {
        exports[filename.split('.').shift()] = require(`${__dirname}/${filename}`);
    });