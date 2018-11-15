import { EventEmitter } from 'events';
import { Signale as SignaleType } from 'signale';
import { format } from 'util';
import path = require('path');
import fs = require('fs');

export const Settings = require('./Settings.json');
const { Signale } = require('signale');

class Alloybot extends EventEmitter {
  public name: String = Settings.Alloybot.name;
  public connections = new Map<String, IConnection>();
  public modules = new Map<String, IModule>();
  public settings = Settings;

  private logger = new Logger(this.name);

  constructor() {
    super();
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
    if (this.dependenciesAreLoaded(typeof moduleClass)) {
      this.modules.set(typeof moduleClass, moduleClass);
      this.emit('ModuleBase.registered', moduleClass);
    } else {
      this.emit('ModuleBase.skipped', typeof moduleClass);
    }
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
    if (this.dependenciesAreLoaded(typeof connection)) {
      this.connections.set(typeof connection, connection);
      this.emit('connection.registered', connection);
    } else {
      this.emit('connection.skipped', typeof connection);
    }
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

export { INSTANCE as Alloybot };

export interface IConnection {
  name: String;
  dependencies: Array<String>;
  client: any;
}

export interface IModule {
  name: String;
  dependencies: Array<String>;
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
      // If "directory" is a directory
      if (stats.isDirectory()) {
        // Get all files in "directory"
        let directoryList = fs.readdirSync(directory);
        let f,
          l = directoryList.length;
        for (let file in directoryList) {
          // Join the current directory and each file
          f = path.join(directory.toString(), directoryList[file]);
          // Instantiate this class again but with the new directory
          new Loader(f);
        }
        // If "directory" is a .js file, load it, and run the init function.
      } else {
        let file = path.parse(directory.toString());
        if (file.ext == '.js')
          return { name: file.name, file: require(directory.toString())() };
      }
    });
  }
}
