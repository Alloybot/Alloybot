module.exports = async function GetStreamsMetadata(Options = {}) {
  if (typeof Options !== 'object') throw new TypeError(`${Options} is not an object.`);
  if (Options.after && typeof Options.after !== 'string')
    throw new TypeError(`${Options.after} is not a string.`);
  if (Options.before && typeof Options.before !== 'string')
    throw new TypeError(`${Options.before} is not a string.`);
  if (Options.community_id && typeof Options.community_id !== 'array') {
    throw new TypeError(`${Options.community_id} is not an array.`);
  } else if (Option.community_id && typeof Options.community_id === 'array') {
    if (Options.community_id.length > 100)
      Options.community_id.length = 100;
    Options.community_id.forEach(function(item) {
      if (typeof item !== 'string')
        throw new TypeError(`${item} is not a string.`);
    });
  }
  if (Options.first && typeof Options.first !== 'number') {
    throw new TypeError(`${Options.first} is not a number.`);
  } else if (Options.first && typeof Options.first === 'number') {
    if (Options.first > 100)
      Options.first = 100;
  }
  if (Options.game_id && typeof Options.game_id !== 'array') {
    throw new TypeError(`${Options.game_id} is not an array.`);
  } else if (Options.game_id && typeof Options.game_id === 'array') {
    if (Options.game_id.length > 100)
      Options.game_id.length = 100;
    Options.game_id.forEach(function(item) {
     if (typeof item !== 'string')
       throw new TypeError(`${item} is not a string.`);
    });
  }
  if (Options.language && typeof Options.language !== 'array') {
    throw new TypeError(`${Options.language} is not an array.`);
  } else if (Options.language && Options.language === 'array') {
    if (Options.language.length > 100)
      Options.language.length = 100;
    Options.language.forEach(function(item) {
      if (typeof item !== 'string')
        throw new TypeError(`${item} is not a string.`);
    });
  }
  if (Options.type && typeof Options.type !== 'string')
    throw new TypeError(`${Options.type} is not a string.`);
  if (Options.user_id && typeof Options.user_id !== 'array') {
    throw new TypeError(`${Options.user_id} is not an array.`);
  } else if (Options.user_id && typeof Options.user_id === 'array') {
    if (Options.user_id.length > 100)
      Options.user_id.length = 100;
    Options.user_id.forEach(function(item) {
      if (typeof item !== 'string')
        throw new TypeError(`${item} is not a string.`);
    });
  }
  if (Options.user_login && typeof Options.user_login !== 'array') {
    throw new TypeError(`${Options.user_login} is not an array.`);
  } else if (Options.user_login && typeof Options.user_login === 'array') {
    if (Options.user_login.length > 100)
      Options.user_login.length = 100;
    Options.user_Login.forEach(function(item) {
      if (typeof item !== 'string')
        throw new TypeError(`${item} is not a string.`);
    });
  }

  let Queries = new Map(Object.entries(Options));

  let req_opt = {
    headers: {
      'Client-ID': this.CLIENT_ID
    },
    uri: 'https://api.twitch.tv/helix/streams/metadata',
    json: true,
    qs: {},
    useQuerystring: true,
    resolveWithFullResponse: true
  }

  if (Queries.has('after'))
    req_opt.qs.after = Queries.get('after');
  if (Queries.has('before'))
    req_opt.qs.before = Queries.get('before');
  if (Queries.has('community_id'))
    req_opt.qs.community_id = Queries.get('community_id');
  if (Queries.has('first'))
    req_opt.qs.first = Queries.get('first');
  if (Queries.has('game_id'))
    req_opt.qs.game_id = Queries.get('game_id');
  if (Queries.has('language'))
    req_opt.qs.language = Queries.get('language');
  if (Queries.has('type'))
    req_opt.qs.type = Queries.get('type');
  if (Queries.has('user_id'))
    req_opt.qs.user_id = Queries.get('user_id');
  if (Queries.has('user_login'))
    req_opt.qs.user_login = Queries.get('user_login');

  let response = await request(req_opt);
  return response;
}
