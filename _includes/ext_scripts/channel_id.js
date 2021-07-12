//[Get Channel ID script]
function GetChannelId(oauthtoken, loginname, variable) {
  const url = `https://api.twitch.tv/helix/users?login=${loginname}`;
  const headers = {
    Authorization: `Bearer ${oauthtoken}`,
    'Client-ID': TWITCH_CLIENT_ID,
  };
  fetchRequest(url, headers)
    .then((res) => lioranboardclient.send(`{"type":"MESSAGE","topic":"SetVariable","variable":"${variable}","value":"${res.data[0].id}"}`))
    .catch((e) => LBAlert(`Get Channel ID Error: ${e}`));
}
//[Get Channel ID script end]