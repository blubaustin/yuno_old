exports.run = async function (Yuno, msg, args) {
    if (!args[0]) {
        return msg.channel.send('You need to specify a welcome message.');
    }

    await Yuno.db.updateGuildConfig(msg.guild.id, 'memberJoinMessage', args.join(' '));
    msg.channel.send(`Welcome message successfully updated to \`${args.join(' ')}\`.`);
};

exports.props = {
    name: 'setjoin',
    usage: '{command} <message>',
    aliases: [],
    description: 'Use this command to set the message sent when new members join. Available variables are `$user` and `$server`.'
};