let fs = require("fs");

exports.run = async function (Yuno, msg, args) {
    if (args.length === 0)
        return msg.channel.send("Give the guild-id please.");

    let guid = args[0];

    fs.readFile("./BANS-" + guid + ".txt", (err, data) => {
        if (err)
            msg.channel.send("Error while retrieving bans : ", err.code);
        else {
            console.log("[BanMSystem] Applying bans...");
            try {
                let bans = JSON.parse(data);
                bans.forEach((el, ind, arr) => {
                    try {
                        msg.guild.ban(el);
                    } catch(e) {
                        console.log("Skipped", el);
                    }
                })
                msg.channel.send("Ban successful");
            } catch(e) {
                console.log("[BanMSystem] Bans we're not saved as JSON. Error :((((");
                msg.channel.send("Bans aren't in JSON. Error.");
            }
        }
    })
};

exports.props = {
    name        : 'importbans',
    usage       : '{command} <guild-id>',
    aliases     : [],
    description : 'Import bans'
};
