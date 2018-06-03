exports.run = async function (Yuno, msg, args) {
  if (!args[0]) {
      msg.channel.send('Here\'s a list of my commands:', { embed: {
          color: await Yuno.db.getColor(msg.guild.id),
          description: Array.from(Yuno.commands.values()).map(c => c.props.name).join(', ')
      }});
  } else {
      if (Yuno.commands.has(args[0]) || Yuno.aliases.has(args[0])) {
          const props = Yuno.commands.has(args[0]) ? Yuno.commands.get(args[0]).props : Yuno.commands.get(Yuno.aliases.get(args[0])).props;
          msg.channel.send({ embed: {
              title: `Help for command: ${props.name}`,
              color: await Yuno.db.getColor(msg.guild.id),
              fields: [
                  { 'name': 'Description: ', 'value': props.description, inline: false },
                  { 'name': 'Usage: ', 'value': `${'```'}\n${props.usage.replace('{command}', Yuno.Static.defaults.prefix + props.name)}${'```'}`, inline: false },
                  { 'name': 'Aliases: ', 'value': props.aliases[0] ? props.aliases.join(', ') : 'None', inline: false }
              ]
          }});
      }
  }
};

exports.props = {
  name: 'help',
  usage: '{command} [command]',
  aliases: ['halp'],
  description: 'Returns extra documentation for a specific command (or the list of all commands).'
};