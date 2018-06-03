exports.run = async function (Yuno, msg, args) {
    if (!args[0]) {
        return msg.channel.send('You need to specify a leave message.');
    }

    await Yuno.db.updateGuildConfig(msg.guild.id, 'memberLeaveMessage', args.join(' '));
    msg.channel.send(`Leave message successfully updated to \`${args.join(' ')}\`.`);
};

exports.props = {
    name: 'setleave',
    usage: '{command} <message>',
    aliases: [],
    description: 'Use this command to set the message sent when members leave. Available variables are `$user` and `$server`.'
};