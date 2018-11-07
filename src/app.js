/******************
 * Initialization *
 ******************/
require('./lib/format');

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

global._settings = require('./settings.json');
global._connections = new Map();
global._options = new Map();
global._symbols = /(\W)/g;
global._langfiles = new Map([['alloybot', require('./lib/lang.json')]]);
global._loader = require('./lib/loader');
global._logger = require('./lib/logger');
global._events = new EventEmitter();
global._bot = {
  commands: new Map(),
  metadata: new Map(),
  prefix: _settings.prefix,
  groups: {
    General: [],
    Music: [],
    Other: [],
    Playlist: [],
    Voice: []
  }
};

_logger.start({ prefix: '0/1', message: 'Alloybot:', suffix: 'Starting.' });

_bot.createCollection = require('./lib/cycleDb');
_loader(require('path').join(__dirname, './commands'));
_logger.complete({
  prefix: '1/1',
  message: 'Alloybot:',
  suffix: 'Started.'
});

/***********
 * Modules *
 ***********/
fs.readdirSync('./modules').forEach(module => {
  if (module.includes('example')) return;
  require(path.join(__dirname, `./modules/${module}`));
});
