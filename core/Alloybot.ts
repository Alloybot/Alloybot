import { exec } from 'child_process';
import { EventEmitter } from 'events';
import { Signale } from 'signale';
import path = require('path');
import fs = require('fs');

export class Logger extends Signale {
  constructor(scope: string, interactive?: boolean) {
    super({
      interactive: interactive,
      scope: scope,
      types: require('./config/_Logger.json').Signale.types
    });
    this.config({
      displayScope: true,
      displayBadge: false,
      displayDate: false,
      displayFilename: false,
      displayLabel: true,
      displayTimestamp: true,
      underlineLabel: false,
      underlineMessage: false,
      underlinePrefix: false,
      underlineSuffix: false,
      uppercaseLabel: true
    });
  }
}

export class Loader {
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
          new Loader(f);
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
  private root = './src/plugins';
  private logger = new Logger('Plugin Loader');
  constructor() {
    fs.readdir(path.join(__dirname, this.root), (error, plugins) => {
      if (error) this.logger.error(error);
      plugins.forEach(_plugin => {
        let pluginpath = path.join(this.root, _plugin);
        let _package = require('./' + path.join(pluginpath, 'package.json'));

        if (_package.main.endsWith('.js'))
          require('./' + path.join(pluginpath, _package.main));
        if (_package.main.endsWith('.ts')) {
          require('./' +
            path.join(pluginpath, _package.main.replace('.ts', '.js')));
        }
      });
    });
  }
}

class InitializePlugins {
  private root = './src/plugins';
  private logger = new Logger('Init');
  constructor() {
    fs.readdir(path.join(__dirname, this.root), (error, plugins) => {
      if (error) this.logger.error(error);
      plugins.forEach(_plugin => {
        let pluginpath = path.join(this.root, _plugin);
        if (!fs.existsSync(path.join(pluginpath, '/node_modules'))) {
          process.chdir(path.join(__dirname, pluginpath));
          exec('npm install ', (npmerror, npmout, npmerr) => {
            this.logger.info('Installing Packages');
            exec(
              'tsc --build ./tsconfig.json',
              (typeerror, typeout, typeerr) => {
                this.logger.info('Compiling Plugins');
              }
            );
          });
        }
      });
    });
  }
}

export type DependantList = (IPlugin | IConnection)[];

export interface IConnection {
  readonly name: string;
  readonly dependencies: string[];
  readonly dependants: DependantList;
  connection: any;
}

export interface IPlugin {
  readonly name: string;
  readonly dependencies: string[];
  readonly dependants: DependantList;
}

class Alloybot extends EventEmitter {
  public name: string = process.env['ALLOYBOT_NAME'];
  public connections = new Map<string, IConnection>();
  public plugins = new Map<string, IPlugin>();

  private logger = new Logger(this.name);

  constructor() {
    super();
    new InitializePlugins();
    this.emit('started', this.name);
  }

  private areDependenciesLoaded(name: string): boolean {
    let dependencyList = this.plugins.get(name).dependencies,
      loadedDeps = [],
      missingDeps = [];

    for (let dep in dependencyList) {
      if (this.plugins.has(dep)) {
        loadedDeps.push(dep);
      } else {
        missingDeps.push(dep);
      }
    }

    if (loadedDeps == dependencyList) {
      return true;
    } else {
      this.logger.error(
        `${name} is missing ${missingDeps.length}/${
          dependencyList.length
        } dependencies. - ${missingDeps.join(', ')}`
      );
      return false;
    }
  }

  public getDependants(name: string): DependantList {
    let dependants = [];
    for (let plugin in this.plugins) {
      for (let dep in this.plugins.get(plugin).dependencies) {
        if (dep == name) dependants.push(this.plugins.get(plugin));
      }
    }
    for (let connection in this.connections) {
      for (let dep in this.connections.get(connection).dependencies) {
        if (dep == name) dependants.push(this.connections.get(connection));
      }
    }
    return dependants;
  }

  public isPluginLoaded(plugin: IPlugin): boolean;
  public isPluginLoaded(plugin: string): boolean;
  public isPluginLoaded(plugin): boolean {
    if (typeof plugin == 'string') {
      return this.plugins.has(plugin);
    } else {
      return this.plugins.has(plugin.name);
    }
  }

  public registerPlugin(plugin: IPlugin): void {
    if (this.plugins.has(plugin.name)) {
      this.emit('plugin.duplicate', plugin.name);
    } else {
      this.plugins.set(plugin.name, plugin);
      this.emit('plugin.registered', plugin);
    }
  }

  public getPluginCount(): number {
    return this.plugins.size;
  }

  public getPlugins(): Map<string, IPlugin> {
    return this.plugins;
  }

  public getPlugin(name: string): any {
    if (this.areDependenciesLoaded(name)) return this.plugins.get(name);
  }

  public registerConnection(connection: IConnection): void {
    if (this.connections.has(connection.name)) {
      this.emit('connection.duplicate', connection.name);
    } else {
      this.connections.set(connection.name, connection.connection);
      this.emit('connection.registered', connection);
    }
  }

  public isConnectionLoaded(connection: IConnection): boolean;
  public isConnectionLoaded(connection: string): boolean;
  public isConnectionLoaded(connection): boolean {
    if (typeof connection == 'string') {
      return this.connections.has(connection);
    } else {
      return this.connections.has(connection.name);
    }
  }

  public getConnectionCount(): number {
    return this.connections.size;
  }

  public getConnections(): Map<string, IConnection> {
    return this.connections;
  }

  public getConnection(name: string): any {
    if (this.areDependenciesLoaded(name)) return this.connections.get(name);
  }
}

let INSTANCE = new Alloybot();

const logger = new Logger('Alloybot');

INSTANCE.on('started', name => {
  logger.info('Started: ' + name);
  process.chdir(path.join(__dirname, '../../..'));
  new PluginLoader();
});

INSTANCE.on('plugin.registered', plugin => {
  logger.info('Plugin Registered: ' + plugin.name);
});

INSTANCE.on('connection.registered', connection => {
  logger.info('Connection Registered: ' + connection.name);
});

export { INSTANCE as Alloybot };
