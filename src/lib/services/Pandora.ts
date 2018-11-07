import { Anesidora } from 'anesidora';
import anesidora = require('../../types/anesidora');

export class Service {
  private pandora: anesidora;
  private client: Function;

  public start(username: string, password: string): void {
    this.pandora = new Anesidora(username, password);
  }

  public getClient(): Function {
    this.pandora.login(this.client);
    return this.client;
  }
}
