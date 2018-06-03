module.exports = async function onMemberJoin (member) {
    const guildData = await this.db.getGuildConfig(member.guild.id, ['memberActChannelID', 'embedColor', 'memberJoinMessage', 'joinDMMessage']);
    if (!guildData) {
        return;
    }

    if (guildData.joinDMMessage) {
        member.send({ embed: {
            title: `Welcome to ${member.guild.name}!`,
            color: guildData.embedColor || this.Static.defaults.embedColor,
            description: guildData.joinDMMessage
        }});
    }

    if (guildData.memberActChannelID) {
        member.guild.channels
            .get(guildData.memberActChannelID)
            .send({ embed: {
                color: guildData.embedColor || this.Static.defaults.embedColor,
                description: (guildData.memberJoinMessage || this.Static.defaults.memberJoinMessage)
                    .replace(/\$server/g, member.guild.name)
                    .replace(/\$user/g, member.user.username),
                image: { url: this.getRandom(this.Static.onMemberAdd) }
            }});
    }
};