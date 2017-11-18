module.exports = async function GetUsersByID(UserID) {
  if (UserID && typeof UserID !== 'array') {
    throw new TypeError(`${UserID} is not an array.`);
  } else if (UserID && typeof UserID === 'array') {
    if (UserID.length > 100)
      UserID.length = 100;
    UserID.forEach(function(item) {
      if (typeof item !== 'string')
        throw new TypeError(`${item} is not a string.`);
    });
  }

  let req_opt = {
    headers: {
      'Client-ID': this.CLIENT_ID
    },
    uri: 'https://api.twitch.tv/helix/users',
    json: true,
    qs: { id: UserID },
    useQuerystring: true,
    resolveWithFullResponse: true
  }

  let response = await request(req_opt);
  return response;
}
