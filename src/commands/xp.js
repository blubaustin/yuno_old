exports.run = async function (Yuno, msg) {
    const target = msg.mentions.users.filter(u => u.id !== Yuno.user.id).first() || msg.author;

    const profile = await Yuno.dbConn.get('SELECT * FROM exp WHERE userID = ? AND guildID = ?;',
        target.id, msg.guild.id);
    if (!profile) {
        return msg.channel.send('This person has not spoken yet.');
    }

    const neededExp = 5 * Math.pow(profile.level, 2) + 50 * profile.level + 100;
    msg.channel.send({ embed: {
        title: `${target.tag}'s EXP Card`,
        color: await Yuno.db.getColor(msg.guild.id),
        fields: [
            { name: 'Current Level', value: profile.level, inline: true },
            { name: 'Current EXP', value: profile.expCount, inline: true },
            { name: `EXP needed until next level (${profile.level + 1})`, value: neededExp - profile.expCount }
        ]
    }});
};

exports.props = {
    name        : 'xp',
    usage       : '{command}',
    aliases     : ['rank', 'level', 'exp'],
    description : ''
};