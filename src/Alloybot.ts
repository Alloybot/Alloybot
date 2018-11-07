import * as Service from './lib/services/Services';
import { EventEmitter } from 'events';
import { Permissions } from 'discord.js';
import { DefaultRequestRunner } from '@mixer/client-node';
import { ClientOptions } from 'twitch-js';

export class Alloybot extends EventEmitter {
  private Discord: Service.Discord;
  private Mixer: Service.Mixer;
  private MongoDB: Service.MongoDB;
  private Pandora: Service.Pandora;
  private Twitch: Service.Twitch;
  private Twitter: Service.Twitter;
  private Youtube: Service.Youtube;

  constructor() {
    super();
  }

  public addDiscord(token: string, permissions: Permissions): Service.Discord {
    this.Discord = new Service.Discord();
    this.Discord.start(token, permissions);
    return this.Discord;
  }

  public addMixer(auth: any): Service.Mixer {
    this.Mixer = new Service.Mixer();
    this.Mixer.start(auth || new DefaultRequestRunner());
    return this.Mixer;
  }

  public addMongoDB(url: string, options?: object): Service.MongoDB {
    this.MongoDB = new Service.MongoDB();
    this.MongoDB.start(url, options);
    return this.MongoDB;
  }

  public addPandora(username: string, password: string): Service.Pandora {
    this.Pandora = new Service.Pandora();
    this.Pandora.start(username, password);
    return this.Pandora;
  }

  public addTwitch(options: ClientOptions): Service.Twitch {
    this.Twitch = new Service.Twitch();
    this.Twitch.start(options);
    return this.Twitch;
  }

  public addTwitter(options: object): Service.Twitter {
    this.Twitter = new Service.Twitter();
    this.Twitter.start(options);
    return this.Twitter;
  }

  public addYoutube(apiKey: string): Service.Youtube {
    this.Youtube = new Service.Youtube();
    this.Youtube.start(apiKey);
    return this.Youtube;
  }
}
