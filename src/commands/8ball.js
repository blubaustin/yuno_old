exports.run = async function (Yuno, msg, args) {
    if (!args[0]) {
        return msg.channel.send('What do you want to ask the Magic 8 ball?');
    }

    const result = Yuno.getRandom(Yuno.Static.ballResponses);
    msg.channel.send({ embed: {
        description: result[0],
        color: parseInt(result[1], '16')
    }});
};

exports.props = {
    name        : '8ball',
    usage       : '{command} <question>',
    aliases     : [],
    description : 'TODO'
};