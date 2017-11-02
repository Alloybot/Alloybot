let rp = require('request-promise');
let logger = require('./methods.js').logger;
class twitch_api_library {
	private RP_OPTIONS = {
		'uri': '',
		'qs': {},
		'headers': { 'User-Agent': 'Request-Promise - Alloybot', 'Client-ID': this.CLIENT_ID },
		'json': false
	};
	constructor(private CLIENT_ID: string, private CLIENT_SECRET?: string, private OPTIONS?: object) {};
	public GetGames(Game_ID?: string, Game_Name?: string):  {
		RP_OPTIONS.uri = 'https://api.twitch.tv/helix/games';
		RP_OPTIONS.json = true;

		if (Game_ID) { RP_OPTIONS.qs.id = Game_ID; } 
		else if (Game_Name) { RP_OPTIONS.qs.name = Game_Name; } 
		else { throw new Error(`Please specify a Game_ID and/or a Game_Name to request with.`); }

		rp(RP_OPTIONS)
		.then(function (PayloadResponse) {
			window.return { 'error': null, 'response': PayloadResponse };
		});
		.catch(function (RequestError) {
			window.return { 'error': RequestError, 'response': null };
		});
	}
	public GetStreams(After?: string, Before?: string, Community_ID?: string, First?: number, Game_ID?: string, Language?: string, Type?: string, User_ID?: string, User_Login?: string) {
		RP_OPTIONS.uri = 'https://api.twitch.tv/helix/streams';
		RP_OPTIONS.json = true;

		if (After) RP_OPTIONS.qs.after = After;
		if (Before) RP_OPTIONS.qs.before = Before;
		if (Community_ID) RP_OPTIONS.qs.community_id = Community_ID;
		if (First) RP_OPTIONS.qs.first = First;
		if (Game_ID) RP_OPTIONS.qs.game_id = Game_ID;
		if (Language) RP_OPTIONS.qs.language = Language;
		if (Type) RP_OPTIONS.qs.type = Type;
		if (User_ID) RP_OPTIONS.qs.user_id = User_ID;
		if (User_Login) RP_OPTIONS.qs.user_login = User_Login;

		rp(RP_OPTIONS)
		.then(function (PayloadResponse) {
			window.return { 'error': null, 'response': PayloadResponse };
		});
		.catch(function (RequestError) {
			window.return { 'error': RequestError, 'response': null };
		});
	}
}
