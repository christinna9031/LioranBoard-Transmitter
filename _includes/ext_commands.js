//[Get Version command]
//[Get Version command end]
//[Message Logging command]
//[Message Logging command end]
//[Change Stream command]
LBSendExtCommand('Change Stream', { oauth_token: 'string', channel_id: 'real', title: 'string', game: 'string' });
//[Change Stream command end]
//[Viewer Count command]
LBSendExtCommand('Get Viewer Count', { channel_id: 'real', value_name: 'string' });
//[Viewer Count command end]
//[Subscriber Count command]
LBSendExtCommand('Get Subscriber Count', { oauth_token: 'string', channel_id: 'real', value_name: 'string' });
//[Subscriber Count command end]
//[Get Channel ID command]
LBSendExtCommand('Get Channel Id', { oauth_token: 'string', name: 'string', Variable: 'string' });
//[Get Channel ID command end]
//[Follower Alert command]
LBSendExtCommand('Follower Alert', { channel_id: 'real' });
//[Follower Alert command end]
//[Bits Leaderboard command]
LBSendExtCommand('Check Leaderboard', { oauth_token: 'string' });
//[Bits Leaderboard command end]
//[Get Profile Picture command]
LBSendExtCommand('Get Profile Picture', { oauth_token: 'string', user_name: 'string', value_name: 'string' });
//[Get Profile Picture command end]

// You LioranBoard extension command will be inserted here
/*INSERT PART 2*/
 
