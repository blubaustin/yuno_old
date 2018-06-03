exports.run = async function (Yuno, msg, args) {
    if (!args[0]) {
        return msg.channel.send('You need to specify a DM message.');
    }

    await Yuno.db.updateGuildConfig(msg.guild.id, 'joinDMMessage', args.join(' '));
    msg.channel.send(`DM message successfully updated to \`${args.join(' ')}\`.`);
};

exports.props = {
    name        : 'setdm',
    usage       : '{command} <message>',
    aliases     : [],
    description : 'Use this command to set the message that gets DM\'ed to new members when they join.'
};