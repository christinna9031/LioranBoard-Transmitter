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
//[Get Version script]
function LBGetVersion() {
  LBGetValue('obs_websocket_version', 'LBVersionHook');
  LBGetValue('obs_studio_version', 'LBVersionHook');
  LBGetValue('lioranboard_version', 'LBVersionHook');
}

async function LBProcessVersion(obj) {
  let receiver = obj.lioranboard_version;
  const obs = obj.obs_studio_version;
  const obsws = obj.obs_websocket_version;
  let version = JSON.parse(localStorage.getItem('LBversion'));
  const versionDate = localStorage.getItem('LBversionDate');
  if (receiver == 0) receiver = '';
  if (!version || (Date.now() - versionDate > 86000000)) await fetchVersion();
  else compareVersion(version);

  // fetch the latest version from a database
  async function fetchVersion() {
    await fetch('https://6py9buvgh1.execute-api.us-west-2.amazonaws.com/main/device/version')
      .then((response) => response.json())
      .then((data) => {
        version = {};
        data.Items.forEach((element) => {
          version[element.id.S] = element.version.S;
        });
        compareVersion(version);
        localStorage.setItem('LBversion', JSON.stringify(version));
        localStorage.setItem('LBversionDate', Date.now());
      })
      .catch((e) => console.log(e));
  }

  // compare current and latest versions
  function compareVersion(v) {
    const versionOK = '<span class="connected">OK</span>';
    const versionNA = '<span style="color:#E4B314">N/A</span';
    const tsl = document.firstChild.nextSibling.nodeValue.replace(/[^\d.-]/g, '');
    const statusOBS = (num(v.obs) > num(obs)) ? '<a href="https://obsproject.com/download" target="_blank">Update</a>' : versionOK;
    const statusOBSWS = (num(v.obsws) > num(obsws)) ? '<a href="https://github.com/Palakis/obs-websocket/releases" target="_blank">Update</a>' : versionOK;
    const statusReceiver = (num(v.receiver) > num(receiver)) ? '<a href="http://lioran.servehttp.com/share/lioranboard/download.html" target="_blank">Update</a>' : versionOK;
    const statusTSL = (num(v.transmitter) > num(tsl)) ? '<a href="http://lioran.servehttp.com/share/lioranboard/download.html" target="_blank">Update</a>' : versionOK;

    // create object of all versions
    const versionObj = {
      obs_latestV: v.obs || 'N/A', obsws_latestV: v.obsws || 'N/A', receiver_latestV: v.receiver || 'N/A', streamdeck_latestV: v.streamdeck || 'N/A', transmitter_latestV: v.transmitter || 'N/A', obs_currentV: obs || 'N/A', obsws_currentV: obsws || 'N/A', receiver_currentV: receiver || 'N/A', streamdeck_currentV: 'N/A', transmitter_currentV: tsl || 'N/A', obs_status: (obs && v.obs) ? statusOBS : versionNA, obsws_status: (obsws && v.obsws) ? statusOBSWS : versionNA, receiver_status: (receiver && v.receiver) ? statusReceiver : versionNA, streamdeck_status: versionNA, transmitter_status: (tsl && v.transmitter) ? statusTSL : versionNA,
    };

    fillValues(versionObj);

    // fill version values into table
    function fillValues(verObj) {
      Object.keys(verObj).forEach((key) => {
        document.getElementById(key).innerHTML = verObj[key];
      });
    }
  }

  // convert letters to numbers in versions to easily compare them
  function num(str) {
    if (str.search(/[a-zA-Z]/) != -1) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      let letter = str.slice(str.search(/[a-zA-Z]/));
      str = str.slice(0, str.search(/[a-zA-Z]/));
      letter = letter.replace(letter, alphabet.indexOf(letter) + 1);
      str += letter;
    } else { str += 0; }
    str = str.replace(/\./g, '');
    return str;
  }
}
//[Get Version script end]
//[Message Logging script]
LBdebug = JSON.parse(localStorage.getItem('LBdebug')) || {};
dbgReceiver.checked = LBdebug.receiver;
dbgPubsub.checked = LBdebug.pubsub;
dbgChat.checked = LBdebug.chat;
LBDebugLog(dbgReceiver); LBDebugLog(dbgChat); LBDebugLog(dbgPubsub);

function LBDebugLog(e) {
  const receiver = document.getElementById('LBreceiverlog');
  const chat = document.getElementById('LBchatlog');
  const pubsub = document.getElementById('LBpubsublog');
  const listening = '<samp>Listening for traffic.</samp>';
  const disabled = '<samp>Logging is disabled.</samp>';
  // disable or enable debug logging and display it
  switch (e.id) {
    default:
      break;
    case 'dbgReceiver':
      receiver.innerHTML = (e.checked) ? '<samp>Listening for traffic in 3s.</samp>' : disabled;
      if (e.checked) setTimeout(DebugSentPacketsLB, 3000);
      LBdebug.receiver = !!(e.checked);
      break;
    case 'dbgChat':
      chat.innerHTML = (e.checked) ? listening : disabled;
      LBdebug.chat = !!(e.checked);
      break;
    case 'dbgPubsub':
      pubsub.innerHTML = (e.checked) ? listening : disabled;
      LBdebug.pubsub = !!(e.checked);
      break;
  }
  localStorage.setItem('LBdebug', JSON.stringify(LBdebug));
}

function DebugSentPacketsLB() {
  if (typeof lioranboardclient === 'undefined') return;
  lioranboardclient.__proto__._send = lioranboardclient.__proto__.send;
  lioranboardclient.__proto__.send = function (data) {
    this._send(data);
    this.send = function (data) {
      this._send(data);
      LBDebugPost('receiverSent', data);
      console.log(`<< ${data}`);
    };
  };
}

function LBDebugPost(type, msg) {
  const receiverlog = document.getElementById('LBreceiverlog');
  const pubsublog = document.getElementById('LBpubsublog');
  const chatlog = document.getElementById('LBchatlog');
  const arrowDown = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-arrow-down" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/> </svg>';
  const arrowUp = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-arrow-up" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/> </svg>';

  // post a message into the debug log if enabled
  switch (type) {
    default:
      break;
    case 'receiver':
      if (LBdebug && LBdebug.receiver) {
        receiverlog.innerHTML = `${receiverlog.innerHTML} <br> ${arrowDown} <samp>${StringifyandReplace(msg)}</samp>`;
      }
      break;
    case 'receiverSent':
      if (LBdebug && LBdebug.receiver && !((msg).includes('PONG') || (msg).includes('PING'))) {
        receiverlog.innerHTML = `${receiverlog.innerHTML} <br> ${arrowUp} <samp>${StringifyandReplace(msg)}</samp>`;
      }
      break;
    case 'pubsub':
      if (LBdebug && LBdebug.pubsub && !(msg).includes('PONG')) {
        pubsublog.innerHTML = `${pubsublog.innerHTML} <br> ${arrowDown} <samp>${StringifyandReplace(msg)} </samp>`;
      }
      break;
    case 'chatReceive':
      if (LBdebug && LBdebug.chat && !JSON.stringify(msg).includes('PING')) {
        chatlog.innerHTML = `${chatlog.innerHTML} <br> ${arrowDown} <samp>${StringifyandReplace(msg)} </samp>`;
      }
      break;
    case 'chatSent':
      if (LBdebug && LBdebug.chat && !msg.includes('PONG')) {
        chatlog.innerHTML = `${chatlog.innerHTML} <br> ${arrowUp} <samp>${StringifyandReplace(msg)}</samp>`;
      }
      break;
  }

  // stringify if message is an object and replace some symbols
  // for better readability
  function StringifyandReplace(obj) {
    if (typeof obj === 'object') obj = JSON.stringify(obj);
    const strRpl = obj.replace(/\r\n/g, '').replace(/\\/g, '').replace(/\\/g, '');
    return strRpl;
  }
}
//[Message Logging script end]
// your main script will be inserted here
/*INSERT PART 4*/