import { EventEmitter } from 'events';
import { Signale as SignaleType } from 'signale';
import { format } from 'util';
import path = require('path');
import fs = require('fs');

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

export class Logger {
  private logger: SignaleType = new Signale(Settings.Signale);
  private scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  private formatMessage(message: object | string): string {
    if (typeof message == 'object') return format('%o', message);
    if (typeof message == 'string') return format('%s', message);
  }

  public await(message: object | string): void {
    this.logger.await({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public complete(message: object | string): void {
    this.logger.complete({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public error(message: object | string): void {
    this.logger.error({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public debug(message: object | string): void {
    this.logger.debug({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public fatal(message: object | string): void {
    this.logger.fatal({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public fav(message: object | string): void {
    this.logger.fav({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public info(message: object | string): void {
    this.logger.info({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public log(message: object | string): void {
    this.logger.log({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public note(message: object | string): void {
    this.logger.note({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public pause(message: object | string): void {
    this.logger.pause({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public pending(message: object | string): void {
    this.logger.pending({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public star(message: object | string): void {
    this.logger.star({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public start(message: object | string): void {
    this.logger.start({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public success(message: object | string): void {
    this.logger.success({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public warn(message: object | string): void {
    this.logger.warn({
      prefix: this.scope,
      message: this.formatMessage(message)
    });
  }

  public watch(message: object | string): void {
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

class PluginLoader {
  private root = './src/plugins';
  constructor() {
    fs.readdir(this.root, (error, plugins) => {
      if (error) console.error(error);
      plugins.forEach(_module => {
        let pluginpath = path.join(this.root, _module);
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
  public name: string = process.env['ALLOYBOT.NAME'];
  public connections = new Map<string, IConnection>();
  public plugins = new Map<string, IPlugin>();
  public settings = Settings;

  private logger = new Logger(this.name);

  constructor() {
    super();
    new PluginLoader();
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

const logger = new Logger('global');

INSTANCE.on('plugin.registered', plugin => {
  logger.info('Plugin Registered: ' + plugin.name);
});

INSTANCE.on('connection.registered', connection => {
  logger.info('Connection Registered: ' + connection.name);
});

export { INSTANCE as Alloybot };
