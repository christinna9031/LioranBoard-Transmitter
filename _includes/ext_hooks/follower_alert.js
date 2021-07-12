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