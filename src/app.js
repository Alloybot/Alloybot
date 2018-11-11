require('./lib/format');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

/***********
 * Globals *
 ***********/
global.alloybot = new Map([
  ['symbols', /(\W)/g],
  ['events', new EventEmitter()],
  ['connections', new Map()],
  ['options', new Map()],
  ['modules', new Map()],
  ['settings', require('./settings.json')]
]);
global._loader = require('./lib/loader');
global._logger = require('./lib/logger');

/******************
 * Initialization *
 ******************/
let init = {
  path: path.join(__dirname, 'modules'),
  dir: fs.readdirSync(path.join(__dirname, 'modules')),
  failed: 0
};

alloybot.get('events').emit('alloybot.init.start');
_logger.start(`S 0/1 | Alloybot Starting | Found ${init.dir.length} modules.`);

init.dir.forEach(module => {
  _logger.pending(
    `S 0/1 | M ${init.dir.indexOf(module) + 1}/${
      init.dir.length
    } | Loading ${module}`
  );

  // Skip the example module since its not done.
  if (init.dir.includes('example')) {
    _logger.info(
      `S 1/1 | M ${init.dir.indexOf(module) + 1}/${
        init.dir.length
      } | Skipping ${module}`
    );
    return;
  }

  // Add the module to the global collection of modules.
  try {
    fs.readdirSync(path.join(init.path, module)).forEach(file => {
      file = path.parse(file);
      if (file.ext === '.js') {
        require(`./modules/${module}/${file.name}`)(
          {
            name: module,
            total: init.dir.length,
            number: init.dir.indexOf(module) + 1
          },
          callback => {
            _logger.success(
              `S ${callback}/${callback} | M ${init.dir.indexOf(module) + 1}/${
                init.dir.length
              } | Loaded ${module}`
            );
          }
        );
        alloybot.get('events').emit('alloybot.module.load.success');
      }
    });
  } catch (error) {
    init.failed++;

    alloybot.get('events').emit('alloybot.module.load.error', callback);
    callback(error, module);

    _logger.fatal(
      `S 0/1 | M ${init.dir.indexOf(module) + 1}/${
        init.dir.length
      } | Failed to load '${module}'`
    );
  }
});

alloybot.get('events').emit('alloybot.init.success');
_logger.complete(
  `S 1/1 | Alloybot Started | Loaded ${init.dir.length - init.failed}/${
    init.dir.length
  } modules`
);
