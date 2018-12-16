import * as event from 'events';
import * as Util from './lib/Util';
import * as Type from './lib/Common';
import { ConfigBuilder } from './lib/ConfigBuilder';

class Alloybot extends event.EventEmitter {
  public name: string = require('./config/Alloybot').name;
  public connections = new Map<string, Type.IConnection>();
  public plugins = new Map<string, Type.IPlugin>();

  private logger = new Util.Logger(this.name);
  private config = new ConfigBuilder('test/bois/Alloybot');

  constructor() {
    super();
    new Util.Setup();
    this.emit('started', this.name);
    this.config.addOption('name', [ 'string' ], 'Alloybot Test Subject', 'Name of the bot.');
    this.config.close();
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

  public getDependants(name: string): Type.IPlugin[] {
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

  public isPluginLoaded(plugin: Type.IPlugin): boolean;
  public isPluginLoaded(plugin: string): boolean;
  public isPluginLoaded(plugin): boolean {
    if (typeof plugin == 'string') {
      return this.plugins.has(plugin);
    } else {
      return this.plugins.has(plugin.name);
    }
  }

  public registerPlugin(plugin: Type.IPlugin): void {
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

  public getPlugins(): Map<string, Type.IPlugin> {
    return this.plugins;
  }

  public getPlugin(name: string): any {
    if (this.areDependenciesLoaded(name)) return this.plugins.get(name);
  }

  public registerConnection(connection: Type.IConnection): void {
    if (this.connections.has(connection.name)) {
      this.emit('connection.duplicate', connection.name);
    } else {
      this.connections.set(connection.name, connection.connection);
      this.emit('connection.registered', connection);
    }
  }

  public isConnectionLoaded(connection: Type.IConnection): boolean;
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

  public getConnections(): Map<string, Type.IConnection> {
    return this.connections;
  }

  public getConnection(name: string): any {
    if (this.areDependenciesLoaded(name)) return this.connections.get(name);
  }
}

let INSTANCE = new Alloybot();

const logger = new Util.Logger('Alloybot');

INSTANCE.on('started', name => {
  logger.info('Started: ' + name);
});

INSTANCE.on('plugin.registered', plugin => {
  logger.info('Plugin Registered: ' + plugin.name);
});

INSTANCE.on('connection.registered', connection => {
  logger.info('Connection Registered: ' + connection.name);
});

export default INSTANCE;
export { Type, Util, ConfigBuilder }
