const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

/***********
 * Globals *
 ***********/
global._symbols = /(\W)/g;
global._events = new EventEmitter();
global._connections = new Map();
global._options = new Map();
global._modules = new Map();
global._settings = require('./settings.json');
global._loader = require('./lib/loader');
global._logger = require('./lib/logger');

/******************
 * Initialization *
 ******************/
let moduleDir = path.join(__dirname, 'modules');
let modules = fs.readdirSync(moduleDir);
let failureCount = 0;

_logger.start(`S 0/1 | Alloybot Starting | Found ${modules.length} modules.`);

modules.forEach(module => {
  _logger.pending(
    `S 0/1 | M ${modules.indexOf(module) + 1}/${
      modules.length
    } | Loading ${module}`
  );

  // Skip the example module since its not done.
  if (module.includes('example')) {
    _logger.info(
      `S 1/1 | M ${modules.indexOf(module) + 1}/${
        modules.length
      } | Skipping ${module}`
    );
    return;
  }

  // Add the module to the global collection of modules.
  try {
    fs.readdirSync(path.join(moduleDir, module)).forEach(file => {
      file = path.parse(file);
      if (file.ext == '.js') {
        let loadedModule = require(`./modules/${module}/${file.name}`);
        _modules.set(module, loadedModule);

        loadedModule(
          {
            name: module,
            total: modules.length,
            number: modules.indexOf(module) + 1
          },
          passback => {
            _logger.success(
              `S ${passback.steps}/${passback.steps} | M ${modules.indexOf(
                module
              ) + 1}/${modules.length} | Loaded ${module}`
            );
          }
        );
      }
    });
  } catch (error) {
    failureCount++;
    _logger.fatal(error);
    _logger.fatal(
      `S 0/1 | M ${modules.indexOf(module) + 1}/${
        modules.length
      } | Module '${module}' does not have a function hook in the entry file`
    );
  }
});

_logger.complete(
  `S 1/1 | Alloybot Started | Loaded ${modules.length - failureCount}/${
    modules.length
  } modules`
);
