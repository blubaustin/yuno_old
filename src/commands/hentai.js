const snekfetch = require('snekfetch');
exports.run = async function (Yuno, msg, args) {
    let url = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100';
    let targetPosts;
    if (parseInt(args[0])) {
        targetPosts = parseInt(args[0]);
        if (targetPosts < 1 || targetPosts > 25) {
            return msg.channel.send('You cannot request less than 1 or over 25 results.');
        }
        args.shift();
    } else {
        targetPosts = 2;
    }

    if (args[0]) {
        url += `&tags=${args[0]}`;
    } else {
        url += `&pid=${Math.ceil(Math.random() * 2000)}`;
    }
    let res;
    try {
        res = JSON.parse((await snekfetch.get(url)).body.toString());
    } catch (e) {
        return msg.channel.send(`No search results found for \`${args[0]}. Please try a different query.`);
    }

    const images = Yuno.getRandomsFromArray(res.map(i => [i.image, i.directory]), targetPosts);
    while (images.length > 0) {
        await msg.channel.send(images.slice(0, 4).map(x => `https://img.rule34.xxx/images/${x[1]}/${x[0]}`))
        images.splice(0, 4);
    }
};

exports.props = {
    name        : 'hentai',
    usage       : '{command}',
    aliases     : [],
    description : ''
};