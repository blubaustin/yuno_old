const snekfetch = require('snekfetch');

exports.run = async function (Yuno, msg, args) {
    let url = 'https://nekos.life/api';

    if (args[0] === 'lewd') {
        if (!msg.channel.nsfw) {
            return msg.channel.send('I don\'t think I\'m allowed to post those here... Maybe try a NSFW marked channel?');
        }
        url += '/lewd/neko';
    } else {
        url += '/neko';
    }

    const res = await snekfetch.get(url);
    msg.channel.send({ embed: {
        color: await Yuno.db.getColor(msg.guild.id),
        image: { url: res.body.neko },
        footer: { text: `Requested by ${msg.author.tag}` }
    } });
};

exports.props = {
    name        : 'neko',
    usage       : '{command} [lewd]',
    aliases     : ['nya', 'meow'],
    description : 'TODO'
};