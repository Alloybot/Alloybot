let config = {};


config.defaults = {
  server_ip: 'localhost',
  username: 'twitchusername'
};

config.tmi = {
  options: {
    cliendId: process.env.TWITCH_CLIENT_ID,
    debug: true
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: "Alloybot",
    passowrd: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: ['#alloybot']
};

config.discord = {
  token: process.env.DISCORD_CLIENT_TOKEN
};

config.db = {
  uri: '127.0.0.1:27017/alloybotdb',
  options: {
    useMongoClient: true
  }
};

module.exports = config;
