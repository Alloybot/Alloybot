import {
  Client,
  ChatService,
  ChannelService,
  IRequestRunner,
  ClipsService,
  GameService
} from '@mixer/client-node';

export class Service {
  private client: Client;
  private chat: ChatService;
  private channel: ChannelService;
  private clips: ClipsService;
  private game: GameService;

  public start(request: IRequestRunner): void {
    this.client = new Client(request);
    this.chat = new ChatService(this.client);
    this.channel = new ChannelService(this.client);
    this.clips = new ClipsService(this.client);
    this.game = new GameService(this.client);
  }

  public getChatService(): ChatService {
    return this.chat;
  }

  public getChannelService(): ChannelService {
    return this.channel;
  }

  public getClipsService(): ClipsService {
    return this.clips;
  }

  public getGameService(): GameService {
    return this.game;
  }
}
