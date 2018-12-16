/***************
 * DJ Stapleton *
 * add.js   *
 ****************/
const _url = require('url');
const secToMin = require('sec-to-min');
const commander = alloybot.get('modules').get('commander');

module.exports = function() {
  let metadata = {
    name: 'add',
    desc:
      'Finds the first video returned from using the search words or link and adds it to the end of the queue.',
    usage: 'add <search words|youtube link>'.prefixed().inlineCode(),
    example: 'add khalid better'.prefixed().inlineCode(),
    type: 'Music',
    disabled: false,
    reason: null
  };

  commander.commands.set(metadata.name, main);
  commander.metadata.set(metadata.name, metadata);
};

class Video {
  constructor(url) {
    this.url = url;

    this.parsedURL = _url.parse(url);

    this.options = {
      quality: 'highestaudio',
      filter: 'audio'
    };

    if (this.parsedURL.query.t)
      this.options.begin = secToMin(this.parsedURL.query.t);
  }
}

function main(message) {
  /*const database = _connections.get('database').db;
  let collection = database.collection(`guild_${message}`);

  for (i in _bot.split) {
    let item = _bot.split[i];
    try {
      if (YouTube.validateURL(item)) {
      }
    } catch (error) {}
  }*/
}
