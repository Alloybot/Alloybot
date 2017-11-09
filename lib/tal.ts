import Request = require('request-promise');

interface LooseObject {
  [key: string]: any;
}

export class tal {
  constructor(private CLIENT_ID: string, private CLIENT_SECRET?: string, private OPTIONS?: object) { };

	/* public async CreateEntitlementGrant(manifest_id: string, type: string): Promise<Request> {
		let querystring: LooseObject = { manifest_id: manifest_id, type: type };
		let Options = { headers: { 'Authorization': `Bearer {App Access Token}` }, uri: 'https://api.twitch.tv/helix/entitlements/upload', json: true, qs: querystring };
	} */

  public async GetGamesByName(name: Array<string>): Promise<Request> {
    let querystring: LooseObject = { name: name };
    let Options = { headers: { 'Client-ID': this.CLIENT_ID }, uri: 'https://api.twitch.tv/helix/games', json: true, qs: querystring, useQuerystring: true };

    if (querystring.name.length > 100) { querystring.name.length = 100 };

    return await Request(Options);
  }

  public async GetGamesByID(id: Array<string>): Promise<Request> {
    let querystring: LooseObject = { id: id };
    let Options = { headers: { 'Client-ID': this.CLIENT_ID }, uri: 'https://api.twitch.tv/helix/games', json: true, qs: querystring, useQuerystring: true };

    if (querystring.id.length > 100) { querystring.id.length = 100 };

    return await Request(Options);
  }

  public async GetStreams(after?: string, before?: string, community_id?: Array<string>, first?: number, game_id?: Array<string>, language?: Array<string>, type?: string, user_id?: Array<string>, user_login?: Array<string>): Promise<Request> {
    let querystring: LooseObject = {};
    let Options = { headers: { 'Client-ID': this.CLIENT_ID }, uri: 'https://api.twitch.tv/helix/streams', json: true, qs: querystring, useQuerystring: true };

    if (after) querystring.after = after;
    if (before) querystring.before = before;
    if (community_id && community_id.length <= 100) { querystring.community_id = community_id } else { community_id.length = 100; querystring.community_id = community_id };
    if (first && first <= 100) { querystring.first = first } else { first = 100; querystring.first = first };
    if (game_id && game_id.length <= 100) { querystring.game_id = game_id } else { game_id.length = 100; querystring.game_id = game_id };
    if (language && language.length <= 100) { querystring.language = language } else { language.length = 100; querystring.language = language };
    if (type) querystring.type = type;
    if (user_id && user_id.length <= 100) { querystring.user_id = user_id } else { user_id.length = 100; querystring.user_id = user_id };
    if (user_login && user_login.length <= 100) { querystring.user_login = user_login } else { user_login.length = 100; querystring.user_login = user_login };

    return await Request(Options);
  }

  public async GetStreamsMetadata(after?: string, before?: string, community_id?: Array<string>, first?: number, game_id?: Array<string>, language?: Array<string>, type?: string, user_id?: Array<string>, user_login?: Array<string>): Promise<Request> {
    let querystring: LooseObject = {};
    let Options = { headers: { 'Client-ID': this.CLIENT_ID }, uri: 'https://api.twitch.tv/helix/streams/metadata', json: true, qs: querystring, useQuerystring: true };

		if (after) querystring.after = after;
    if (before) querystring.before = before;
    if (community_id && community_id.length <= 100) { querystring.community_id = community_id } else { community_id.length = 100; querystring.community_id = community_id };
    if (first && first <= 100) { querystring.first = first } else { first = 100; querystring.first = first };
    if (game_id && game_id.length <= 100) { querystring.game_id = game_id } else { game_id.length = 100; querystring.game_id = game_id };
    if (language && language.length <= 100) { querystring.language = language } else { language.length = 100; querystring.language = language };
    if (type) querystring.type = type;
    if (user_id && user_id.length <= 100) { querystring.user_id = user_id } else { user_id.length = 100; querystring.user_id = user_id };
    if (user_login && user_login.length <= 100) { querystring.user_login = user_login } else { user_login.length = 100; querystring.user_login = user_login };

    return await Request(Options);
  }

  public async GetUsers(ID?: Array<string>, Login?: Array<string>): Promise<Request> {
    let querystring: LooseObject = {};
    let Options = { headers: { 'Client-ID': this.CLIENT_ID }, uri: 'https://api.twitch.tv/helix/users', json: true, qs: querystring };



    return;
  }
}
