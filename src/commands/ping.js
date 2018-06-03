exports.run = async function (Yuno, msg) {
    msg.channel.send('Pong!');
};

exports.props = {
    name        : 'ping',
    usage       : '{command}',
    aliases     : [],
    description : 'Pong!'
};