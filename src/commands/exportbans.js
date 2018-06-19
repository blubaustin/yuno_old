let fs = require("fs");

exports.run = async function (Yuno, msg, args) {
    if (!msg.member.hasPermission("BAN_MEMBERS"))
        return msg.channel.send('No permissions to');

    let guid = msg.guild.id;

    msg.guild.fetchBans().then(bans => {
        let arr = Array.from(bans.values()),
            json = [];

        arr.forEach((el, ind, arr) => {
            json.push(el.user.id);
        })

        let banstr = JSON.stringify(json);

        fs.writeFile("./BANS-" + guid + ".txt", banstr, (err) => {
            if (err)
                msg.channel.send("Error while saving bans :( : " + err.code);
            else
                msg.channel.send("Bans saved with the Guild Id (use it to re-apply bans) : " + guid);
        })
    })



};

exports.props = {
    name        : 'exportbans',
    usage       : '{command}',
    aliases     : [],
    description : 'Export bans'
};
