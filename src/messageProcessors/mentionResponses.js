module.exports = async function mentionResponses (msg) {
    const mentionResponses = await this.dbConn.all('SELECT trigger, response, imageURL FROM mentionResponses WHERE guildID = ?;', msg.guild.id);
    if (!mentionResponses) {
        return;
    }

    for (const mentionResponse of mentionResponses) {
        if (msg.content.toLowerCase().replace(msg.client.user.toString(), '').replace(/ /g, '').includes(mentionResponse.trigger) && msg.mentions.members.has(this.user.id)) {
            msg.channel.send({ embed: {
                description: mentionResponse.response
                    .replace(/\$author/g, msg.author.username),
                color: await this.db.getColor(msg.guild.id),
                image: { url: mentionResponse.imageURL || '' }
            }}); // temp
            break;
        }
    }
}