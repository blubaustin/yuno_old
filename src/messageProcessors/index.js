const output = [];

require('fs')
    .readdirSync(__dirname)
    .filter(filename => filename !== 'index.js')
    .forEach(filename => {
        output.push(require(`${__dirname}/${filename}`));
    });

module.exports = output;