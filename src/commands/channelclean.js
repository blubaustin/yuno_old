const { CHANNELS_PATTERN } = require('discord.js').MessageMentions;

exports.run = async function (Yuno, msg, args) {
    if (!msg.member.hasPermission('MANAGE_SERVER')) {
        return msg.channel.send('Insufficient permissions.');
    }

    if (!msg.mentions.channels.size) {
        return msg.channel.send(`You need to specify a channel. Please send \`@${msg.guild.me.displayName} help addclean\` for more information.`);
    }
    const channel = msg.mentions.channels.first();
    const existingChannels = await Yuno.db.getChannelsByGID(msg.guild.id);
    args = args.filter(arg => !CHANNELS_PATTERN.test(arg));

    if (args[0] === 'add') {
        if (existingChannels.find(c => c.channelID === channel.id)) {
            return msg.channel.send(`The channel ${channel.toString()} is already set to be cleaned.`);
        }
        if (!parseFloat(args[1])) {
            return msg.channel.send(`You need to specify the time between cleans as a number. I was unable to identify \`${args[1]}\` as a number.`);
        }
        if (args[2] && !parseInt(args[2])) {
            return msg.channel.send(`You need to specify the time before warnings as a number. I was unable to identify \`${args[2]}\` as a number.`);
        }

        await Yuno.db.addChannel(channel.id, channel.guild.id, Date.now(), parseFloat(args[1]), parseInt(args[2]));
        msg.channel.send(`Successfully added ${channel.toString()} to the clean list, to be cleaned every \`${args[1]}\` hours with \`${args[2]}\` minutes before the warning.`);
    }
};

exports.props = {
    name        : 'channelclean',
    usage       : '{command} <add | edit | remove | list> [#channel] [time between cleans in hours, number] [time before warning in minutes, number]',
    aliases     : [],
    description : 'TODO'
};