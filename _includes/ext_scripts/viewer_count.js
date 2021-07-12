//[Viewer Count script]
function LBGetViewCount(channelid, valuename) {
  const url = `https://api.twitch.tv/kraken/streams/${channelid}`;
  const method = 'GET';
  const headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': TWITCH_CLIENT_ID,
  };
  fetchRequest(url, headers, null, method)
    .then((res) => {
      let count = -1;
      if (res.stream != null) count = res.stream.viewers;
      LBSetValue(valuename, count, true);
    })
    .catch((e) => LBAlert(`Viewer Count Error: ${e}`));
}
//[Viewer Count script end]