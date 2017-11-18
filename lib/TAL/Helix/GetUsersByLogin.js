module.exports = async function GetUsersByLogin(UserLogin) {
  if (UserLogin && typeof UserLogin !== 'array') {
    throw new TypeError(`${UserLogin} is not an array.`);
  } else if (UserLogin && typeof UserLogin === 'array') {
    if (UserLogin.length > 100)
      UserLogin.length = 100;
    UserLogin.forEach(function(item) {
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
    qs: { login: UserLogin },
    useQuerystring: true,
    resolveWithFullResponse: true
  }

  let response = await request(req_opt);
  return response;
}
