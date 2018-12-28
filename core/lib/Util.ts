import { exec } from 'child_process';
import { Signale } from 'signale';
import * as path from 'path';
import * as fs from 'fs';

class Logger extends Signale {
  constructor(scope: string, types?: object, interactive?: boolean) {
    super({
      scope: scope,
      types: types,
      interactive: interactive
    });
    this.config({
      "displayScope": true,
      "displayBadge": false,
      "displayDate": false,
      "displayFilename": false,
      "displayLabel": true,
      "displayTimestamp": true,
      "underlineLabel": false,
      "underlineMessage": false,
      "underlinePrefix": false,
      "underlineSuffix": false,
      "uppercaseLabel": true
    });
  }
}

class ClassLoader {
  constructor(directory: fs.PathLike) {
    // Get "direcory" stats
    fs.lstat(directory, function(error, stats) {
      if (stats.isDirectory()) {
        // Get all files in "directory"
        let directoryList = fs.readdirSync(directory),
          f;
        for (let file in directoryList) {
          // Join the current directory and each file
          f = path.join(directory.toString(), directoryList[file]);
          // Instantiate this class again but with the new directory
          new ClassLoader(f);
        }
        // If "directory" is a .js file, load it, and run the init function.
      } else {
        let file = path.parse(directory.toString());
        if (file.ext == '.js') require(directory.toString());
      }
    });
  }
}

class PluginLoader {
  private root = '../plugins';
  private logger = new Logger('Plugin Loader');
  constructor() {
    fs.readdir(path.join(__dirname, this.root), (error, plugins) => {
      if (error) this.logger.error(error);
      plugins.forEach(_plugin => {
        if (path.parse(_plugin).name == 'Install') return;
        let pluginpath = path.join(this.root, _plugin);
        let _package = require(path.join(pluginpath, 'package.json'));

        if (_package.main.endsWith('.js'))
          require(path.join(pluginpath, _package.main));
        if (_package.main.endsWith('.ts')) {
          require(path.join(pluginpath, _package.main.replace('.ts', '.js')));
        }
      });
    });
  }
}

export { PluginLoader, ClassLoader, Logger }
