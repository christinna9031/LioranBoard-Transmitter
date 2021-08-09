/// LB helper functions
const requestKeys = new Map();
const requestKeyLength = 32;
const requestTimeout = 2000;
function createKey() {
  let unique = 0;
  let key;
  do {
    key = '';
    for (let i = 0; i < requestKeyLength; i++) {
      key += Math.floor(Math.random() * 10);
    }
    if (!requestKeys.has(key)) {
      requestKeys.set(key, 1);
      unique = 1;
    }
  }
  while (unique === 0);
  return key;
}
function removeKey(key) {
  requestKeys.delete(key);
}
/**
* Get a variable or stack from LB without hook
* @param {string} name - name of the variable or stack
* @param {string} type - 'variable' (not defined) or stack
*/
function LBGetNoHook(name, type) {
  return new Promise((resolve, reject) => {
    const key = createKey();
    let timer;
    function listener() {
      if (typeof (event.data) !== 'string' || event.data.slice(0, 1) !== '3') return;
      msgJSON = event.data.slice(2, event.data.length);
      const dataObj = JSON.parse(msgJSON);
      if (dataObj.datatype !== key) return;
      clearTimeout(timer);
      lioranboardclient.removeEventListener('message', listener);
      resolve(dataObj);
    }
    lioranboardclient.addEventListener('message', listener);
    if (type === 'stack') {
      lioranboardclient.send(`{"type":"MESSAGE","topic":"GetStack","name":"${name}","datatype":"${key}"}`);
    } else {
      lioranboardclient.send(`{"type":"MESSAGE","topic":"GetVariable","variable":"${name}","datatype":"${key}"}`);
    }
    timer = setTimeout(() => {
      lioranboardclient.removeEventListener('message', listener);
      reject(new Error('timeout waiting for response'));
    }, requestTimeout);
  });
}

// construct extension command object
function LBConstructExtCommand(name) {
  this.type = 'MESSAGE';
  this.topic = 'ExtensionCommand';
  this.name = name;
  this.boxcount = 0;
  this.addBox = (boxname, type) => {
    const p = this.boxcount + 1;
    this[`boxname${p}`] = boxname;
    this[`boxtype${p}`] = type;
    this.boxcount += 1;
  };
}

/**
* send extension command to LB
* @param {string} name - name of the extension command
* @param {Object.<string, ('string'|'real'|'boolean')>} boxes
*   Key = box name, value = box type (string, real, boolean)
*/
function LBSendExtCommand(name, boxes) {
  const ext = new LBConstructExtCommand(name);
  for (const [key, value] of Object.entries(boxes)) {
    ext.addBox(key, value);
  }
  lioranboardclient.send(JSON.stringify(ext));
}

/**
* basic function for fetch requests
* @param {string} url - url for the fetch request.
* @param {Object} headers - headers object.
* @param {Object} body - body object.
* @param {string} method - method (default=GET)
*/
async function fetchRequest(url, headers, body, method = 'GET') {
  const params = {};
  params.method = method;
  params.headers = headers || {};
  if (body) params.body = JSON.stringify(body);
  const response = await fetch(url, params);
  let content;
  const text = await response.text();
  try {
    content = JSON.parse(text);
  } catch (e) { content = text; }
  if (!response.ok) {
    const error = (content.error) ? content.error.message || 'Something went wrong.' : 'Something went wrong.';
    throw error;
  }
  return content;
}

/**
* Send a yellow notification message to LB
* @param {string} msg - message to send
*/
function LBAlert(msg) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"AlertMessage","message":"${msg}"}`);
}

/**
* Send a popup message to LB
* @param {string} msg - message to send
*/
function LBPopUp(msg) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"PopupMessage","message":"${msg}"}`);
}

/**
* Set a value in LB
* @param {string} name - name of the variable
* @param {(string|number)} value - new value of the variable
* @param {boolean} real - whether the value is real (default = not real)
*/
function LBSetValue(name, value, real = false) {
  if (!real) value = `"${value}"`;
  lioranboardclient.send(`{"type":"MESSAGE","topic":"SetValue","valuename":"${name}","value":${value},"real":${real}}`);
}

/**
* Get a variable from LB (you can retrieve it via its hook)
* @param {string} name - name of the variable
* @param {string} hook - name of the hook to receive the data
*/
function LBGetValue(name, hook) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"GetVariable","variable":"${name}","datatype":"${hook}"}`);
}

/**
* Send an extension trigger to LB (max 20 values)
* @param {string} trigger - name of the extension trigger
* @param {(string|real)} values - values for math trigger pull command
*/
function LBTriggerExt(trigger, ...values) {
  const obj = { type: 'MESSAGE', topic: 'ExtensionTrigger', trigger };
  for (let i = 0; i < values.length; i += 1) {
    obj[`value${i + 1}`] = `${values[i]}`;
  }
  lioranboardclient.send(JSON.stringify(obj));
}

/**
* Trigger a button in LB
* @param {string} id - button ID
* @param {boolean} queuable - whether the button should be queuable (default=false)
*/
function LBTriggerBtn(id, queuable = false) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"ButtonTrigger","buttonid":"${id}","queuable":${queuable}}`);
}

/**
* Modify a button in LB
* @param {string} id - button ID
* @param {string} text - button text
* @param {number} red - red RGB value
* @param {number} green - green RGB value
* @param {number} blue - blue RGB value
* @param {string} picture - picture url
* @param {number} border - border size
*/
function LBModifyBtn(id, text = 'notext', red = -1, green = -1, blue = -1, picture = '', border = -1) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"ModifyButton","buttonid":"${id}","text":"${text}", "red":${red}, "green":${green}, "blue":${blue}, "picture":"${picture}", "border":${border}}`);
}

/**
* Get a whole stack from LB (you can retrieve it via its hook)
* @param {string} name - name of the stack
* @param {string} hook - name of the hook
*/
function LBStackGet(name, hook) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"GetStack","name":"${name}","datatype":"${hook}"}`);
}

/**
* Add a value to stack in LB
* @param {string} name - name of the stack
* @param {(string|number)} position - position to add the value to
* @param {(string|number)} value - value to add
*/
function LBStackAdd(name, position, value) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"AddStack","name":"${name}","position":"${position}", "value":"${value}"}`);
}

/**
* Replace a value in stack in LB
* @param {string} name - name of the stack
* @param {(string|number)} position - position to replace the value
* @param {(string|number)} value - value to replace
*/
function LBStackReplace(name, position, value) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"ReplaceStack","name":"${name}","position":${position}, "value":"${value}"}`);
}

/**
* Append a whole array to stack in LB
* @param {string} name - name of the stack
* @param {array} array - array to append
*/
function LBStackAppend(name, array) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"AppendStack","name":"${name}","values":${JSON.stringify(array)}}`);
}

/**
* Remove a value from stack in LB
* @param {string} name - name of the stack
* @param {(string|number)} position - position to remove the value from
*/
function LBStackRemove(name, position) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"RemoveStack","name":"${name}","position":"${position}"}`);
}

/**
* Delete a whole stack in LB
* @param {string} name - name of the stack to delete
*/
function LBStackDelete(name) {
  lioranboardclient.send(`{"type":"MESSAGE","topic":"DeleteStack","name":"${name}"}`);
}

/// LB helper functions end
