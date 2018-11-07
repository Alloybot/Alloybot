/***************
 * Alloybot *
 * cmdlist.js   *
 ****************/
const lang = _langfiles.get('alloybot');

module.exports = function() {
  let metadata = {
    name: 'cmdlist',
    desc: lang.description.cmdlist,
    usage: 'cmdlist'.prefixed().inlineCode(),
    example: 'cmdlist'.prefixed().inlineCode(),
    type: lang.type[0],
    disabled: false,
    reason: null
  };

  _bot.commands.set(metadata.name, main);
  _bot.metadata.set(metadata.name, metadata);
  _bot.groups[metadata.type].push(metadata.name);
};

function main(message) {
  let embed = _connections.get('discord').embed();

  Object.keys(_bot.groups).forEach((group) => {
    if (_bot.groups[group].length > 0)
      embed.addField(group, _bot.groups[group].join(', '));
    else embed.addField(group, lang.label.empty);
  });

  message.channel.send(embed.setTimestamp());
}
