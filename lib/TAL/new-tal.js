//const request = require('request-promise-native');
//const tracer = require('tracer');
//const chalk = require('chalk');

module.exports = class tal {
  constructor(CLIENT_ID, CLIENT_SECRET) {};
  Helix = {
    GetGamesByID:         require('./Helix/GetGamesByID.js'),
    GetGamesByName:       require('./Helix/GetGamesByName.js'),
    GetStreams:           require('./Helix/GetStreams.js'),
    GetStreamsMetadata:   require('./Helix/GetStreamsMetadata.js'),
    GetUsersByID:         require('./Helix/GetUsersByID.js'),
    GetUsersByLogin:      require('./Helix/GetUsersByLogin.js')
  };

  Kraken = {};
}
