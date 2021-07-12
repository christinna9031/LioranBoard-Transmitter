//[Get Profile Picture script]
function GetProfilePicture(oauthtoken, user_name, value_name) {
  const url = `https://api.twitch.tv/kraken/users?login=${user_name}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${oauthtoken}`,
    'Client-ID': TWITCH_CLIENT_ID,
    Accept: 'application/vnd.twitchtv.v5+json',
  };
  fetchRequest(url, headers)
    .then((res) => LBSetValue(value_name, res.users[0].logo))
    .catch((e) => LBAlert(`Get Profile Picture Error: ${e}`));
}
//[Get Profile Picture script end]