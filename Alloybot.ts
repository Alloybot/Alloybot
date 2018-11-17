import { EventEmitter } from 'events';
import { Signale as SignaleType } from 'signale';
import { format } from 'util';
import path = require('path');
import fs = require('fs');
import { exec } from 'child_process';

const Settings = require('./Settings.json');
const { Signale } = require('signale');

fs.readdir(__dirname, (error, files) => {
  if (error) return;
  files.forEach(file => {
    if (path.parse(file).ext == '.env') {
      require('dotenv').config({ path: file });
    }
  });
});

export interface IConnection {
  name: String;
  dependencies: String[];
  connection: any;
}

export interface IModule {
  name: String;
  dependencies: String[];
}

export class Logger {
  private logger: SignaleType = new Signale(Settings.Signale);
  private scope: String;

  constructor(scope: String) {
    this.scope = scope;
  }

  private formatMessage(message: Object | String): String {
    if (typeof message == 'object') return format('%o', message);
    if (typeof message == 'string') return format('%s', message);
  }

  public await(message: Object | String): void {
    this.logger.await({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public complete(message: Object | String): void {
    this.logger.complete({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public error(message: Object | String): void {
    this.logger.error({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public debug(message: Object | String): void {
    this.logger.debug({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public fatal(message: Object | String): void {
    this.logger.fatal({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public fav(message: Object | String): void {
    this.logger.fav({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public info(message: Object | String): void {
    this.logger.info({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public log(message: Object | String): void {
    this.logger.log({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public note(message: Object | String): void {
    this.logger.note({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public pause(message: Object | String): void {
    this.logger.pause({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public pending(message: Object | String): void {
    this.logger.pending({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public star(message: Object | String): void {
    this.logger.star({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public start(message: Object | String): void {
    this.logger.start({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public success(message: Object | String): void {
    this.logger.success({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public warn(message: Object | String): void {
    this.logger.warn({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public watch(message: Object | String): void {
    this.logger.watch({
      prefix: this.scope,
      message: this.formatMessage(message)
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

class RootModuleLoader {
  private root = './src/modules';
  constructor() {
    fs.readdir(this.root, (error, modules) => {
      if (error) console.error(error);
      modules.forEach(_module => {
        let modulepath = path.join(this.root, _module);
        let _package = require('./' + path.join(modulepath, 'package.json'));

        if (_package.main.endsWith('.js'))
          require('./' + path.join(modulepath, _package.main));
        if (_package.main.endsWith('.ts')) {
          require('./' +
            path.join(modulepath, _package.main.replace('.ts', '.js')));
        }
      });
    });
  }
}

class Alloybot extends EventEmitter {
  public name: String = process.env['ALLOYBOT_NAME'];
  public connections = new Map<String, IConnection>();
  public modules = new Map<String, IModule>();
  public settings = Settings;

  private logger = new Logger(this.name);

  constructor() {
    super();
    new RootModuleLoader();
    this.emit('started', this.name);
  }

  private dependenciesAreLoaded(name: String): Boolean {
    let dependencyList = this.modules.get(name).dependencies,
      dependencyCount = 0,
      missingDeps = [];

    for (let dep in dependencyList) {
      if (this.modules.has(dep)) {
        dependencyCount++;
      } else {
        missingDeps.push(dep);
      }
    }

    if (dependencyCount == dependencyList.length) {
      return true;
    } else {
      this.logger.error(
        `${name} is missing ${dependencyCount}/${
          dependencyList.length
        } dependencies. - ${missingDeps.join(', ')}`
      );
    }
  }

  public registerModule(moduleClass: IModule): void {
    this.modules.set(moduleClass.name, moduleClass);
    this.emit('module.registered', moduleClass);
  }

  public isModuleLoaded(name: String): Boolean {
    return this.modules.has(name);
  }

  public getModuleCount(): Number {
    return this.modules.size;
  }

  public getModules(): Map<String, IModule> {
    return this.modules;
  }

  public getModule(name: String): any {
    return this.modules.get(name);
  }

  public registerConnection(connection: IConnection): void {
    this.connections.set(connection.name, connection.connection);
    this.emit('connection.registered', connection);
  }

  public isConnectionLoaded(name: String): Boolean {
    return this.connections.has(name);
  }

  public getConnectionCount(): Number {
    return this.connections.size;
  }

  public getConnections(): Map<String, IConnection> {
    return this.connections;
  }

  public getConnection(name: String): any {
    return this.connections.get(name);
  }
}

let INSTANCE = new Alloybot();

const logger = new Logger('global');

INSTANCE.on('module.registered', module => {
  logger.info('Module Registered: ' + module.name);
});

INSTANCE.on('connection.registered', connection => {
  logger.info('Connection Registered: ' + connection.name);
});

export { INSTANCE as Alloybot };
