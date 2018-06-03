exports.run = async function (Yuno, msg) {
    if (!msg.mentions.channels.size) {
        return msg.channel.send('You need to mention a channel.');
    }
    const res = await Yuno.db.getChannel(msg.mentions.channels.first().id);
    if (!res.warned) {
        msg.channel.send('You can only delay the clean after a warning has been posted.');
    } else {
        await Yuno.dbConn.run('UPDATE channels SET entryTime = ? WHERE channelID = ?;', res.entryTime + 5 * 60 * 1000, res.channelID);
        msg.channel.send('Cleanup delayed by `5` minutes.');
    }
};

exports.props = {
    name        : 'delay',
    usage       : '{command}',
    aliases     : [],
    description : 'TODO'
};