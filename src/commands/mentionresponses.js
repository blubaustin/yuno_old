const imageRegex = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;

exports.run = async function (Yuno, msg, args) {
    if (!msg.member.hasPermission('MANAGE_SERVER')) {
        return msg.channel.send('Insufficient permissions.');
    }

    const command = args.shift();
    if (command === 'add') {
        if (args[0]) {
            const trigger = args.shift();
            args = args.join(' ');
            let imageURL;

            if (imageRegex.test(args)) {
                imageURL = args.match(imageRegex)[1];
                args = args.replace(imageURL, '');
            }

            await Yuno.dbConn.run(`INSERT INTO mentionResponses (guildID, trigger, response, imageURL)
                VALUES (?, ?, ?, ?);`, msg.guild.id, trigger, args, imageURL);
            msg.channel.send(`Successfully created with trigger \`${trigger}\`, response \`${args}\`${imageURL ? ` and image ${imageURL}.` : '.'}`);
        }
    }
}

exports.props = {
    name        : 'mentionresponses',
    usage       : '{command} <add | remove | edit | list> [response trigger] [contents] [image URL]',
    aliases     : [],
    description : ''
};