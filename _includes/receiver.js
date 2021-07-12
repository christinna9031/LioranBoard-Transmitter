// main connection to LioranBoard Stream Deck
function connecttoboard() {
  lioranboardclient = (new WebSocket(url));
  lioranboardclient.binaryType = 'arraybuffer';
  // reconnect on disconnect
  lioranboardclient.onclose = () => {
    ConnectionStatus('toclient', 'disconnected', 'Disconnected, attempting to reconnect.', 'red');
    if (on_server == 1) {
      on_server = 0;
      clearTimeout(twitchreconnecting);
      TwitchChatConnect.close();
      pubsubserver.close();
    }
    connecttoboard();
    if (LBDebugPost) LBDebugPost('receiver', 'Connection Closed');
  };

  lioranboardclient.onerror = (e) => {
    if (LBDebugPost) LBDebugPost('receiver', `Connection Error ${JSON.stringify(e)}`);
  };
  // notice that connection is established
  lioranboardclient.onopen = (event) => {
    ConnectionStatus('toclient', 'connected', 'Connected.', 'green');
    if (typeof LBGetVersion !== 'undefined') LBGetVersion();
    if (LBDebugPost) LBDebugPost('receiver', event);

    {% include ext_commands.js %}
  };
  // receiving a message
  lioranboardclient.onmessage = (event) => {
    boardmessage(event);
  };
}
// init that function right away
connecttoboard();

// receiving a message from lioranboard
function boardmessage(event) {
  if (typeof (event.data) === 'string') {
    str = event.data;
    val = str.slice(0, 1);
    str = str.slice(2, str.length);
    switch (val) {
      default:
        break;
        // connect to pubsub now
      case '0':
        document.getElementById('topubsub').innerHTML = 'Connection request to PubSub.';
        serverurl = str;// not used
        on_server = 1;
        connectserver();
        connecttwitchchat();
        twitch_timeout = 4000;
        break;
        // transmitting LioranBoard message to pubsub
      case '1':
        pubsubserver.send(str);
        break;
        // send api request
      case '2':
        apiconnect(str);
        break;
        // JSON string from LioranBoard
      case '3':
        LioranBoardJSON = JSON.parse(str);
        LBExtensionReceived();
        if (LBDebugPost) LBDebugPost('receiver', event.data);
        break;
        // reload transmitter
      case '4':
        window.location.reload();
        break;
        // send stuff to twitch chat
      case '5':
        TwitchChatConnect.send(str);
        if (LBDebugPost) LBDebugPost('chatSent', str);
        break;
    }
  } else {
    console.log('Message received from LioranBoard is not a string.');
  }
}

// call Twitch api to get user token and info
function apiconnect(api_request) {
  // get information about OAuth token
  (function getAuthToken() {
    const url = 'https://id.twitch.tv/oauth2/validate';
    const headers = {
      Authorization: `OAuth ${api_request}`,
    };
    fetchRequest(url, headers)
      .then((res) => lioranboardclient.send(`tokeninfo:${JSON.stringify(res)}`))
      .catch((e) => LBAlert(`Twitch Oauth2 Validate Error: ${e}`));
  }())(function getUserInfo() {
    const url = 'https://api.twitch.tv/helix/users';
    const headers = {
      Authorization: `Bearer ${api_request}`,
      'Client-ID': TWITCH_CLIENT_ID,
    };
    fetchRequest(url, headers, null, 'PUT')
      .then((res) => lioranboardclient.send(`userinfo:${JSON.stringify(res)}`))
      .catch((e) => LBAlert(`Twitch Getting User Info Error: ${e}`));
  }());
}

// change connection status UI
function ConnectionStatus(id, status, text, fill) {
  document.getElementById(id).className = `${status} d-none d-md-inline-flex`;
  document.getElementById(id).innerHTML = ` ${text}`;
  document.getElementById(`${id}_circle`).setAttribute('fill', fill);
}