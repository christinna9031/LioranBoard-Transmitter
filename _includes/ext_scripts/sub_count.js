//[Subscriber Count script]
function LBGetSubCount(oauthtoken, channelid, valuename) {
  const url = `https://api.twitch.tv/kraken/channels/${channelid}/subscriptions?limit=5`;
  const headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    Authorization: `OAuth ${oauthtoken}`,
    'Client-ID': TWITCH_CLIENT_ID,
  };
  fetchRequest(url, headers)
    .then((res) => LBSetValue(valuename, res._total - 1, true))
    .catch((e) => LBAlert(`Get Sub Count Error: ${e}`));
}
//[Subscriber Count script end]