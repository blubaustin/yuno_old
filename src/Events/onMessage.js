const messageProcessors = require('../messageProcessors');

module.exports = async function onMessage (msg) {
    if (msg.author.bot) {
        return;
    }

    for (const processor of messageProcessors) {
        await processor.bind(this)(msg);
    }

    const rx = new RegExp(`<@!*${this.user.id}>`);
    const match = msg.content.slice(0, 22).match(rx);
    const prefix = match ? `${match[0]} ` : await this.prefixes.get(msg.guild ? msg.guild.id : null) || this.Static.defaults.prefix; // these are really ugly, try to refactor prefix and command parsing some time
    if (!msg.content.toLowerCase().startsWith(prefix)) {
        return;
    }

    const args = msg.content.slice(prefix.length).split(' ').filter(arg => arg.length > 0);
    let command = args.shift();

    if (this.commands.has(command)) {
        command = this.commands.get(command);
    } else if (this.aliases.has(command)) {
        command = this.commands.get(this.aliases.get(command));
    }

    if (command && command instanceof Object) {
        try {
            await command.run(this, msg, args);
        } catch (err) {
            msg.channel.send(`fuck!\n${err.message}`);
            this.log(err.stack, 'error');
        }
    }
};