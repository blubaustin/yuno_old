require('fs').readdirSync(__dirname).forEach(filename => {
    exports[filename.split('.').shift()] = require(`${__dirname}/${filename}`);
});