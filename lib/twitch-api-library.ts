import request = require('request');

interface LooseObject {
	[key: string]: any;
}

export class twitch_api_library {
	constructor(private CLIENT_ID: string, private CLIENT_SECRET?: string, private OPTIONS?: object) { };

	protected Request = request.defaults({
		headers: { 'User-Agent': 'Request - Alloybot', 'Client-ID': this.CLIENT_ID }
	});

	public GetGames(Game_Name: string, Game_ID?: number) {
		let querystring: LooseObject = {};
		let Options = { uri: 'https://api.twitch.tv/helix/games', json: true, qs: querystring };

		Options.qs.name = Game_Name;
		if (Game_ID) { Options.qs.id = Game_ID; }
		return this.Request(Options);
	}

	public GetStreams(After?: string, Before?: string, Community_ID?: string, First?: number, Game_ID?: string, Language?: string, Type?: string, User_ID?: string, User_Login?: string): Request {
		let querystring: LooseObject = {};
		let Options = { uri: 'https://api.twitch.tv/helix/streams', json: true, qs: querystring }

		if (After) Options.qs.after = After;
		if (Before) Options.qs.before = Before;
		if (Community_ID) Options.qs.community_id = Community_ID;
		if (First) Options.qs.first = First;
		if (Game_ID) Options.qs.game_id = Game_ID;
		if (Language) Options.qs.language = Language;
		if (Type) Options.qs.type = Type;
		if (User_ID) Options.qs.user_id = User_ID;
		if (User_Login) Options.qs.user_login = User_Login;

		return this.Request(Options);
	}

	public GetStreamsMetadata(After?: string, Before?: string, Community_ID?: string, First?: number, Game_ID?: string, Language?: string, Type?: string, User_ID?: string, User_Login?: string): Request {
		let querystring: LooseObject = {};
		let Options = { uri: 'https://api.twitch.tv/helix/streams/metadata', json: true, qs: querystring };

		if (After) Options.qs.after = After;
		if (Before) Options.qs.before = Before;
		if (Community_ID) Options.qs.community_id = Community_ID;
		if (First) Options.qs.first = First;
		if (Game_ID) Options.qs.game_id = Game_ID;
		if (Language) Options.qs.language = Language;
		if (Type) Options.qs.type = Type;
		if (User_ID) Options.qs.user_id = User_ID;
		if (User_Login) Options.qs.user_login = User_Login;

		return this.Request(Options);
	}
	public GetUsers(ID?: Array<string>, Login?: Array<string>) {
		//this.REQ_OPT.uri = 'https://api.twitch.tv/helix/users';
		//this.REQ_OPT.json = true;
		//this.REQ_OPT.useQuerystring = true;


	}
}
