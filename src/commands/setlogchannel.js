exports.run = async function (Yuno, msg) {
    const target = msg.mentions.channels.first();
    if (!target) {
        return msg.channel.send('You need to mention a channel..');
    }

    await Yuno.db.updateGuildConfig(msg.guild.id, 'memberActChannelID', target.id);
    msg.channel.send(`Log channel successfully set to ${target.toString()}.`);
};

exports.props = {
    name: 'setlogchannel',
    usage: '{command} <#channel>',
    aliases: [],
    description: 'Use this command to set thelog channel.'
};