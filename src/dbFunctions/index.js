module.exports = class {
    constructor (Yuno) {
        require('fs').readdirSync(__dirname).forEach(filename => {
            if (filename !== 'index.js') {
                Object.assign(this, require(`${__dirname}/${filename}`)(Yuno));
            }
        });
    }
};