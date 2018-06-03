const warnings = new Set();

const INVITE_URL_REGEX = /(?: |^|https?:\/\/)discord\.gg(?:\/#)?(?:\/invite)?\/([a-z0-9-]+)/gi;

module.exports = async function spamFilter (msg) {
    if (msg.member.hasPermission('MANAGE_MESSAGES')) {
        return;
    }

    if (INVITE_URL_REGEX.test(msg.content)) {
        msg.member.ban({ days: 1, reason: 'Autobanned by spam filter' });
    }


    if (msg.channel.name.toLowerCase().startsWith('nsfw_')) {
        if (msg.content.toLowerCase().includes('http') || msg.attachments.first()) {
            return;
        }
        if (warnings.has(msg.author.id)) {
            msg.member.ban({ days: 1, reason: 'Autobanned by spam filter' });
            warnings.delete(msg.author.id);
        } else {
            msg.author.send('7. If you wish to discuss or comment on a photo or section do it in  mainchat. Hentai channels are for photo/video posting onlynot text.\nFailure to comply will result in a ban.');
            warnings.add(msg.author.id);
             msg.delete();
        }
        return;
    }

    if (msg.content.indexOf("@everyone") > -1 || msg.content.indexOf("@here") > -1) {
        msg.member.ban({
            days: 1,
            reason: "Autobanned by spam filter: usage of @everyone/@here"
        });
    }

    const messages = msg.channel.messages.last(4);
        if (messages.length === 4 && messages.every(m => m.author.id === msg.author.id) && msg.channel.name.toLowerCase().startsWith('main')) {
        if (warnings.has(msg.author.id)) {
            msg.member.ban({ days: 1, reason: 'Autobanned by spam filter' });
            warnings.delete(msg.author.id);
        } else {
            msg.reply('Please keep your messages under 4  messages long. This is your one and only warning.\nFailure to comply will result in a ban.');
            warnings.add(msg.author.id);
        }
    }
};
