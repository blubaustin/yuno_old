exports.run = async function (Yuno, msg, args) {
    if (!msg.member.hasPermission('KICK_MEMBERS')) {
        return msg.channel.send('Insufficient permissions.');
    }

    args = args.join(' ').includes('|') ?
        `Banned by ${msg.author.tag} | ${args.join(' ').split('|')[1]}` :
        `Banned by ${msg.author.tag}`;

    const userMentions = msg.mentions.users;
    if (userMentions.size === 0) {
        return msg.channel.send('No users mentioned.');
    }
    userMentions.forEach(u => {
        if (msg.member.highestRole.comparePositionTo(msg.guild.member(u).highestRole) < 0) {
            return msg.channel.send('Your role is not high enough to interact with this member.');
        }

        msg.guild.member(u).kick(args)
            .then(async () => {
                msg.channel.send({ embed: {
                    color: await Yuno.getColor(msg.guild.id),
                    description: `User \`${u.tag}\` successfully kicked.`
                }});
            })
            .catch(err => {
                msg.channel.send({ embed: {
                    color: 0xFF0000,
                    description: `Failed to kick \`${u.tag}\`:\n\`${err.message}\``
                }});
            });
    });
};

exports.props = {
    name: 'kick',
    usage: '{command} <@user> [@user2] [@user...] | [reason]',
    aliases: ['bean', 'banne'],
    description: 'TODO'
};