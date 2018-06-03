exports.run = async function (Yuno, msg) {
    msg.channel.send(Yuno.getRandom(Yuno.Static.quotes));
};

exports.props = {
    name        : 'quote',
    usage       : '{command}',
    aliases     : [],
    description : 'TODO'
};