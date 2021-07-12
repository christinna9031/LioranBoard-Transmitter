//[Change Stream script]
function LBChangeStream(oauthtoken, channel_id, title, game) {
  const change_stream = {};
  change_stream.channel = {};
  // add title change if not empty string
  if (title !== '') {
    change_stream.channel.status = title;
  }
  // add game change if not empty string
  if (game !== '') {
    change_stream.channel.game = game;
  }
  // send request to twitch
  const url = `https://api.twitch.tv/kraken/channels/${channel_id}`;
  const headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Content-Type': 'application/json',
    Authorization: `OAuth ${oauthtoken}`,
    'Client-ID': TWITCH_CLIENT_ID,
  };
  fetchRequest(url, headers, change_stream, 'PUT')
    .then(() => LBAlert('Stream Status successfully changed'))
    .catch((e) => LBAlert(`Stream Status Error: ${e}`));
}
//[Change Stream script end]