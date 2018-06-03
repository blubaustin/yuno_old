const moment = require('moment'); require('moment-duration-format');

exports.run = async function (Yuno, msg, args) {
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
        return msg.channel.send('Insufficient permissions.');
    }
    if (!msg.mentions.channels.size) {
        return msg.channel.send('You need to mention a channel.');
    }
    const res = await Yuno.db.getChannel(msg.mentions.channels.first().id);
    if (args[0] === '--force') {
        msg.channel.send('This command will clean the channel **immediately, without a warning**. \n\nProceed?\nAnswer with `yes`/`no`.');
        const collector = msg.channel.createMessageCollector(m => msg.author.id === m.author.id, { time: 40000 });
        collector.on('collect', async (m) => {
            if (m.content.toLowerCase() === 'yes') {
                await Yuno.dbConn.run('UPDATE channels SET entryTime = ? WHERE channelID = ?;', 1, res.channelID);
                msg.channel.send('Force cleaning..');
            } else {
                msg.channel.send('Force clean canceled.');
            }
            return collector.stop();
        });
    } else {
        await Yuno.dbConn.run('UPDATE channels SET entryTime = ? WHERE channelID = ?;', Date.now() - res.timeBeforeWarning, res.channelID);
        msg.channel.send(`Clean commencing in ${moment.duration(res.timeBeforeWarning, 'milliseconds').format('hh:mm:ss')}.`);
    }
};

exports.props = {
    name: 'clean',
    usage: '{command}',
    aliases: [],
    description: 'TODO'
};
