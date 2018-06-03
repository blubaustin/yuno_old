exports.run = async function (Yuno, msg) {
    if (!msg.mentions.users.size) {
        return msg.channel.send('Who do you want me to scold?');
    }

    msg.channel.send(msg.mentions.users.first().toString(), { files: [Yuno.getRandom(Yuno.Static.scoldImages)] });
};

exports.props = {
    name        : 'scold',
    usage       : '{command} @someone',
    aliases     : [],
    description : 'TODO'
};