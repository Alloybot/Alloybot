"use strict";
exports.__esModule = true;
var request = require("request");
var twitch_api_library = /** @class */ (function () {
    function twitch_api_library(CLIENT_ID, CLIENT_SECRET, OPTIONS) {
        this.CLIENT_ID = CLIENT_ID;
        this.CLIENT_SECRET = CLIENT_SECRET;
        this.OPTIONS = OPTIONS;
        this.Request = request.defaults({
            headers: { 'User-Agent': 'Request - Alloybot', 'Client-ID': this.CLIENT_ID }
        });
    }
    ;
    twitch_api_library.prototype.GetGames = function (Game_Name, Game_ID) {
        var querystring = {};
        var Options = { uri: 'https://api.twitch.tv/helix/games', json: true, qs: querystring };
        Options.qs.name = Game_Name;
        if (Game_ID) {
            Options.qs.id = Game_ID;
        }
        return this.Request(Options);
    };
    twitch_api_library.prototype.GetStreams = function (After, Before, Community_ID, First, Game_ID, Language, Type, User_ID, User_Login) {
        var querystring = {};
        var Options = { uri: 'https://api.twitch.tv/helix/streams', json: true, qs: querystring };
        if (After)
            Options.qs.after = After;
        if (Before)
            Options.qs.before = Before;
        if (Community_ID)
            Options.qs.community_id = Community_ID;
        if (First)
            Options.qs.first = First;
        if (Game_ID)
            Options.qs.game_id = Game_ID;
        if (Language)
            Options.qs.language = Language;
        if (Type)
            Options.qs.type = Type;
        if (User_ID)
            Options.qs.user_id = User_ID;
        if (User_Login)
            Options.qs.user_login = User_Login;
        return this.Request(Options);
    };
    twitch_api_library.prototype.GetStreamsMetadata = function (After, Before, Community_ID, First, Game_ID, Language, Type, User_ID, User_Login) {
        var querystring = {};
        var Options = { uri: 'https://api.twitch.tv/helix/streams/metadata', json: true, qs: querystring };
        if (After)
            Options.qs.after = After;
        if (Before)
            Options.qs.before = Before;
        if (Community_ID)
            Options.qs.community_id = Community_ID;
        if (First)
            Options.qs.first = First;
        if (Game_ID)
            Options.qs.game_id = Game_ID;
        if (Language)
            Options.qs.language = Language;
        if (Type)
            Options.qs.type = Type;
        if (User_ID)
            Options.qs.user_id = User_ID;
        if (User_Login)
            Options.qs.user_login = User_Login;
        return this.Request(Options);
    };
    twitch_api_library.prototype.GetUsers = function (ID, Login) {
        //this.REQ_OPT.uri = 'https://api.twitch.tv/helix/users';
        //this.REQ_OPT.json = true;
        //this.REQ_OPT.useQuerystring = true;
    };
    return twitch_api_library;
}());
exports.twitch_api_library = twitch_api_library;
