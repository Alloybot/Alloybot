import { Client, ClientOptions } from 'twitch-js';

export class Service {
  private client: Client;
  private promise: Promise<[string, number]>;

  public start(options: ClientOptions): void {
    this.client = new Client(options);
    this.promise = this.client.connect();
  }

  public getClient(): Client {
    return this.client;
  }

  public getPromise(): Promise<[string, number]> {
    return this.promise;
  }
}
