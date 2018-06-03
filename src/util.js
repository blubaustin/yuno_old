module.exports = {
    getRandom: (array) => array[Math.floor(Math.random() * array.length)],

    cleanSynopsis: (str, id, type) => {
        if (str.length > 2048) {
            str = str.slice(0, 1950).split('.');
            str.pop();
            str = `${str.join('.')}.\n\n[[ Read More ]](https://myanimelist.net/${type}/${id})\n\n`;
        }
        str = str
            .replace(/\n\n/g, '\n')
            .replace(/\[.*\]/g, '')
            .replace(/\(Source: .*\)/g, '');

        return str;
    },

    getRandomsFromArray: (sourceArray, neededElements) => {
        const result = [];
        for (let i = 0; i < neededElements; i++) {
            result.push(sourceArray[Math.floor(Math.random() * sourceArray.length)]);
        }
        return result;
    }
};