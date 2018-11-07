import * as YoutubeDL from 'ytdl-core';
import { YouTube as YoutubeAPI } from 'simple-youtube-api';

export class Service {
  private client: typeof YoutubeDL;
  private api: YoutubeAPI;

  public start(apiKey: string): void {
    this.client = YoutubeDL;
    this.api = new YoutubeAPI(apiKey);
  }
}
