/***************
 * DJ Stapleton *
 * playlist.js  *
 ****************/
const commander = alloybot.get('modules').get('commander');

module.exports = function() {
  let metadata = {
    name: 'queue',
    desc: 'Lists everything in the queue for the server.',
    usage: 'queue'.prefixed().inlineCode(),
    example: 'queue'.prefixed().inlineCode(),
    type: 'Music',
    disabled: false,
    reason: null
  };

  commander.commands.set(metadata.name, main);
  commander.metadata.set(metadata.name, metadata);
};

function main(message) {}
