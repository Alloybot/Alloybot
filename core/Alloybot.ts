import * as event from 'events';
import * as Util from './lib/Util';
import * as IFace from './lib/IFace';
import { ConfigBuilder } from './lib/ConfigBuilder';

class Alloybot extends event.EventEmitter {
  public Name: string = 'Alloybot';
  public static Connections = new Map<string, IFace.IConnection>();
  public static Plugins = new Map<string, IFace.IPlugin>();

  private logger = new Util.Logger(this.Name);
  private config = new ConfigBuilder('Alloybot', require('../package.json').version);

  constructor() {
    super();
    this.emit('started', this.Name);
    this.config.addOption('name', ['string'], 'Name of the bot.');
    this.config.close();
    this.Name = this.config.getConfig().name;
  }

  private areDependenciesLoaded(name: string): boolean {
    let dependencyList = Alloybot.Plugins.get(name).getDependencies(),
      loadedDeps = [],
      missingDeps = [];

    for (let dep in dependencyList) {
      if (Alloybot.Plugins.has(dep)) {
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

  public getDependants(name: string): IFace.IPlugin[] {
    let dependants = [];
    for (let plugin in Alloybot.Plugins) {
      for (let dep in Alloybot.Plugins.get(plugin).getDependencies()) {
        if (dep == name) dependants.push(Alloybot.Plugins.get(plugin));
      }
    }
    for (let connection in Alloybot.Connections) {
      for (let dep in Alloybot.Connections.get(connection).getDependencies()) {
        if (dep == name) dependants.push(Alloybot.Connections.get(connection));
      }
    }
    return dependants;
  }

  public isPluginLoaded(plugin: IFace.IPlugin): boolean;
  public isPluginLoaded(plugin: string): boolean;
  public isPluginLoaded(plugin): boolean {
    if (typeof plugin == 'string') {
      return Alloybot.Plugins.has(plugin);
    } else {
      return Alloybot.Plugins.has(plugin.getName());
    }
  }

  public registerPlugin(plugin: IFace.IPlugin): void {
    if (Alloybot.Plugins.has(plugin.getName())) {
      this.emit('plugin.duplicate', plugin.getName());
    } else {
      Alloybot.Plugins.set(plugin.getName(), plugin);
      this.emit('plugin.registered', plugin);
    }
  }

  public getPluginCount(): number {
    return Alloybot.Plugins.size;
  }

  public getPlugins(): Map<string, IFace.IPlugin> {
    return Alloybot.Plugins;
  }

  public getPlugin(name: string): any {
    if (this.areDependenciesLoaded(name)) return Alloybot.Plugins.get(name);
  }

  public registerConnection(connection: IFace.IConnection): void {
    if (Alloybot.Connections.has(connection.getName())) {
      this.emit('connection.duplicate', connection.getName());
    } else {
      Alloybot.Connections.set(connection.getName(), connection.getConnection());
      this.emit('connection.registered', connection);
    }
  }

  public isConnectionLoaded(connection: IFace.IConnection): boolean;
  public isConnectionLoaded(connection: string): boolean;
  public isConnectionLoaded(connection): boolean {
    if (typeof connection == 'string') {
      return Alloybot.Connections.has(connection);
    } else {
      return Alloybot.Connections.has(connection.getName());
    }
  }

  public getConnectionCount(): number {
    return Alloybot.Connections.size;
  }

  public getConnections(): Map<string, IFace.IConnection> {
    return Alloybot.Connections;
  }

  public getConnection(name: string): any {
    if (this.areDependenciesLoaded(name)) return Alloybot.Connections.get(name);
  }
}

let INSTANCE = new Alloybot();

const logger = new Util.Logger('Alloybot');

INSTANCE.on('started', name => {
  logger.info('Started: ' + name);
});

INSTANCE.on('plugin.registered', plugin => {
  logger.info('Plugin Registered: ' + plugin.getName());
});

INSTANCE.on('connection.registered', connection => {
  logger.info('Connection Registered: ' + connection.getName());
});

export default INSTANCE;
export { IFace, Util, ConfigBuilder }
