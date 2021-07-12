/// PubSub connection
// connect to Twitch pubsub
function connectserver() {
  pubsubserver = (new WebSocket('wss://pubsub-edge.twitch.tv'));
  // attempt to reconnect on disconnect, unless LioranBoard is disconnected
  pubsubserver.onclose = function (event) {
    if (on_server == 1) {
      connectserver();
      ConnectionStatus('topubsub', 'disconnected', 'Connection closed. Attempting to reconnect.', 'red');
      const i_obj = {
        topic: 'pubsubdisconnected',
        type: 'MESSAGE',
      };
      lioranboardclient.send(JSON.stringify(i_obj));
      // lioranboardclient.send("pubsubdisconnected");
    } else {
      ConnectionStatus('topubsub', 'disconnected', 'Connection closed.', 'red');
    }
    if (LBDebugPost) LBDebugPost('pubsub', event);
  };
  // notify lioranboard that pubsub connection is establishd successfully
  pubsubserver.onopen = function (event) {
    ConnectionStatus('topubsub', 'connected', 'Connected.', 'green');
    const i_obj = {
      topic: 'pubsubconnected',
      type: 'MESSAGE',
    };
    lioranboardclient.send(JSON.stringify(i_obj));
    console.log('Connected to PubSub');
    // lioranboardclient.send("pubsubconnected");
    if (LBDebugPost) LBDebugPost('pubsub', 'Connection Opened');
  };
  // receive data from pubsub, so send it to LioranBoard
  pubsubserver.onmessage = function (event) {
    servermessage(event);
    if (LBDebugPost) LBDebugPost ('pubsub', event.data);
  };
  pubsubserver.onerror = function (e) {
    if (LBDebugPost) LBDebugPost('pubsub', `Connection Error ${JSON.stringify(e)}`);
  };
}

// receive message from pubsub
function servermessage(event) {
  // console.log("Pubsub message received.")
  if (typeof (event.data) === 'string') {
    // console.log(event.data)
    lioranboardclient.send(event.data);
  } else {
    // console.log("Message received from PubSub is not a string")
  }
}
/// PubSub connection end