module.exports = async function GetGamesByID(GameID) {
  if (typeof GameID !== 'array') throw new TypeError(`${GameID} is not an array.`);

  GameID.forEach(function(item) {
    if (typeof item !== 'string') throw new TypeError(`${item} is not a string.`);
  });

  let req_opt = {
    headers: {
      'Client-ID': this.CLIENT_ID
    },
    uri: 'https://api.twitch.tv/helix/games',
    json: true,
    qs: { id: GameID },
    useQuerystring: true,
    resolveWithFullResponse: true
  }

  if (req_opt.qs.id.length > 100) { req_opt.qs.id.length = 100 };

  let response = await request(req_opt);
  return response;
}
