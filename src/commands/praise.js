exports.run = async function (Yuno, msg) {
    if (!msg.mentions.users.size) {
        return msg.channel.send('Who do you want me to praise?');
    }

    msg.channel.send(msg.mentions.users.first().toString(), { files: [Yuno.getRandom(Yuno.Static.praiseImages)] });
};

exports.props = {
    name        : 'praise',
    usage       : '{command} @someone',
    aliases     : [],
    description : 'TODO'
};