const moment = require('moment'); require('moment-duration-format');
const totalMem = require('os').totalmem();
const { version } = require('discord.js');

exports.run = async function (Yuno, msg) {
    msg.channel.send({ embed: {
        color: await Yuno.db.getColor(msg.guild.id),
        title: `Yuno ${Yuno.package.version}`,
        fields: [
            { name: 'Uptime', value: moment.duration(process.uptime(), 'seconds').format('dd:hh:mm:ss'), inline: true },
            { name: 'Ping', value: `${Yuno.ping.toFixed()}ms`, inline: true },
            { name: 'RAM Usage', value: `${(process.memoryUsage().rss / 1048576).toFixed()}MB/${(totalMem > 1073741824 ? `${(totalMem / 1073741824).toFixed(1)} GB` : `${(totalMem / 1048576).toFixed()} MB`)}\n(${(process.memoryUsage().rss / totalMem * 100).toFixed(2)}%)`, inline: true },
            { name: 'System Info', value: `${process.platform} (${process.arch})\n${(totalMem > 1073741824 ? `${(totalMem / 1073741824).toFixed(1)} GB` : `${(totalMem / 1048576).toFixed(2)} MB`)}`, inline: true },
            { name: 'Libraries', value: `[Discord.js](https://discord.js.org) v${version}\n[Node.js](https://nodejs.org) ${process.version}`, inline: true },
            { name: 'Guilds', value: Yuno.guilds.size, inline: true },
        ],
        footer: { text: 'Created by Aetheryx#2222' }
    }});
};

exports.props = {
    name        : 'stats',
    usage       : '{command}',
    aliases     : ['info'],
    description : 'TODO'
};