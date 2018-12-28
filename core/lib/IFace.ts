import { default as Alloybot, IFace, Util, ConfigBuilder } from '../Alloybot';
import { EventEmitter } from 'events';

abstract class IPlugin extends EventEmitter {
  protected Name: string = '';
  protected Dependencies: string[] = [];
  protected Dependants: IPlugin[];
  protected Logger: Util.Logger;
  protected Config;

  constructor() {
    super();
  }

  public getName(): string {
    return this.Name;
  }

  public getDependencies(): string[] {
    return this.Dependencies;
  }

  public getDependants(): IPlugin[] {
    return this.Dependants;
  }
}

abstract class IConnection extends IPlugin {
  protected Connection: any;

  constructor() {
    super();
  }

  public getConnection(): any {
    return this.Connection;
  }

  public connect(): any {
    return this;
  }
}

export { IConnection, IPlugin }
