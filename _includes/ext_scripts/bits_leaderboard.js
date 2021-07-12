//[Bits Leaderboard script]
function LBCheckBitsLeaderboard(oauthtoken) {
  const url = 'https://api.twitch.tv/helix/bits/leaderboard?count=3';
  const headers = {
    Authorization: `Bearer ${oauthtoken}`,
    'Client-ID': TWITCH_CLIENT_ID,
  };

  fetchRequest(url, headers)
    .then((res) => BitsLeaderboardListener(res))
    .catch((e) => LBAlert(`Bits Leaderboard Error: ${e}`));
  // listening for twitch reply
  function BitsLeaderboardListener(BitsLeaderboardJSON) {
    // set values for all the relevant info
    LBSetValue('no1_bits', BitsLeaderboardJSON.data[0].user_name, false);
    LBSetValue('no1_bits_score', BitsLeaderboardJSON.data[0].score, true);
    LBSetValue('no2_bits', BitsLeaderboardJSON.data[1].user_name, false);
    LBSetValue('no2_bits_score', BitsLeaderboardJSON.data[1].score, true);
    LBSetValue('no3_bits', BitsLeaderboardJSON.data[2].user_name, false);
    LBSetValue('no3_bits_score', BitsLeaderboardJSON.data[2].score, true);
    // send an extension trigger "Bits Leaderboard"
    LBTriggerExt('Bits Leaderboard', '');
  }
}
//[Bits Leaderboard script end]