import {
  Client,
  RichEmbed,
  Permissions,
  PermissionResolvable
} from 'discord.js';

export class Service {
  private client: Client;
  private richEmbed: RichEmbed;
  private permissions: Permissions;
  private promise: Promise<string>;

  constructor() {
    this.client = new Client();
    this.richEmbed = new RichEmbed();
  }

  private connected(): void {
    this.richEmbed
      .setColor('RANDOM')
      .setAuthor(this.client.user.username, this.client.user.avatarURL);
  }

  public start(token: string, permissions: PermissionResolvable): void {
    this.promise = this.client.login(token);
    this.permissions = new Permissions(permissions);

    this.promise.then(this.connected() as any);
  }

  public getRichEmbed(): RichEmbed {
    return this.richEmbed;
  }

  public getClient(): Client {
    return this.client;
  }

  public getPermissions(): Permissions {
    return this.permissions;
  }

  public getPromise(): Promise<string> {
    return this.promise;
  }
}
