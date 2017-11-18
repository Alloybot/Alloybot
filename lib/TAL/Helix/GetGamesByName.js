module.exports = async function GetGamesByName(GameName) {
  if (typeof GameName !== 'array') throw new TypeError(`${GameName} is not an array.`);

  GameName.forEach(function(item) {
    if (typeof item !== 'string') throw new TypeError(`${item} is not a string.`);
  });

  let req_opt = {
    headers: {
      'Client-ID': this.CLIENT_ID
    },
    uri: 'https://api.twitch.tv/helix/games',
    json: true,
    qs: { name: GameName },
    useQuerystring: true,
    resolveWithFullResponse: true
  }

  if (req_opt.qs.name.length > 100) { req_opt.qs.name.length = 100 };

  let response = await request(req_opt);
  return response;
}
