function LBExtensionReceived() {
  switch (LioranBoardJSON.datatype) {
    // datatype you specified.
    default:
      console.log(LioranBoardJSON, `Warning: Hook is missing. Extension ${LioranBoardJSON.datatype} seems to not be correctly installed.`);
      break;
//[Message Logging hook]
//[Message Logging hook end]
//[Get Version hook]
    case 'LBVersionHook':
      if (typeof window.LBVersion === 'undefined') window.LBVersion = {};
      window.LBVersion[LioranBoardJSON.variable] = LioranBoardJSON.value;
      if (Object.values(window.LBVersion).length === 3) LBProcessVersion(window.LBVersion);
      break;
//[Get Version hook end]
//[Change Stream hook]
    case 'ChangeStream':
      LBChangeStream(LioranBoardJSON.oauth_token, LioranBoardJSON.channel_id, LioranBoardJSON.title, LioranBoardJSON.game);
      break;
//[Change Stream hook end]
//[Viewer Count hook]
    case 'GetViewerCount':
      LBGetViewCount(LioranBoardJSON.channel_id, LioranBoardJSON.value_name);
      break;
//[Viewer Count hook end]
//[Subscriber Count hook]
    case 'GetSubscriberCount':
      LBGetSubCount(LioranBoardJSON.oauth_token, LioranBoardJSON.channel_id, LioranBoardJSON.value_name);
      break;
//[Subscriber Count hook end]
//[Get Channel ID hook]
    case 'GetChannelId':
      GetChannelId(LioranBoardJSON.oauth_token, LioranBoardJSON.name, LioranBoardJSON.Variable);
      break;
//[Get Channel ID hook end]
//[Follower Alert hook]
    case 'FollowerAlert':
      LBAlert('Listening for Followers.')
      // cancel previous interval incase it is set again
      CheckFollowerFirst = 0;
      CheckFollowerList = new Array();
      if (typeof CheckFollowerTimer !== 'undefined') { clearInterval(CheckFollowerTimer); }
      CheckFollowerId = LioranBoardJSON.channel_id;
      LBCheckFollowers();
      // set a repeat so this happens every 10 second so you can compare old list and new list
      CheckFollowerTimer = setInterval(LBCheckFollowers, 10000);
      break;
//[Follower Alert hook end]
//[Bits Leaderboard hook]
    case 'CheckLeaderboard':
      LBCheckBitsLeaderboard(LioranBoardJSON.oauth_token);
      break;
//[Bits Leaderboard hook end]
//[Get Profile Picture hook]
    case 'GetProfilePicture':
      GetProfilePicture(LioranBoardJSON.oauth_token, LioranBoardJSON.user_name, LioranBoardJSON.value_name);
      break;
//[Get Profile Picture hook end]
//You hooks will be inserted here
/*INSERT PART 3*/
   }
}
