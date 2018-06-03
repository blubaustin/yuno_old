exports.run = async function (Yuno, msg, args) {
    if (!msg.member.hasPermission('MANAGE_SERVER')) {
        return msg.channel.send('Insufficient permissions.');
    }

    if (!args[0] || !args[1]) {
        return msg.channel.send('Missing required arguments.');
    }

    const roleLevel = args.shift();

    if (!parseInt(roleLevel)) {
        return msg.channel.send('The first argument must be a number.');
    }

    const role = msg.guild.roles.find('name', args.join(' '));
    if (!role) {
        return msg.channel.send(`I wasn't able to find the role \`${args.join(' ')}\`.`);
    }

    await Yuno.db.addLevelRole(msg.guild.id, parseInt(roleLevel), role.id);
    msg.channel.send({ embed: {
        color: await Yuno.db.getColor(msg.guild.id),
        description: `Successfully linked the \`${role.name}\` role to level \`${roleLevel}\`.`
    }});
};

exports.props = {
    name        : 'setlevelrole',
    usage       : '{command} <level> <role name>',
    aliases     : [],
    description : 'Set roles to be applied when a certain role is achieved.'
};