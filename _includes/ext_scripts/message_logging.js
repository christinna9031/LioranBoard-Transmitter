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