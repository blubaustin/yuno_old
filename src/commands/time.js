const moment = require('moment'); require('moment-duration-format');
require('moment-duration-format');

exports.run = async function (Yuno, msg) {
    if (!msg.mentions.channels.size) {
        return msg.channel.send('You need to mention a channel.');
    }

    const res = await Yuno.db.getChannel(msg.mentions.channels.first().id);
    msg.channel.send(`\`${moment.duration(res.entryTime + res.timeBetweenClean - Date.now(), 'milliseconds').format('dd:hh:mm:ss')}\` left until the next clean.`);
};

exports.props = {
    name        : 'time',
    usage       : '{command} <#channel>',
    aliases     : ['timeleft'],
    description : 'TODO'
};