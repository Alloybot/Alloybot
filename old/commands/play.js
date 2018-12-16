/***************
 * DJ Stapleton *
 * play.js   *
 ****************/
const commander = alloybot.get('modules').get('commander');

module.exports = function() {
  let metadata = {
    name: 'play',
    desc:
      'Starts playing the first song in the queue. If there is a youtube link or search words after the command, it will add what it finds to the queue.',
    usage: 'play <search words|youtube link>'.prefixed().inlineCode(),
    example: 'play sick boy the chainsmokers'.prefixed().inlineCode(),
    type: 'Playlist',
    disabled: false,
    reason: null
  };

  commander.commands.set(metadata.name, main);
  commander.metadata.set(metadata.name, metadata);
};

function main(message) {}
