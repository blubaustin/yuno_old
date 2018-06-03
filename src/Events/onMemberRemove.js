module.exports = async function onMemberRemove (member) {
    const guildData = await this.db.getGuildConfig(member.guild.id, ['memberActChannelID', 'embedColor', 'memberLeaveMessage']);
    if (!guildData || !guildData.memberActChannelID) {
        return;
    }
    member.guild.channels
        .get(guildData.memberActChannelID)
        .send({ embed: {
            color: guildData.embedColor || this.Static.defaults.embedColor,
            description: (guildData.memberLeaveMessage || this.Static.defaults.memberLeaveMessage)
                .replace(/\$server/g, member.guild.name)
                .replace(/\$user/g, member.user.username),
            image: { url: this.getRandom(this.Static.onMemberRemove) }
        }});
};