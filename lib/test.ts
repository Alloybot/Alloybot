import { twitch_api_library } from './twitch-api-library';

let tal = new twitch_api_library('Client ID Here');
let Games = tal.GetGames('Minecraft');
Games.on('data', (data) => {
  console.log(data.toString());
});
