interface IPlugin {
  readonly name: string;
  readonly dependencies: string[];
  readonly dependants: IPlugin[];
}

interface IConnection extends IPlugin {
  connection: any;
}

export { IConnection, IPlugin }
