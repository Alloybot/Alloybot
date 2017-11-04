"use strict";
exports.__esModule = true;
var twitch_api_library_1 = require("./twitch-api-library");
var tal = new twitch_api_library_1.twitch_api_library('Client ID Here');
var Games = tal.GetGames('Minecraft');
Games.on('data', function (data) {
    console.log(data.toString());
});
