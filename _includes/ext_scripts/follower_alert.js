//[Follower Alert script]
function LBCheckFollowers() {
  const url = `https://api.twitch.tv/kraken/channels/${CheckFollowerId}/follows?limit=${30 - CheckFollowerFirst * 15}`;
  const headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': TWITCH_CLIENT_ID,
  };
  fetchRequest(url, headers)
    .then((res) => followListener(res))
    .catch((e) => LBAlert(`LB Follower Alert Error: ${e}`));

  // listen for receiving follower list
  function followListener(followerJSON) {
    if (followerJSON._total == 0) {
      LBAlert('Something went wrong with Follower Listener.');
      return 0;
    }
    let i_cd = followerJSON._total;
    if (i_cd > (30 - CheckFollowerFirst * 15)) { i_cd = (30 - CheckFollowerFirst * 15); }
    if (CheckFollowerFirst == 0) {
      for (var ii = 0; ii < i_cd; ii++) {
        CheckFollowerList.push(followerJSON.follows[ii].user.name);
      }
    }

    // go through the list and compare to old one see if there is any new names in the new one
    i_cd--;
    if (typeof oldfollowerJSON !== 'undefined') {
      for (var ii = i_cd; ii >= 0; ii--) {
        if (oldfollowerJSON.follows.some((item) => item.user.name === followerJSON.follows[ii].user.name) == false) {
          if (CheckFollowerList.some((item) => item === followerJSON.follows[ii].user.name) == false) {
            CheckFollowerList.push(followerJSON.follows[ii].user.name);
            // send to lioran board as "Follower Alert" with value1 being the name of the follower. pull 1 is their name  pull 2 is channel id of the personne
            LBTriggerExt('Follower Alert', followerJSON.follows[ii].user.name, followerJSON.follows[ii].user._id, followerJSON.follows[ii].user.display_name);
          }
        }
      }
    }
    CheckFollowerFirst = 1;
    oldfollowerJSON = followerJSON;
    followerJSON = null;
    return 1;
  }
}
function fakefollow() {
  const i_name = fakename();
  LBTriggerExt('Follower Alert', i_name.toLowerCase(), '123456789', i_name);
}
//[Follower Alert script end]