// call Twitch api to get user token and info
function apiconnect(api_request) {
  // get information about OAuth token
  (function getAuthToken() {
    const url = 'https://id.twitch.tv/oauth2/validate';
    const headers = {
      Authorization: `OAuth ${api_request}`,
    };
    fetchRequest(url, headers)
      .then((res) => lioranboardclient.send(`tokeninfo:${JSON.stringify(res)}`))
      .catch((e) => LBAlert(`Twitch Oauth2 Validate Error: ${e}`));
  }());
  (function getUserInfo() {
    const url = 'https://api.twitch.tv/helix/users';
    const headers = {
      Authorization: `Bearer ${api_request}`,
      'Client-ID': TWITCH_CLIENT_ID,
    };
    fetchRequest(url, headers, null, 'PUT')
      .then((res) => lioranboardclient.send(`userinfo:${JSON.stringify(res)}`))
      .catch((e) => LBAlert(`Twitch Getting User Info Error: ${e}`));
  }());
}
