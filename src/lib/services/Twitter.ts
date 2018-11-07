import Twitter from 'twitter/lib/twitter';

export class Service {
  private client: Twitter;

  public start(opts?: object): void {
    this.client = new Twitter(opts);
  }

  public getClient(): Twitter {
    return this.client;
  }
}
