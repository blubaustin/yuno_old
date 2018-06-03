module.exports = function onceReady () {
    setInterval(() => {
        this.dbConn.each('SELECT * FROM channels;', async (err, res) => {
            const channel = this.channels.get(res.channelID);
            if (!channel) {
                return this.db.removeChannel(res.channelID);
            }
            const oldPos = channel.position;

            if ((res.entryTime + res.timeBetweenClean - res.timeBeforeWarning) < Date.now() && !res.warned) {
                await this.dbConn.run('UPDATE channels SET warned = ? WHERE channelID = ?;', true, res.channelID);
                channel.send({ embed: {
                    color: await this.db.getColor(channel.guild.id),
                    author: {
                        name: `Yuno is going to clean in ${res.timeBeforeWarning / 60 / 1000} minutes. Speak now or forever hold your peace.`,
                        icon_url: this.user.avatarURL()
                    }
                }});
            }

            if ((res.entryTime + res.timeBetweenClean) < Date.now()) {
                await this.db.resetChannel(res.channelID);
                channel.delete();
                const newChannel = await channel.clone({ name: channel.name, withPermissions: true, withTopic: true });
                await this.dbConn.run('UPDATE channels SET channelID = ? WHERE channelID = ?;', newChannel.id, res.channelID);
                await newChannel.edit({ position: oldPos, parentID: channel.parentID });
                newChannel.setPosition(oldPos);

                newChannel.send({ embed: {
                    color: await this.db.getColor(newChannel.guild.id),
                    description: 'Yuno is done cleaning.',
                    image: { url: 'https://vignette3.wikia.nocookie.net/futurediary/images/9/94/Mirai_Nikki_-_06_-_Large_05.jpg' }
                }});
            }
        });
    }, this.config.tick || 15000);
};