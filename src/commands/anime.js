const { ReactionCollector } = require('discord.js');
const he = require('he');

exports.run = async function (Yuno, msg, args) {
    let res = await Yuno.animeClient.searchAnimes(args.join(' '));
    if (!res[0]) {
        return msg.channel.send(`No anime results found for \`${args.join(' ')}\`. Did you perhaps mean to use the \`manga\` command?`);
    }

    res = await Promise.all(res.map(async item => { return {
        embed: {
            color: await Yuno.db.getColor(msg.guild.id),
            title: 'Information',
            url: `https://myanimelist.net/anime/${item.id}`,
            fields: [
                { name: 'Title', value: `${item.title} ${item.english ? `(English: ${item.english})` : ''}` },
                { name: 'Type', value: item.type, inline: true },
                { name: 'Status', value: item.status, inline: true },
                { name: 'Start date', value: item.start_date === '0000-00-00' ? 'TBD' : item.start_date, inline: true },
                { name: 'End date', value: item.end_date === '0000-00-00' ? 'TBD' : item.end_date, inline: true },
                { name: 'Episodes', value: item.episodes === 0 ? 'TBD' : item.episodes, inline: true },
                { name: 'Score', value: `${item.score}`, inline: true }
            ],
            description: Yuno.cleanSynopsis(he.decode(item.synopsis), item.id, 'anime'),
            thumbnail: { url: item.image },
            footer: { text: `Use the reactions to browse | Page 1/${res.length}`}
        }
    }; }));
    let currentPage = 0;
    const pageMsg = await msg.channel.send(res[0]);
    await pageMsg.react('◀');
    await pageMsg.react('▶');
    pageMsg.react('❌');

    const RC = new ReactionCollector(pageMsg, (r) => r.users.last().id === msg.author.id);

    const switchPages = (direction) => {
        if (['◀', '▶'].includes(direction)) {
            currentPage = direction === '◀' ?
                currentPage === 0 ? res.length - 1 : currentPage - 1 :
                currentPage === res.length - 1 ? 0 : currentPage + 1;
            res[currentPage].embed.footer = { text: `Use the reactions to browse | Page ${currentPage + 1}/${res.length}` };
            pageMsg.edit(res[currentPage]);
        } else if (direction === '❌') {
            RC.stop();
            pageMsg.delete();
            msg.delete();
        }
    };

    RC.on('collect', (element) => {
        switchPages(element._emoji.name);
        element.remove(element.users.last().id);
    });

    setTimeout(() => {
        if (!RC.ended) {
            switchPages('❌');
        }
    }, 120000);
};

exports.props = {
    name        : 'anime',
    usage       : '{command} <query>',
    aliases     : ['searchanime'],
    description : 'TODO'
};