import { MongoClient, Db } from 'mongodb';

export class Service {
  private client: MongoClient;
  private promise: Promise<MongoClient>;
  private database: Db;

  public start(url: string, options?: object): void {
    this.client = new MongoClient(url, options);
    this.promise = this.client.connect();
    this.promise.then((client: MongoClient) => {
      this.database = client.db();
    });
  }

  public getClient(): MongoClient {
    return this.client;
  }

  public getPromise(): Promise<MongoClient> {
    return this.promise;
  }

  public getDatabase(): Db {
    return this.database;
  }
}
