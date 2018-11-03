/******************
 * Initialization *
 ******************/
require('./lib/format');

const EventEmitter = require('events').EventEmitter;
const mongodb = require('mongodb').MongoClient;
const discordjs = require('discord.js');
const dotenv = require('dotenv').config({
  path: './private.env'
});

global._connections = new Map();
global._options = new Map();
global._symbols = /(\W)/g;
global._langfiles = new Map([['alloybot', require('./lib/lang.json')]]);
global._loader = require('./lib/loader');
global._logger = require('./lib/logger');
global._events = new EventEmitter();
global._bot = {
  permissions: new discordjs.Permissions(
    Number(process.env['DISCORD_PERMISSIONS'])
  ),
  commands: new Map(),
  metadata: new Map(),
  prefix: process.env['CMD_PREFIX'],
  groups: {
    General: [],
    Music: [],
    Other: [],
    Playlist: [],
    Voice: []
  }
};

_connections.set('database', {
  promise: mongodb.connect(
    `mongodb://${process.env['DB_HOST']}/${process.env['DB_NAME']}`,
    { useNewUrlParser: true }
  )
});

_connections.set('discord', { client: new discordjs.Client() });
_connections.get('discord').promise = _connections
  .get('discord')
  .client.login(process.env['DISCORD_TOKEN']);

/******************
 * Event Handling *
 ******************/
const database = _connections.get('database').promise;
const discord = _connections.get('discord');

_logger.start({ prefix: '0/1', message: 'Alloybot:', suffix: 'Starting.' });

database.catch(() => {
  _logger.error({ prefix: '0/1', message: 'Database:', suffix: 'Failed.' });
});

database.then(client => {
  _connections.get('database').client = client;
  _connections.get('database').db = client.db();
  _logger.success({
    prefix: '1/1',
    message: 'Database:',
    suffix: 'Connected.'
  });
});

discord.promise.then(() => {
  _logger.success({
    prefix: '1/1',
    message: 'Discord:',
    suffix: 'Connected.'
  });
  _logger.info({
    prefix: '1/1',
    message: 'Server Count:',
    suffix: discord.client.guilds.size.toString()
  });
  discord.embed = function() {
    let embed = new discordjs.RichEmbed();
    embed.setColor('RANDOM');
    embed.setAuthor(
      discord.client.user.username,
      discord.client.user.avatarURL
    );
    return embed;
  };
});

discord.promise.catch(() => {
  _logger.error({ prefix: '0/1', message: 'Discord:', suffix: 'Failed.' });
});

Promise.all([database, discord.promise])
  .then(() => {
    _bot.createCollection = require('./lib/cycleDb');
    _loader(require('path').join(__dirname, './commands'));
    _logger.complete({
      prefix: '1/1',
      message: 'Alloybot:',
      suffix: 'Started.'
    });
  })
  .catch(error => {
    _logger.fatal({
      prefix: '0/1',
      message: 'Alloybot:',
      suffix: `${error} | Failed to start.`
    });
  });

if (process.env['DEBUG'] == true) {
  discord.client.on('debug', debug => {
    _logger.debug({ prefix: 'Discord', message: debug });
  });
}

/*************
 * onMessage *
 *************/
discord.client.on('message', message => {
  if (message.content.startsWith(_bot.prefix)) onMessage(message);
});

function onMessage(message) {
  if (message.author.id == discord.client.user.id) return;

  _bot.split = message.content.split(' ');
  _bot.command = message.content
    .split(' ')
    .shift()
    .replace(global._symbols, '');

  switch (message.channel.type) {
    case 'dm':
      discord.embed.thumbnail = message.recipient.displayAvatarURL;
      _bot.createCollection(
        message.channel.type,
        message.channel.id,
        message.channel.recipient.id
      );
      break;
    case 'group':
      _bot.createCollection(
        message.channel.type,
        message.channel.id,
        message.channel.ownerID
      );
      discord.embed.thumbnail = message.channel.iconURL;
      break;
    case 'text':
      _bot.createCollection('guild', message.guild.id, message.channel.ownerID);
      discord.embed.thumbnail = message.guild.iconURL;
      break;
    default:
      return;
  }

  try {
    _bot.commands.get(_bot.command)(message);
  } catch (error) {
    message.channel.send(
      lang.noCommand.format(
        _bot.command.inlineCode(),
        'cmdlist'.prefixed().inlineCode()
      )
    );
  }
}

/***********
 * Modules *
 ***********/
require('./modules/example/index');
