function twitchchatping() {
  TwitchChatConnect.send('PONG :tmi.twitch.tv');
}
function clear_raiders() {
  just_raided.shift();
}
// twitch chat connection
function connecttwitchchat() {
  if (on_server == 0) { return 0; }
  TwitchChatConnect = (new WebSocket('wss://irc-ws.chat.twitch.tv:443'));
  TwitchChatConnect.binaryType = 'arraybuffer';
  TwitchChatConnect.onopen = function (event) {
    ConnectionStatus('tochat', 'connected', 'Connected.', 'green');
    console.log('Connected to twitch chat');
    const i_obj = {
      topic: 'twitchchatconnected',
      type: 'MESSAGE',
    };
    lioranboardclient.send(JSON.stringify(i_obj));
    twitchpingid = setInterval(twitchchatping, 120000);
    twitch_timeout = 4000;
    if (LBDebugPost) LBDebugPost('chatReceive', 'Connection Opened');
  };
  TwitchChatConnect.onmessage = function (event) {
    if (LBDebugPost) LBDebugPost('chatReceive', event.data);
    let i_data; let i_type; let i_real_name; let i_channel; let user_id;
    let { data } = event;
    const i_count = (data.match(/\r\n/g) || []).length;
    for (let i = 0; i < i_count; i++) {
      let i_pos = data.indexOf('\r\n');
      let i_str = ` ${data.slice(0, i_pos)}`;
      data = data.slice(i_pos + 2);
      // ping back
      if (i_str.includes('PING')) {
        TwitchChatConnect.send('PONG :tmi.twitch.tv');
      } else {
        // seperate data
        i_pos = i_str.indexOf(' :') + 1;
        i_data = i_str.slice(0, i_pos);
        i_str = i_str.slice(i_pos + 1);

        // get type of data
        i_pos = i_str.indexOf(':');
        i_type = i_str.slice(0, i_pos);
        i_str = i_str.slice(i_pos + 1);
        i_real_name = i_type;
        i_pos = i_type.indexOf(' ');
        i_type = i_type.slice(i_pos + 1);
        i_pos = i_type.indexOf(' ');

        if (i_pos !== -1) {
          i_channel = i_type.slice(i_type.indexOf(' ') + 1);
          i_channel = i_channel.replace(' ', '');
          i_channel = i_channel.replace('#', '');
          i_type = i_type.slice(0, i_pos);
        }
        switch (i_type) {
          default:
            break;
          // connected
          case '001': {
            const i_obj = {
              topic: 'ChatConnected',
              type: 'MESSAGE',
            };
            lioranboardclient.send(JSON.stringify(i_obj));
          } break;
            // disconnected
          case 'USERNOTICE':
            i_type = IRCdataparse(i_data, 'msg-id');
            // raid
            if (i_type == 'raid') {
              let i_amount = IRCdataparse(i_data, 'viewerCount');
              if (i_amount == '') { i_amount = '1'; }
              const i_name = IRCdataparse(i_data, 'msg-param-displayName');
              // get user id
              user_id = IRCdataparse(i_data, 'user-id');
              i_real_name = IRCdataparse(i_data, 'login');
              // make sure the raider didn't just raid
              if (just_raided.some((item) => item === i_name) == false) {
                just_raided.push(i_name);
                setTimeout(clear_raiders, 5000);
                // send raid to the receiver
                const i_obj = {
                  topic: 'raidmessage',
                  type: 'MESSAGE',
                  login: i_real_name,
                  name: i_name,
                  user_id,
                  amount: i_amount,
                };
                lioranboardclient.send(JSON.stringify(i_obj));
              }
            }
            // subgift
            else if (i_type == 'submysterygift') {
              let i_amount = IRCdataparse(i_data, 'msg-param-mass-gift-count');
              if (i_amount == '') { i_amount = '1'; }
              let i_name = IRCdataparse(i_data, 'display-name');
              i_real_name = IRCdataparse(i_data, 'login');
              const i_userid = IRCdataparse(i_data, 'user-id');
              let i_plan = IRCdataparse(i_data, 'msg-param-sub-plan');
              if (i_plan == '2000') {
                i_plan = 'Tier 2';
              } else if (i_plan == '3000') {
                i_plan = 'Tier 3';
              } else {
                i_plan = 'Tier 1';
              }
              if ((i_userid == '') || (i_userid == '274598607')) {
                i_real_name = 'Anonymous User';
                i_name = 'Anonymous User';
              }
              // send gift sub to the receiver
              const i_obj = {
                topic: 'giftsubmessage',
                type: 'MESSAGE',
                login: i_real_name,
                name: i_name,
                user_id: i_userid,
                amount: i_amount,
                plan: i_plan,
              };
              lioranboardclient.send(JSON.stringify(i_obj));
            }
            break;
          case 'PRIVMSG': {
            // get message id
            // var i_id;
            // i_id=IRCdataparse(i_data,"id");
            // get display name
            let i_name = IRCdataparse(i_data, 'display-name');
            // get user id
            user_id = IRCdataparse(i_data, 'user-id');
            // get Emote
            const i_emote = IRCdataparse(i_data, 'emotes');
            // get color
            const i_color = IRCdataparse(i_data, 'color');
            // get user name
            i_pos = i_real_name.indexOf('!');
            i_real_name = i_real_name.slice(0, i_pos);

            // badges
            const i_badge = IRCdataparse(i_data, 'badges');
            if (i_real_name == 'jtv') {
              i_pos = i_str.indexOf('hosting');
              i_name = i_str.slice(0, i_str.indexOf(' '));
              if (just_raided.some((item) => item === i_name) == false) {
                setTimeout(clear_raiders, 5000);
                just_raided.push(i_name);
                let i_amount = i_str.slice(i_pos);
                i_amount = i_amount.replace(/\D/g, '');
                if (i_amount == '') { i_amount = '0'; }
                // send host to the receiver
                const i_obj = {
                  topic: 'hostmessage',
                  type: 'MESSAGE',
                  name: i_name,
                  user_id,
                  amount: i_amount,
                };
                lioranboardclient.send(JSON.stringify(i_obj));
              }
            } else {
              const i_obj = {
                emotes: i_emote,
                login: i_real_name,
                display_name: i_name,
                user_id,
                color: i_color,
                badge: i_badge,
                message: i_str,
                channel: i_channel,
                topic: 'chatmessage',
                type: 'MESSAGE',
              };
              lioranboardclient.send(JSON.stringify(i_obj));
            }
          } break;

          case 'WHISPER': {
            // get display name
            const i_name = IRCdataparse(i_data, 'display-name');
            // get color
            const i_color = IRCdataparse(i_data, 'color');
            // get Emote
            const i_emote = IRCdataparse(i_data, 'emotes');
            // badges
            const i_badge = IRCdataparse(i_data, 'badges');
            // get user id
            user_id = IRCdataparse(i_data, 'user-id');
            // get user name
            i_pos = i_real_name.indexOf('!');
            i_real_name = i_real_name.slice(0, i_pos);

            console.log(user_id);

            const i_obj = {
              emotes: i_emote,
              login: i_real_name,
              display_name: i_name,
              user_id,
              color: i_color,
              badge: i_badge,
              message: i_str,
              channel: 'w',
              topic: 'chatmessage',
              type: 'MESSAGE',
            };
            lioranboardclient.send(JSON.stringify(i_obj));
          } break;
        }
      }
    }
  };
  TwitchChatConnect.onclose = () => {
    if (on_server == 1) {
      ConnectionStatus('tochat', 'disconnected', `Disconnected. Attempting to reconnect in ${twitch_timeout / 1000} s.`, 'red');
      console.log(`Disconnected from twitch chat. Attempting to reconnect in ${twitch_timeout / 1000} seconds.`);
      twitchreconnecting = setTimeout(connecttwitchchat, twitch_timeout);
      twitch_timeout *= 2;
      if (twitch_timeout >= 300000) { twitch_timeout = 300000; }
    } else {
      ConnectionStatus('tochat', 'disconnected', 'Disconnected.', 'red');
      console.log('Disconnected from twitch chat.');
    }
    clearInterval(twitchpingid);
    if (LBDebugPost) LBDebugPost('chatReceive', 'Connection Closed');
  };

  TwitchChatConnect.onerror = (e) => {
    if (LBDebugPost) LBDebugPost('chatReceive', `Connection Error ${JSON.stringify(e)}`);
  };
}

// parse through irc messages
function IRCdataparse(str, parse) {
  let i_pos;
  i_pos = str.indexOf(`${parse}=`);
  if (i_pos == -1) {
    return '';
  }
  str = str.slice(i_pos + 1 + parse.length);
  i_pos = str.indexOf(';');
  if (i_pos != -1) {
    str = str.slice(0, i_pos);
  }
  return str;
}
